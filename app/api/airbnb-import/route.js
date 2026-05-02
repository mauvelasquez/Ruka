// Airbnb scraping via Apify (sourabhbgp~airbnb-scraper)
// Actor específico para URLs de listings individuales de Airbnb.
// Revisar TOS de Apify y Airbnb periódicamente.

import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import logger from '../../../lib/logger'
import { withLogger } from '../../../lib/withLogger'

// Apify puede tardar hasta 60 s — extender el timeout de Vercel
export const maxDuration = 60

// Helper: JSON response with cache-prevention headers
function jsonRes(data, init = {}) {
  return NextResponse.json(data, {
    ...init,
    headers: { 'Cache-Control': 'no-store', ...(init.headers || {}) },
  })
}

// Mapeo de campos de amenities del actor al formato Rukka (null-safe)
function mapAmenities(listing) {
  if (!listing) return []
  const map = {
    wifi:    listing?.amenityWifi,
    kitchen: listing?.amenityKitchen,
    ac:      listing?.amenityAC,
    heating: listing?.amenityHeating,
    parking: listing?.amenityParking,
    washer:  listing?.amenityWasher,
    tv:      listing?.amenityTv,
    pets:    listing?.amenityPetsAllowed,
  }
  return Object.entries(map)
    .filter(([, v]) => v === true)
    .map(([k]) => k)
}

async function postHandler(request) {
  try {
    // ── Autenticación ──────────────────────────────────────────────────────
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return jsonRes({ error: 'No autorizado', errorType: 'UNAUTHORIZED' }, { status: 401 })
    }

    // ── Rate limiting: máx 10 imports por usuario por día ──────────────────
    const today = new Date().toISOString().split('T')[0]
    try {
      const { count } = await supabase
        .from('airbnb_imports_log')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today)
      if (count !== null && count >= 10) {
        return jsonRes(
          { error: 'Límite diario de importaciones alcanzado (10/día)', errorType: 'RATE_LIMIT' },
          { status: 429 }
        )
      }
    } catch { /* tabla no existe aún */ }

    // ── Validar URL de Airbnb ──────────────────────────────────────────────
    const body = await request.json()
    const { url } = body
    const airbnbRegex = /airbnb\.(com|cl|com\.ar|com\.mx)\/rooms\/(\d+)/
    const match = url?.match(airbnbRegex)

    if (!match) {
      logger.warn('airbnb-import', 'invalid_url', { userId: user.id, metadata: { url } })
      return jsonRes(
        { error: 'Ingresa un link válido de Airbnb (ej: airbnb.cl/rooms/12345)', errorType: 'INVALID_URL' },
        { status: 400 }
      )
    }

    const roomId = match[2]
    const normalizedUrl = `https://www.airbnb.com/rooms/${roomId}`

    // ── Llamar a Apify — sourabhbgp/airbnb-scraper ────────────────────────
    // Este actor acepta URLs individuales de rooms (a diferencia de tri_angle)
    const token = process.env.APIFY_API_TOKEN
    const apifyResponse = await fetch(
      `https://api.apify.com/v2/acts/sourabhbgp~airbnb-scraper/run-sync-get-dataset-items?token=${token}&timeout=55&memory=1024`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: [{ url: normalizedUrl }],
          maxListings: 1,
        }),
        signal: AbortSignal.timeout(62000),
      }
    )

    if (!apifyResponse.ok) {
      const errText = await apifyResponse.text().catch(() => '')
      if (apifyResponse.status === 403 || apifyResponse.status === 429) {
        logger.error('airbnb-import', 'proxy_block', {
          userId: user.id,
          metadata: { roomId, apifyStatus: apifyResponse.status, errText: errText.slice(0, 200) },
        })
        return jsonRes(
          { error: 'Airbnb bloqueó la conexión. Por favor ingresa los datos manualmente.', errorType: 'PROXY_BLOCK' },
          { status: 403 }
        )
      }
      if (apifyResponse.status === 408 || apifyResponse.status === 524) {
        logger.error('airbnb-import', 'apify_timeout', {
          userId: user.id,
          metadata: { roomId, apifyStatus: apifyResponse.status },
        })
        return jsonRes(
          { error: 'La importación tardó demasiado. Por favor ingresa los datos manualmente.', errorType: 'TIMEOUT' },
          { status: 408 }
        )
      }
      throw new Error(`Apify HTTP ${apifyResponse.status}`)
    }

    const data = await apifyResponse.json()

    // Apify puede retornar error en JSON con status 200
    if (!Array.isArray(data) || data.length === 0) {
      const apifyErr = data?.error?.message || 'No se encontró la propiedad'
      logger.error('airbnb-import', 'no_data', {
        userId: user.id,
        metadata: { roomId, apifyErr, rawSnippet: JSON.stringify(data).slice(0, 200) },
      })
      return jsonRes(
        { error: `No pudimos leer el listing. ${apifyErr}`, errorType: 'NOT_FOUND' },
        { status: 404 }
      )
    }

    const listing = data[0]

    // Apify indica bloqueo de Airbnb con estas señales
    if (
      listing.error ||
      listing.blocked === true ||
      listing.statusCode === 403 ||
      (typeof listing.errorMessage === 'string' && listing.errorMessage.length > 0)
    ) {
      logger.error('airbnb-import', 'airbnb_blocked', {
        userId: user.id,
        metadata: { roomId, errorMessage: listing.errorMessage, statusCode: listing.statusCode },
      })
      return jsonRes(
        { error: 'Airbnb bloqueó la conexión. Por favor ingresa los datos manualmente.', errorType: 'PROXY_BLOCK' },
        { status: 403 }
      )
    }

    // ── Mapear al formato Rukka ────────────────────────────────────────────
    const fotos = (listing.photos || [])
      .filter(p => typeof p === 'string' && p.startsWith('http'))
      .slice(0, 20)

    // Thumbnail como foto extra si no hay fotos
    if (fotos.length === 0 && listing.thumbnail) {
      fotos.push(listing.thumbnail)
    }

    // Mapear tipo de habitación al formato Rukka
    const tipoRaw = (listing.roomType || listing.propertyType || '').toLowerCase()
    let tipo = 'Casa completa'
    if (tipoRaw.includes('private') || tipoRaw.includes('room')) tipo = 'Habitación privada'
    else if (tipoRaw.includes('shared')) tipo = 'Habitación compartida'
    else if (tipoRaw.includes('entire')) tipo = 'Casa completa'

    const amenities = mapAmenities(listing)

    const propiedad = {
      titulo:       listing.name || '',
      descripcion:  listing.description || listing.descriptionOriginalLanguage || '',
      capacidad:    listing.personCapacity || listing.maxGuests || null,
      habitaciones: listing.bedrooms || null,
      banos:        listing.bathrooms ? Math.floor(listing.bathrooms) : null,
      camas:        listing.beds || null,
      fotos,
      amenities,
      tipo,
      airbnb_url:   normalizedUrl,
      airbnb_id:    roomId,
      ubicacion:    listing.city || listing.neighborhood || '',
      latitud:      listing.latitude || null,
      longitud:     listing.longitude || null,
      rating:       listing.rating || null,
      reviews:      listing.reviewsCount || 0,
      camposImportados: [
        listing.name                 && 'titulo',
        listing.description          && 'descripcion',
        fotos.length > 0             && 'fotos',
        listing.latitude             && 'ubicacion',
        listing.personCapacity       && 'capacidad',
        listing.bedrooms             && 'habitaciones',
        amenities.length > 0         && 'amenities',
      ].filter(Boolean),
    }

    // ── Log del import ─────────────────────────────────────────────────────
    logger.info('airbnb-import', 'import_success', {
      userId: user.id,
      metadata: { roomId, fotosCount: fotos.length, amenitiesCount: amenities.length },
    })

    try {
      await supabase.from('airbnb_imports_log').insert({
        user_id:    user.id,
        airbnb_id:  roomId,
        airbnb_url: normalizedUrl,
      })
    } catch { /* tabla no creada aún */ }

    return jsonRes({ success: true, propiedad })

  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      logger.error('airbnb-import', 'fetch_timeout', { metadata: { errorName: error.name } })
      return jsonRes(
        { error: 'La importación tardó demasiado (>60s). Intenta de nuevo en unos minutos.', errorType: 'TIMEOUT' },
        { status: 408 }
      )
    }

    logger.error('airbnb-import', 'unexpected_error', { error })
    return jsonRes(
      { error: 'Error al importar. Puedes ingresar los datos manualmente.', errorType: 'UNKNOWN' },
      { status: 500 }
    )
  }
}

export const POST = withLogger('airbnb-import', postHandler)
