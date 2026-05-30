import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import HomeCard from '../../../../components/HomeCard'
import { cityData, countryData, COUNTRY_SLUGS, TARGET_CITIES_BY_COUNTRY } from '../../../../lib/cityData'
import { MapPin, Calendar, DollarSign, Star, ArrowRight, ArrowLeftRight } from 'lucide-react'
import CityImage from '../../../../components/CityImage'

export const revalidate = 3600

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function generateStaticParams() {
  return Object.entries(cityData).map(([citySlug, data]) => ({
    pais: data.country,
    ciudad: citySlug,
  }))
}

export async function generateMetadata({ params }) {
  const { pais, ciudad } = await params
  const city = cityData[ciudad]
  const country = countryData[pais]
  if (!city || !country) return { title: 'Rukka' }

  const title = `Intercambio de hogares en ${city.name}, ${country.name} | Rukka`
  const description = `Conoce ${city.name} intercambiando tu hogar. Rukka es gratuito, con verificación de identidad.`
  const url = `https://rukka.cl/homes/${pais}/${ciudad}`

  return {
    title,
    description,
    keywords: city.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Rukka',
      type: 'website',
      locale: 'es_419',
      images: [{ url: city.heroImage || 'https://rukka.cl/rukka-logo.png', width: 1200, height: 630, alt: `Hogares en ${city.name}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [city.heroImage || 'https://rukka.cl/rukka-logo.png'] },
  }
}

export default async function CiudadPage({ params }) {
  const { pais, ciudad } = await params
  const city = cityData[ciudad]
  const country = countryData[pais]
  if (!city || !country) notFound()

  const supabase = getSupabase()
  const cityNameFirst = city.name.split(' ')[0]

  let homes = []

  if (supabase) {
    const homesRes = await supabase
      .from('homes')
      .select('id, title, description, city, country, location, images, bedrooms, bathrooms, max_guests, type, amenities, rating, review_count, availability_periods, created_at')
      .eq('country_code', country.code)
      .ilike('city', `%${cityNameFirst}%`)
      .order('rating', { ascending: false })
      .limit(24)
    homes = homesRes.data || []
  }

  // homes no almacena precio por noche; usamos el estimado turístico de la ciudad
  const avgPrice = city.avgPricePerNight

  const normalizedHomes = (homes || []).map(h => ({
    ...h,
    maxGuests: h.max_guests || 2,
    reviewCount: h.review_count || 0,
    availabilityPeriods: h.availability_periods || [],
  }))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Intercambio de hogares en ${city.name}, ${country.name}`,
    description: `Hogares disponibles para intercambio en ${city.name} en Rukka`,
    url: `https://rukka.cl/homes/${pais}/${ciudad}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Hogares', item: 'https://rukka.cl/homes' },
        { '@type': 'ListItem', position: 2, name: country.name, item: `https://rukka.cl/homes/${pais}` },
        { '@type': 'ListItem', position: 3, name: city.name, item: `https://rukka.cl/homes/${pais}/${ciudad}` },
      ],
    },
    ...(avgPrice && {
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: country.code === 'CL' ? 'CLP' : country.code === 'MX' ? 'MXN' : country.code === 'CO' ? 'COP' : 'ARS',
        description: 'Intercambio de hogar gratuito — sin costo ni comisión',
      },
    }),
  }

  // Ciudades relacionadas del mismo país (hasta 6, excluyendo la actual)
  const relatedCities = (TARGET_CITIES_BY_COUNTRY[pais] || [])
    .filter(s => s !== ciudad)
    .slice(0, 6)
    .map(slug => ({ slug, ...cityData[slug] }))

  // Países destacados (excluyendo el actual)
  const featuredCountries = Object.entries(countryData)
    .filter(([slug]) => slug !== pais)
    .map(([slug, c]) => ({ slug, ...c }))

  // Tarjetas de datos turísticos del hero
  const statCards = city.stats ? [
    { icon: '🏨', label: 'Hotel/noche', value: city.stats.hotelAvgPerNight },
    { icon: '🍽️', label: 'Cena para 2', value: city.stats.dinnerForTwo },
    { icon: '🌡️', label: 'Temperatura', value: city.stats.avgTemp },
    { icon: '✈️', label: 'Aeropuerto', value: city.stats.airportDistance },
    { icon: '💱', label: 'Moneda local', value: city.stats.currency },
  ] : []

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
        <Navbar />

        {/* ── CAMBIO 1: Hero con imagen real + overlay + tarjetas de datos ── */}
        <section
          className="relative overflow-hidden flex flex-col justify-end text-white"
          style={{ minHeight: 480, background: '#2A5C45' }}
        >
          {/* Imagen de fondo */}
          {city.heroImage && (
            <CityImage
              src={city.heroImage}
              alt={`Vista de ${city.name}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
          )}
          {/* Overlay semitransparente */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Contenido sobre la imagen */}
          <div className="relative z-10 py-10 px-4 w-full">
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumb */}
              <nav className="text-sm text-white/60 mb-4 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
                <Link href="/homes" className="hover:text-white transition-colors">Hogares</Link>
                <span aria-hidden="true">/</span>
                <Link href={`/homes/${pais}`} className="hover:text-white transition-colors">
                  {country.flag} {country.name}
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white font-medium">{city.name}</span>
              </nav>

              {/* Título y descripción — se mantienen intactos para SEO */}
              <h1 className="text-4xl font-extrabold mb-3 drop-shadow-sm">
                Conoce {city.name} intercambiando tu hogar
              </h1>
              <p className="text-white/85 text-lg max-w-2xl mb-6 leading-relaxed">
                Intercambia tu hogar y conoce {city.name} como local. {city.description}
              </p>

              {/* Tarjetas de datos turísticos */}
              {statCards.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {statCards.map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 flex items-center gap-3"
                    >
                      <span className="text-2xl flex-shrink-0" aria-hidden="true">{stat.icon}</span>
                      <div>
                        <p className="text-white/70 text-xs leading-none mb-0.5">{stat.label}</p>
                        <p className="text-white font-semibold text-sm leading-none">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Guía turística (sin cambios) ── */}
          <section className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6 mb-8">
            <h2 className="text-lg font-extrabold text-gray-900 mb-5">
              Guía de {city.name} para viajeros
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Atractivos */}
              <div>
                <div className="flex items-center gap-2 text-forest font-bold text-sm mb-3">
                  <Star className="w-4 h-4" /> Principales atractivos
                </div>
                <ul className="space-y-2">
                  {city.highlights.map((h, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-terra mt-0.5 flex-shrink-0">→</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Info práctica */}
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-forest font-bold text-sm mb-2">
                    <Calendar className="w-4 h-4" /> Mejor época para visitar
                  </div>
                  <p className="text-sm text-gray-700">{city.bestSeason}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-forest font-bold text-sm mb-2">
                    <DollarSign className="w-4 h-4" /> Precio promedio por noche
                  </div>
                  <p className="text-sm text-gray-700">
                    ~USD {avgPrice}/noche en alojamientos de la zona
                  </p>
                  <p className="text-xs text-forest mt-1 font-semibold">
                    Con Rukka: USD 0 — intercambias tu hogar
                  </p>
                </div>
              </div>

              {/* Keywords visibles para SEO */}
              <div>
                <div className="flex items-center gap-2 text-forest font-bold text-sm mb-3">
                  <ArrowLeftRight className="w-4 h-4" /> Home exchange en {city.name}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Rukka conecta familias para{' '}
                  <strong>intercambiar casas en {city.name}</strong> sin costo.
                  El <strong>home exchange en {city.name}</strong> es la forma más
                  económica de conocer la ciudad de verdad. Publica tu hogar y accede
                  a <strong>alojamiento gratis en {city.name}</strong> y en toda Latinoamérica.
                  Crear una cuenta es <strong>gratuito</strong> y todos los usuarios pasan por
                  verificación de identidad.
                </p>
              </div>
            </div>
          </section>

          {/* ── CAMBIO 2: ¿Qué es Rukka y cómo funciona? ── */}
          <section className="rounded-2xl p-8 mb-8 border border-sand" style={{ background: '#E8D5B0' }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-rukka-dark mb-2">
                ¿Qué es Rukka y cómo funciona?
              </h2>
              <p className="text-gray-600 text-sm">
                El intercambio de hogares más sencillo de Latinoamérica
              </p>
            </div>

            {/* 3 pasos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                {
                  icon: '🏠',
                  step: 1,
                  title: 'Publica tu hogar',
                  desc: 'Agrega tu casa o departamento gratis. Solo necesitas fotos y disponibilidad.',
                },
                {
                  icon: '🔄',
                  step: 2,
                  title: 'Encuentra un match',
                  desc: 'Rukka conecta automáticamente familias con fechas compatibles. Sin negociación.',
                },
                {
                  icon: '✈️',
                  step: 3,
                  title: 'Viaja sin pagar alojamiento',
                  desc: 'Tú te quedas en su casa, ellos en la tuya. Intercambio directo.',
                },
              ].map(({ icon, step, title, desc }) => (
                <div key={step} className="bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6 text-center">
                  <span className="text-4xl mb-3 block" aria-hidden="true">{icon}</span>
                  <div className="w-7 h-7 bg-forest text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-3">
                    {step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* Bloque Yankis */}
            <div className="bg-white rounded-2xl border-2 border-terra/40 p-5 mb-7">
              <h3 className="font-extrabold text-terra text-base mb-2">
                ¿Qué son los Yankis? 🪙
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Los Yankis son los créditos de Rukka. Si alguien se queda en tu casa pero
                tú no puedes ir en ese momento, ganas Yankis. Úsalos después para alojarte
                en cualquier hogar de la red. Sin dinero, sin complicaciones.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 bg-forest text-white px-8 py-3 rounded-xl font-bold hover:bg-forest-dark transition-colors text-sm"
              >
                Publicar mi hogar gratis <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/como-funciona"
                className="text-forest font-semibold text-sm hover:text-forest-dark underline underline-offset-2 transition-colors"
              >
                Ver cómo funciona →
              </Link>
            </div>
          </section>

          {/* ── Hogares (sin cambios) ── */}
          <section>
            <h2 className="text-xl font-extrabold text-gray-900 mb-5">
              {normalizedHomes.length > 0
                ? `${normalizedHomes.length} hogares en ${city.name}`
                : `Hogares en ${city.name}`}
            </h2>

            {normalizedHomes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {normalizedHomes.map(h => <HomeCard key={h.id} home={h} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/60">
                <div className="text-5xl mb-4">🏡</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Todavía no hay hogares en {city.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  ¡Publica el tuyo y empieza a recibir viajeros de toda Latinoamérica!
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
        </div>

        {/* ── CAMBIO 3: Módulo de navegación entre destinos SEO ── */}
        <div className="border-t border-stone-200/60 mt-10 py-12 px-4 sm:px-6" style={{ background: '#F8F4EE' }}>
          <div className="max-w-7xl mx-auto">

            {/* Sección A: Otras ciudades del mismo país */}
            {relatedCities.length > 0 && (
              <section className="mb-12">
                <h2 className="text-lg font-extrabold text-forest mb-5">
                  Otras ciudades en {country.flag} {country.name}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {relatedCities.map(c => (
                    <Link
                      key={c.slug}
                      href={`/homes/${pais}/${c.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2" style={{ background: 'linear-gradient(135deg, #2A5C45 0%, #3d7a5e 100%)' }}>
                        <CityImage
                          src={c.thumbnail}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        <p className="absolute bottom-2 left-2.5 text-white font-bold text-xs leading-tight drop-shadow-sm">
                          {c.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Link
                    href={`/homes/${pais}`}
                    className="inline-flex items-center gap-1.5 text-forest font-semibold text-sm hover:text-forest-dark transition-colors"
                  >
                    Ver todos los destinos en {country.name} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </section>
            )}

            {/* Sección B: Intercambios en otros países */}
            {featuredCountries.length > 0 && (
              <section>
                <h2 className="text-lg font-extrabold text-forest mb-5">
                  Intercambios en otros países
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {featuredCountries.map(c => (
                    <Link
                      key={c.slug}
                      href={`/homes/${c.slug}`}
                      className="group bg-white rounded-xl border border-stone-200/60 p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                    >
                      <span className="text-3xl flex-shrink-0" aria-hidden="true">{c.flag}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 text-sm group-hover:text-forest transition-colors">
                          {c.name}
                        </p>
                        <p className="text-xs text-forest font-medium mt-0.5">
                          {c.approxHomes}+ hogares disponibles
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-terra flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
