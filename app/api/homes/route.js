import { createClient } from '../../../lib/supabase/server'

export const runtime = 'nodejs'

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
    query = query.order(orderCol, { ascending: false }).range(offset, offset + limit - 1)

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
