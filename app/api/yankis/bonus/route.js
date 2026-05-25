import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// POST /api/yankis/bonus — 3 Yankis de bienvenida, idempotente
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Idempotente: solo dar bonus si no hay transacciones de tipo 'bonus' previas
  const { data: existing } = await supabase
    .from('yankis_transactions')
    .select('id')
    .eq('user_id', user.id)
    .eq('type', 'bonus')
    .limit(1)
    .single()

  if (existing) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const { error } = await supabase.rpc('credit_yankis', {
    p_user_id:     user.id,
    p_amount:      3,
    p_type:        'bonus',
    p_description: 'Bienvenida a Rukka — 3 Yankis de regalo',
  })

  if (error) {
    console.error('[yankis/bonus]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, amount: 3 })
}
