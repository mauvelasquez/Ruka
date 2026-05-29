import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Service-role client: credit_yankis es SECURITY DEFINER con EXECUTE revocado
// para authenticated/anon. Solo service_role puede invocarla.
function serviceClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )
}

// POST /api/yankis/bonus — 3 Yankis de bienvenida, idempotente
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = serviceClient()

  // Idempotente: solo dar bonus si no hay transacciones de tipo 'bonus' previas
  const { data: existing } = await admin
    .from('yankis_transactions')
    .select('id')
    .eq('user_id', user.id)
    .eq('type', 'bonus')
    .limit(1)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const { error } = await admin.rpc('credit_yankis', {
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
