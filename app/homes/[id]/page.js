import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import HomeDetailClient from './HomeDetailClient'

export const revalidate = 3600

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}

export async function generateMetadata({ params }) {
  try {
    const { data: home } = await getSupabase()
      .from('homes')
      .select('id, title, description, city, country, location, images, bedrooms, bathrooms, max_guests, type, amenities, created_at')
      .eq('id', params.id)
      .single()

    if (!home) return { title: 'Hogar no encontrado | Rukka' }

    const city = home.city || home.location || ''
    const title = `${home.title}${city ? ` en ${city}` : ''} — Rukka`
    const description = (home.description || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 155) || `Intercambia tu hogar por ${home.title} en ${city}. Gratis en Rukka.`
    const imageUrl = home.images?.[0] || 'https://rukka.cl/rukka-logo.png'
    const url = `https://rukka.cl/homes/${params.id}`

    return {
      title,
      description,
      alternates: {
        canonical: url,
        languages: { 'es-419': url },
      },
      openGraph: {
        title,
        description,
        url,
        siteName: 'Rukka',
        type: 'website',
        locale: 'es_419',
        images: [{ url: imageUrl, width: 1200, height: 630, alt: home.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    }
  } catch {
    return { title: 'Hogar | Rukka' }
  }
}

export default async function HomeDetailPage({ params }) {
  const { data: home } = await getSupabase()
    .from('homes')
    .select('id, title, description, city, country, location, images, bedrooms, bathrooms, max_guests, type, amenities, created_at')
    .eq('id', params.id)
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
    'name': home.title,
    'description': home.description || '',
    'url': `https://rukka.cl/homes/${home.id}`,
    'datePosted': home.created_at,
    'image': home.images?.[0] || 'https://rukka.cl/rukka-logo.png',
    'location': {
      '@type': 'Place',
      'name': city,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': city,
        'addressCountry': countryCode,
      },
    },
    'numberOfRooms': home.bedrooms || 1,
    ...(home.amenities?.length > 0 && {
      'amenityFeature': home.amenities.map(a => ({
        '@type': 'LocationFeatureSpecification',
        'name': a,
        'value': true,
      })),
    }),
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'CLP',
      'description': 'Intercambio de hogar gratuito — sin costo ni comisión',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HomeDetailClient id={params.id} />
    </>
  )
}
