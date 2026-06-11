import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import HomeCard from '../../../components/HomeCard'
import HomeDetailClient from './HomeDetailClient'
import { countryData, COUNTRY_SLUGS, TARGET_CITIES_BY_COUNTRY, cityData } from '../../../lib/cityData'
import { MapPin, Globe, Calendar, Coins, ArrowRight } from 'lucide-react'

export const revalidate = 3600

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function generateStaticParams() {
  return Object.keys(COUNTRY_SLUGS).map(pais => ({ pais }))
}

export async function generateMetadata({ params }) {
  const { pais } = await params

  // ── Página de país ──────────────────────────────────────────────────
  if (COUNTRY_SLUGS[pais]) {
    const country = countryData[pais]
    const title = `Intercambio de hogares en ${country.name} | Rukka`
    const description = `Conoce ${country.name} intercambiando tu hogar. Rukka es gratuito, con verificación de identidad.`
    const url = `https://rukka.cl/homes/${pais}`
    const isNonChile = pais !== 'chile'
    return {
      title, description,
      keywords: country.keywords,
      alternates: { canonical: url },
      ...(isNonChile && { robots: { index: false, follow: true } }),
      openGraph: { title, description, url, siteName: 'Rukka', type: 'website', locale: 'es_CL', images: [{ url: 'https://rukka.cl/rukka-logo.png', width: 1200, height: 630, alt: `Rukka ${country.name}` }] },
      twitter: { card: 'summary_large_image', title, description, images: ['https://rukka.cl/rukka-logo.png'] },
    }
  }

  // ── Detalle de hogar ────────────────────────────────────────────────
  try {
    const supabaseMeta = getSupabase()
    if (!supabaseMeta) return { title: 'Hogar | Rukka' }
    const { data: home } = await supabaseMeta
      .from('homes')
      .select('id, title, description, city, country, location, images, bedrooms, bathrooms, max_guests, type, amenities, created_at')
      .eq('id', pais)
      .single()

    if (!home) return { robots: { index: false } }

    const city = home.city || home.location || ''
    const title = `${home.title}${city ? ` en ${city}` : ''} — Rukka`
    const description = (home.description || '').replace(/\s+/g, ' ').trim().slice(0, 155) || `Intercambia tu hogar por ${home.title} en ${city}. Gratis en Rukka.`
    const imageUrl = home.images?.[0] || 'https://rukka.cl/rukka-logo.png'
    const url = `https://rukka.cl/homes/${pais}`

    return {
      title, description,
      robots: { index: true, follow: true },
      alternates: { canonical: url, languages: { 'es-419': url } },
      openGraph: { title, description, url, siteName: 'Rukka', type: 'website', locale: 'es_CL', images: [{ url: imageUrl, width: 1200, height: 630, alt: home.title }] },
      twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
    }
  } catch {
    return { robots: { index: false } }
  }
}

export default async function PaisOHomeDetailPage({ params }) {
  const { pais } = await params

  // ── Página de país ──────────────────────────────────────────────────
  if (COUNTRY_SLUGS[pais]) {
    const country = countryData[pais]

    const supabase = getSupabase()

    let homes = []
    let citiesWithHomes = []

    if (supabase) {
      const [homesRes, cityRes] = await Promise.all([
        supabase.from('homes').select('id, title, description, city, country, location, images, bedrooms, bathrooms, max_guests, type, amenities, rating, review_count, availability_periods, created_at').eq('country_code', country.code).or('is_demo.is.null,is_demo.is.false').order('rating', { ascending: false }).limit(24),
        supabase.from('homes').select('city').eq('country_code', country.code).or('is_demo.is.null,is_demo.is.false').not('city', 'is', null),
      ])
      homes = homesRes.data || []
      citiesWithHomes = [...new Set((cityRes.data || []).map(r => r.city).filter(Boolean))]
    }
    const targetCitySlugs = TARGET_CITIES_BY_COUNTRY[pais] || []

    const normalizedHomes = (homes || []).map(h => ({
      ...h,
      maxGuests: h.max_guests || 2,
      reviewCount: h.review_count || 0,
      availabilityPeriods: h.availability_periods || [],
    }))

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Intercambio de hogares en ${country.name}`,
      description: `Hogares disponibles para intercambio en ${country.name} en Rukka`,
      url: `https://rukka.cl/homes/${pais}`,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Hogares', item: 'https://rukka.cl/homes' },
          { '@type': 'ListItem', position: 2, name: country.name, item: `https://rukka.cl/homes/${pais}` },
        ],
      },
    }

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
          <Navbar />

          <div className="bg-forest text-white py-12 px-4">
            <div className="max-w-7xl mx-auto">
              <nav className="text-sm text-white/60 mb-4 flex items-center gap-2">
                <Link href="/homes" className="hover:text-white transition-colors">Hogares</Link>
                <span>/</span>
                <span className="text-white font-medium">{country.flag} {country.name}</span>
              </nav>
              <h1 className="text-4xl font-extrabold mb-3">
                Conoce {country.flag} {country.name} intercambiando tu hogar
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">Intercambia tu hogar y conoce {country.name} como local. {country.description}</p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Ficha informativa del país */}
            <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-2 text-forest font-bold text-sm mb-2">
                  <MapPin className="w-4 h-4" /> Principales destinos
                </div>
                <ul className="space-y-1">
                  {country.topCities.map(city => (
                    <li key={city} className="text-sm text-gray-700">{city}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 text-forest font-bold text-sm mb-2">
                  <Calendar className="w-4 h-4" /> Mejor época para visitar
                </div>
                <p className="text-sm text-gray-700">{country.bestSeason}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-forest font-bold text-sm mb-2">
                  <Globe className="w-4 h-4" /> Idioma
                </div>
                <p className="text-sm text-gray-700">{country.language}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-forest font-bold text-sm mb-2">
                  <Coins className="w-4 h-4" /> Moneda
                </div>
                <p className="text-sm text-gray-700">{country.currency}</p>
              </div>
            </div>

            {/* Ciudades destino */}
            {targetCitySlugs.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xl font-extrabold text-gray-900 mb-4">
                  Ciudades para intercambio en {country.name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {targetCitySlugs.map(slug => {
                    const c = cityData[slug]
                    const hasHomes = citiesWithHomes.some(name =>
                      name?.toLowerCase().includes(c.name.toLowerCase().split(' ')[0])
                    )
                    return (
                      <Link
                        key={slug}
                        href={`/homes/${pais}/${slug}`}
                        className="bg-white rounded-xl border border-stone-200/60 shadow-sm p-4 hover:border-forest hover:shadow-md transition-all group"
                      >
                        <p className="font-bold text-gray-900 group-hover:text-forest transition-colors text-sm">
                          {c.name}
                        </p>
                        {hasHomes && (
                          <p className="text-xs text-forest mt-1">● Hogares disponibles</p>
                        )}
                        <div className="flex items-center gap-1 text-terra mt-2 text-xs font-semibold">
                          Ver hogares <ArrowRight className="w-3 h-3" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Hogares */}
            <section>
              <h2 className="text-xl font-extrabold text-gray-900 mb-5">
                {normalizedHomes.length > 0
                  ? `${normalizedHomes.length} hogares en ${country.name}`
                  : `Hogares en ${country.name}`}
              </h2>
              {normalizedHomes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {normalizedHomes.map(h => <HomeCard key={h.id} home={h} />)}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/60">
                  <div className="text-5xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Aún no hay hogares publicados en {country.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                    ¡Sé el primero en publicar el tuyo y empieza a recibir viajeros de Chile!
                  </p>
                  <Link
                    href="/dashboard/property/new"
                    className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-xl font-semibold hover:bg-forest-dark transition-colors text-sm"
                  >
                    Publicar mi hogar <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </section>

            {/* Texto SEO */}
            <section className="mt-12 bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Intercambio de hogares en {country.name} con Rukka
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rukka es la plataforma de <strong>home exchange en {country.name}</strong> que conecta familias para{' '}
                <strong>intercambiar casas</strong> sin costo ni comisión. Ya sea que tengas un departamento en{' '}
                {country.topCities[0]} o una cabaña en {country.topCities[country.topCities.length - 1]},
                puedes ofrecer tu hogar a cambio de alojamiento gratis en {country.name}.
                El <strong>intercambio de hogares en {country.name}</strong> es la forma
                más auténtica y económica de viajar: vives como un local, en casas reales, con familias de verdad.
                Crear una cuenta es <strong>gratuito</strong> y todos los usuarios pasan por verificación de identidad.
              </p>
            </section>
          </div>

          <Footer />
        </div>
      </>
    )
  }

  // ── Detalle de hogar (fallback) ─────────────────────────────────────
  const supabaseHome = getSupabase()
  if (!supabaseHome) notFound()

  const { data: home } = await supabaseHome
    .from('homes')
    .select('id, title, description, city, country, location, images, bedrooms, bathrooms, max_guests, type, amenities, created_at')
    .eq('id', pais)
    .single()

  if (!home) notFound()

  const city = home.city || home.location || ''
  const countryCode = home.country === 'Chile' ? 'CL'
    : home.country === 'México' ? 'MX'
    : home.country === 'Colombia' ? 'CO'
    : home.country === 'Argentina' ? 'AR'
    : 'CL'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: home.title,
    description: home.description || '',
    url: `https://rukka.cl/homes/${home.id}`,
    datePosted: home.created_at,
    image: home.images?.[0] || 'https://rukka.cl/rukka-logo.png',
    location: {
      '@type': 'Place',
      name: city,
      address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: countryCode },
    },
    numberOfRooms: home.bedrooms || 1,
    ...(home.amenities?.length > 0 && {
      amenityFeature: home.amenities.map(a => ({ '@type': 'LocationFeatureSpecification', name: a, value: true })),
    }),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'CLP', description: 'Intercambio de hogar gratuito — sin costo ni comisión' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <HomeDetailClient id={pais} />
    </>
  )
}
