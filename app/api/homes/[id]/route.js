import { createClient } from '../../../../lib/supabase/server'

export const runtime = 'nodejs'

const ALLOWED_FIELDS = [
  'title', 'description', 'airbnb_url',
  'category', 'subtype', 'type', 'private_bathroom', 'bed_type', 'shared_with',
  'bedrooms', 'bathrooms', 'max_guests',
  'amenities', 'images',
  'availability_periods',
  'country_code', 'region', 'region_code', 'comuna', 'city', 'direccion', 'coords',
]

export async function PATCH(req, { params }) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const homeId = params.id
    const body = await req.json()

    const updates = {}
    for (const field of ALLOWED_FIELDS) {
      if (field in body) updates[field] = body[field] ?? null
    }
    if (Object.keys(updates).length === 0) {
      return Response.json({ error: 'Sin campos válidos' }, { status: 400 })
    }

    const { data: home, error } = await supabase
      .from('homes')
      .update(updates)
      .eq('id', homeId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json({ error: 'Hogar no encontrado o sin permiso' }, { status: 404 })
      }
      console.error('[api/homes PATCH]', error.message)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, home })
  } catch (err) {
    console.error('[api/homes PATCH] unexpected:', err.message)
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
