import { createClient } from '@supabase/supabase-js'
import ProfileClient from './ProfileClient'
import Navbar from '../../../components/Navbar'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}

export async function generateMetadata({ params }) {
  try {
    const { data: profile } = await getSupabase()
      .from('profiles')
      .select('id, full_name, city, country, country_code, avatar_url, id_verified')
      .eq('id', params.id)
      .single()

    if (!profile) return { robots: { index: false } }

    // Chile-focus: perfiles demo de AR/CO/MX no se indexan individualmente
    const isNonChile = profile.country_code && profile.country_code !== 'CL'

    const name = profile.full_name ?? 'Anfitrión'
    const location = profile.city ?? 'Chile'
    const title = `${name} — Anfitrión en ${location} | Rukka`
    const description = `Conoce el perfil de ${name} en Rukka y contacta para intercambiar hogares.`
    const url = `https://rukka.cl/profile/${params.id}`

    return {
      title,
      description,
      robots: isNonChile ? { index: false, follow: false } : { index: true, follow: true },
      alternates: {
        canonical: url,
        languages: { 'es-419': url },
      },
      openGraph: {
        title: `${name} | Rukka`,
        description,
        url,
        siteName: 'Rukka',
        type: 'profile',
        locale: 'es_CL',
        images: profile.avatar_url
          ? [{ url: profile.avatar_url, width: 400, height: 400, alt: name }]
          : [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    }
  } catch {
    return { robots: { index: false } }
  }
}

export default function ProfilePage({ params }) {
  return (
    <>
      <Navbar />
      <ProfileClient id={params.id} />
    </>
  )
}
