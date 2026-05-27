import { createClient } from '../../../../lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ success: false, error: 'No autenticado' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('identification_number, id_full_name')
      .eq('id', user.id)
      .single()

    if (!profile?.identification_number || !profile?.id_full_name) {
      return Response.json({ success: false, error: 'Sin datos de OCR previos' }, { status: 400 })
    }

    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { error: updateErr } = await admin.from('profiles').update({
      verified:                  true,
      verification_status:       'id_verified',
      verification_completed_at: new Date().toISOString(),
    }).eq('id', user.id)
    if (updateErr) {
      console.error('[verify-id/confirm-existing] update failed:', updateErr.message)
      return Response.json({ success: false, error: 'Error al guardar la verificación.' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('[verify-id/confirm-existing]', err.message)
    return Response.json({ success: false, error: 'Error al confirmar identidad.' }, { status: 500 })
  }
}
