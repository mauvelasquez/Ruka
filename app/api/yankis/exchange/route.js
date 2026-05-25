import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// POST /api/yankis/exchange
// body: { requestId, action: 'confirm' | 'cancel' }
// confirm → debit traveler (from_user), credit host (to_user)
// cancel  → refund traveler (from_user)
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

  // Only to_user can confirm/cancel as host
  if (exchange.to_user_id !== user.id && exchange.from_user_id !== user.id) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  try {
    if (action === 'confirm') {
      // Host earns 1 Yanki
      await supabase.rpc('credit_yankis', {
        p_user_id:     exchange.to_user_id,
        p_amount:      1,
        p_type:        'earned',
        p_description: 'Intercambio confirmado — anfitrión',
        p_exchange_id: requestId,
      })
      // Traveler spends 1 Yanki (non-blocking if insufficient)
      const { error: debitErr } = await supabase.rpc('debit_yankis', {
        p_user_id:     exchange.from_user_id,
        p_amount:      1,
        p_description: 'Intercambio confirmado — viajero',
        p_exchange_id: requestId,
      })
      if (debitErr) {
        console.warn('[yankis/exchange] debit failed (low balance):', debitErr.message)
      }
    } else if (action === 'cancel') {
      // Refund traveler if they had been debited
      const { error: refundErr } = await supabase.rpc('credit_yankis', {
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

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[yankis/exchange] error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
