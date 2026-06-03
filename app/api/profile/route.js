import { createClient } from '../../../lib/supabase/server'

export const runtime = 'nodejs'

const ALLOWED_FIELDS = ['phone', 'birth_date', 'country_user', 'avatar']

export async function PATCH(req) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()

    const updates = {}
    for (const field of ALLOWED_FIELDS) {
      if (field in body) updates[field] = body[field] ?? null
    }
    if (Object.keys(updates).length === 0) {
      return Response.json({ error: 'Sin campos válidos' }, { status: 400 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id,phone,birth_date,country_user,verification_status,status,name,email,avatar')
      .single()

    if (error) {
      console.error('[api/profile PATCH]', error.message)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, profile })
  } catch (err) {
    console.error('[api/profile PATCH] unexpected:', err.message)
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
