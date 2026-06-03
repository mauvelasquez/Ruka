import { createClient } from '../../../lib/supabase/server'
import { sendHomeSavedEmail } from '../../../lib/emails'

export const runtime = 'nodejs'

export async function POST(req) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return Response.json({ error: 'No autorizado' }, { status: 401 })
    }

    const data = await req.json()

    const { data: newHome, error } = await supabase.from('homes').insert({
      user_id:           user.id,
      title:             data.title,
      description:       data.description || '',
      short_description: (data.description || '').slice(0, 120),
      type:              data.subtype || data.type || 'Casa',
      category:          data.category || 'full_home',
      subtype:           data.subtype || null,
      region:            data.region || null,
      comuna:            data.comuna || null,
      direccion:         data.direccion || null,
      coords:            data.coords || null,
      city:              data.city || data.comuna || null,
      country:           data.country || 'Chile',
      country_code:      data.country_code || 'CL',
      region_code:       data.region_code || null,
      location:          data.location || `${data.city || data.comuna || ''}, ${data.region || ''}`,
      bedrooms:          data.bedrooms || 1,
      bathrooms:         data.bathrooms || 1,
      max_guests:        data.maxGuests || data.max_guests || 2,
      amenities:         data.amenities || [],
      images:            data.images?.length
        ? data.images
        : [`https://picsum.photos/seed/${Date.now()}/800/500`],
      availability_periods: data.availabilityPeriods || [],
      private_bathroom:  data.private_bathroom || false,
      bed_type:          data.bed_type || null,
      shared_with:       data.shared_with || null,
      airbnb_url:        data.airbnb_url || null,
      featured:          false,
    }).select().single()

    if (error) {
      console.error('[api/homes POST]', error.message, error.code)
      return Response.json({ error: error.message, code: error.code }, { status: 400 })
    }

    // Fire-and-forget: don't block the response waiting for the email
    supabase.from('profiles').select('email,name').eq('id', user.id).maybeSingle()
      .then(({ data: profile }) => {
        if (profile?.email) {
          sendHomeSavedEmail(profile.email, newHome.title, newHome.id)
            .catch(e => console.error('[api/homes] sendHomeSavedEmail:', e.message))
        }
      })

    return Response.json({ home: newHome })
  } catch (err) {
    console.error('[api/homes POST] unexpected error:', err.message)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

function normalizeText(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const search   = searchParams.get('search')   || ''
  const type     = searchParams.get('type')     || ''
  const country  = searchParams.get('country')  || ''
  const region   = searchParams.get('region')   || ''
  const city     = searchParams.get('city')     || ''
  const minBeds  = parseInt(searchParams.get('minBeds')  || '0', 10)
  const sort     = searchParams.get('sort')     || 'rating'
  const page     = Math.max(1, parseInt(searchParams.get('page')  || '1', 10))
  const limit    = Math.min(48, parseInt(searchParams.get('limit') || '24', 10))
  const offset   = (page - 1) * limit

  try {
    const supabase = await createClient()

    let query = supabase
      .from('homes')
      .select('*', { count: 'exact' })

    if (search) {
      const q = search.replace(/[^a-z0-9\s]/gi, '').trim()
      query = query.or(
        `title.ilike.%${q}%,city.ilike.%${q}%,comuna.ilike.%${q}%,region.ilike.%${q}%,location.ilike.%${q}%`
      )
    }

    if (country) query = query.eq('country_code', country)
    if (type)    query = query.eq('type', type)
    if (region)  query = query.eq('region_code', region)
    if (city) {
      const safeCity = city.replace(/[^a-z0-9\s]/gi, '').trim()
      if (safeCity) query = query.or(`city.ilike.%${safeCity}%,comuna.ilike.%${safeCity}%`)
    }
    if (minBeds > 0) query = query.gte('bedrooms', minBeds)

    const orderCol = sort === 'reviews' ? 'review_count' : sort === 'newest' ? 'created_at' : 'rating'
    // is_demo homes always appear last — false/NULL (real homes) before true (demo)
    query = query
      .order('is_demo', { ascending: true, nullsFirst: true })
      .order(orderCol, { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, count, error } = await query

    if (error) throw error

    const totalPages = Math.ceil((count || 0) / limit)

    return Response.json({
      data: (data || []).map(h => ({
        ...h,
        userId:              h.user_id,
        maxGuests:           h.max_guests || 2,
        reviewCount:         h.review_count || 0,
        availabilityPeriods: h.availability_periods || [],
      })),
      total:      count || 0,
      page,
      totalPages,
    })
  } catch (err) {
    console.error('[api/homes]', err.message)
    return Response.json({ data: [], total: 0, page: 1, totalPages: 1 }, { status: 500 })
  }
}
