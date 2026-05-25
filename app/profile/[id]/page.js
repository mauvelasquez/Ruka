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
      .select('id, name, bio, location, avatar')
      .eq('id', params.id)
      .single()

    if (!profile) return { title: 'Perfil | Rukka' }

    const name = profile.name || 'Anfitrión'
    const title = `${name} — Anfitrión en Rukka`
    const description = profile.bio
      ? profile.bio.slice(0, 155)
      : `Conoce el perfil de ${name} en Rukka, la plataforma de intercambio de hogares en Latinoamérica.`
    const url = `https://rukka.cl/profile/${params.id}`

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
        type: 'profile',
        locale: 'es_419',
        images: profile.avatar
          ? [{ url: profile.avatar, width: 400, height: 400, alt: name }]
          : [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    }
  } catch {
    return { title: 'Perfil | Rukka' }
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
