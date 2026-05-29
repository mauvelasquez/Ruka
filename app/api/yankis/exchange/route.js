import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Service-role client: credit_yankis / debit_yankis son SECURITY DEFINER con
// EXECUTE revocado para authenticated/anon. Solo service_role puede invocarlas.
// También se usa para leer yankis_transactions de ambas partes (bypass RLS)
// y garantizar idempotencia por intercambio.
function serviceClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )
}

// POST /api/yankis/exchange
// body: { requestId, action: 'confirm' | 'cancel' }
// confirm → debit traveler (from_user), credit host (to_user). Idempotente.
// cancel  → refund traveler SOLO si fue debitado previamente. Idempotente.
export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { requestId, action } = await req.json()
  if (!requestId || !['confirm', 'cancel'].includes(action)) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
  }

  const { data: exchange, error: fetchErr } = await supabase
    .from('exchange_requests')
    .select('id, from_user_id, to_user_id, status')
    .eq('id', requestId)
    .single()

  if (fetchErr || !exchange) {
    return NextResponse.json({ error: 'Intercambio no encontrado' }, { status: 404 })
  }

  // SECURITY FIX #6: solo el anfitrión (to_user) puede confirmar; ambos pueden cancelar
  const isHost     = exchange.to_user_id   === user.id
  const isTraveler = exchange.from_user_id === user.id

  if (!isHost && !isTraveler) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }
  if (action === 'confirm' && !isHost) {
    return NextResponse.json({ error: 'Solo el anfitrión puede confirmar el intercambio' }, { status: 403 })
  }

  const admin = serviceClient()

  try {
    if (action === 'confirm') {
      // Idempotencia: si ya se liquidó este intercambio (existe un 'earned'
      // ligado a él), no volver a acreditar/debitar.
      const { data: settled } = await admin
        .from('yankis_transactions')
        .select('id')
        .eq('exchange_id', requestId)
        .eq('type', 'earned')
        .limit(1)
        .maybeSingle()

      if (settled) {
        return NextResponse.json({ ok: true, skipped: true })
      }

      // Host earns 1 Yanki
      await admin.rpc('credit_yankis', {
        p_user_id:     exchange.to_user_id,
        p_amount:      1,
        p_type:        'earned',
        p_description: 'Intercambio confirmado — anfitrión',
        p_exchange_id: requestId,
      })
      // Traveler spends 1 Yanki (non-blocking if insufficient balance)
      const { error: debitErr } = await admin.rpc('debit_yankis', {
        p_user_id:     exchange.from_user_id,
        p_amount:      1,
        p_description: 'Intercambio confirmado — viajero',
        p_exchange_id: requestId,
      })
      if (debitErr) {
        console.warn('[yankis/exchange] debit failed (low balance):', debitErr.message)
      }
    } else if (action === 'cancel') {
      // Refund SOLO si el viajero fue debitado por este intercambio
      // (evita acuñar Yankis al rechazar una solicitud pending nunca confirmada)
      // e idempotente: no reembolsar dos veces.
      const { data: txs } = await admin
        .from('yankis_transactions')
        .select('type')
        .eq('exchange_id', requestId)
        .eq('user_id', exchange.from_user_id)

      const wasDebited     = (txs || []).some(t => t.type === 'spent')
      const alreadyRefunded = (txs || []).some(t => t.type === 'refunded')

      if (wasDebited && !alreadyRefunded) {
        const { error: refundErr } = await admin.rpc('credit_yankis', {
          p_user_id:     exchange.from_user_id,
          p_amount:      1,
          p_type:        'refunded',
          p_description: 'Intercambio cancelado — reembolso',
          p_exchange_id: requestId,
        })
        if (refundErr) {
          console.warn('[yankis/exchange] refund failed:', refundErr.message)
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[yankis/exchange] error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
