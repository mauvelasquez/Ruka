import { createHash } from 'crypto'
import { createClient } from '../../../../lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { sendPartialVerificationEmail, sendIdentidadVerificadaEmail } from '../../../../lib/emails'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ success: false, error_code: 'OCR_ERROR', error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { rut, identification_number, match, distance, extracted_data } = body

    if (match === undefined || distance === undefined) {
      return Response.json({ success: false, error_code: 'OCR_ERROR', error: 'Datos incompletos' }, { status: 400 })
    }

    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Read current selfie_attempts + identification_country from profile
    const { data: profile } = await admin
      .from('profiles')
      .select('selfie_attempts, identification_country, id_full_name, full_name')
      .eq('id', user.id)
      .single()

    const currentAttempts = profile?.selfie_attempts ?? 0
    const identificationCountry = profile?.identification_country ?? 'CL'
    const userName = profile?.id_full_name || profile?.full_name || null

    if (match) {
      // Successful face match

      // For Chilean documents: deduplicate via rut_hash in identity_verifications
      if (rut && identificationCountry === 'CL') {
        const rutHash = createHash('sha256').update(rut.replace(/[.\-\s]/g, '').toUpperCase()).digest('hex')

        const { data: existing } = await supabase
          .from('identity_verifications')
          .select('user_id')
          .eq('rut_hash', rutHash)
          .maybeSingle()

        if (existing && existing.user_id !== user.id) {
          return Response.json({
            success: false,
            error_code: 'DOCUMENT_DUPLICATE',
            error: 'Este RUT ya está asociado a otra cuenta. Contacta soporte si crees que es un error.',
          })
        }

        await supabase
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
      }

      // Update profile: verified + liveness passed
      const { error: profError } = await admin
        .from('profiles')
        .update({
          verification_status:       'verified',
          verification_completed_at: new Date().toISOString(),
          liveness:                  true,
          selfie_attempts:           0,
        })
        .eq('id', user.id)

      if (profError) throw profError

      sendIdentidadVerificadaEmail(user.email, userName).catch(() => {})

      return Response.json({ success: true, status: 'verified' })
    } else {
      // Failed face match — increment persistent counter
      const newAttempts = currentAttempts + 1

      await admin
        .from('profiles')
        .update({ selfie_attempts: newAttempts })
        .eq('id', user.id)

      if (newAttempts >= 3) {
        // Bypass: mark as partially verified (document verified, no liveness)
        await admin
          .from('profiles')
          .update({
            verified:                  true,
            verification_status:       'id_verified',
            verification_completed_at: new Date().toISOString(),
            liveness:                  false,
          })
          .eq('id', user.id)

        // Send partial verification email (non-blocking)
        sendPartialVerificationEmail(user.email, userName).catch(() => {})

        return Response.json({
          success:    true,
          bypass:     true,
          status:     'partial',
          error_code: 'SELFIE_BYPASS',
        })
      }

      return Response.json({
        success:       false,
        status:        'failed',
        error_code:    'FACE_MISMATCH',
        error:         'Los rostros no coinciden. Asegúrate de tener buena iluminación e intenta nuevamente.',
        attempts_used: newAttempts,
        attempts_left: 3 - newAttempts,
      })
    }
  } catch (err) {
    console.error('[verify-id/complete]', err.message)
    return Response.json({ success: false, error_code: 'OCR_ERROR', error: 'Error interno del servidor.' }, { status: 500 })
  }
}
