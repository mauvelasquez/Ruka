import { createHash } from 'crypto'
import { createClient } from '../../../../lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ success: false, error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { rut, match, distance, extracted_data } = body

    if (!rut || match === undefined || distance === undefined) {
      return Response.json({ success: false, error: 'Datos incompletos' }, { status: 400 })
    }

    const rutHash = createHash('sha256').update(rut.replace(/[.\-\s]/g, '').toUpperCase()).digest('hex')

    if (match) {
      // Check if this RUT hash is already used by a different user
      const { data: existing } = await supabase
        .from('identity_verifications')
        .select('user_id')
        .eq('rut_hash', rutHash)
        .maybeSingle()

      if (existing && existing.user_id !== user.id) {
        return Response.json({
          success: false,
          error: 'Este RUT ya está asociado a otra cuenta. Contacta soporte si crees que es un error.',
        })
      }

      // Upsert verification record
      const { error: verError } = await supabase
        .from('identity_verifications')
        .upsert(
          {
            user_id:          user.id,
            rut_hash:         rutHash,
            verified_at:      new Date().toISOString(),
            method:           'id_ocr_face_match',
            confidence_score: distance,
            attempts:         1,
          },
          { onConflict: 'rut_hash' }
        )

      if (verError) throw verError

      // Update profile
      const { error: profError } = await supabase
        .from('profiles')
        .update({
          verification_status:       'verified',
          verification_completed_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (profError) throw profError

      return Response.json({ success: true, status: 'verified' })
    } else {
      // Failed attempt — count how many this user has had
      const { count } = await supabase
        .from('identity_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      const attempts = (count ?? 0) + 1

      if (attempts >= 3) {
        await supabase
          .from('profiles')
          .update({ verification_status: 'pending' })
          .eq('id', user.id)

        return Response.json({
          success: false,
          status:  'pending',
          error:   'Superaste el máximo de intentos. Tu caso quedará en revisión manual.',
        })
      }

      return Response.json({
        success:          false,
        status:           'failed',
        attempts_used:    attempts,
        attempts_left:    3 - attempts,
        error:            'Los rostros no coinciden. Asegúrate de tener buena iluminación e intentar nuevamente.',
      })
    }
  } catch (err) {
    console.error('[verify-id/complete]', err.message)
    return Response.json({ success: false, error: 'Error interno del servidor.' }, { status: 500 })
  }
}
