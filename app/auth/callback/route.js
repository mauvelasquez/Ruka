import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // En Vercel, x-forwarded-host contiene el dominio real (rukka.cl)
  // en vez del origin interno de la función
  const forwardedHost = request.headers.get('x-forwarded-host')
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (forwardedHost ? `https://${forwardedHost}` : origin)

  if (!code) {
    console.error('[auth/callback] No code param — posible acceso directo')
    return NextResponse.redirect(`${base}/auth/login?error=no_code`)
  }

  // Acumular cookies que Supabase quiere setear
  const pendingCookies = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => pendingCookies.push(...cookies),
      },
    }
  )

  try {
    let data, error
    try {
      const result = await Promise.race([
        supabase.auth.exchangeCodeForSession(code),
        new Promise((_, reject) =>
          setTimeout(() => reject(Object.assign(new Error('session_timeout'), { name: 'TimeoutError' })), 10000)
        ),
      ])
      data  = result.data
      error = result.error
    } catch (raceErr) {
      console.error('[auth/callback] exchangeCodeForSession timeout o error de red:', raceErr?.message)
      return NextResponse.redirect(`${base}/auth/login?error=timeout`)
    }

    if (error || !data?.session) {
      console.error('[auth/callback] exchangeCodeForSession falló:', error?.message)
      return NextResponse.redirect(`${base}/auth/login?error=auth_error`)
    }

    const user = data.session.user

    // Determinar destino según estado del perfil
    let path = '/onboarding'

    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .single()

    if (!profile) {
      // Primer login con Google — crear perfil inicial
      await supabase.from('profiles').upsert({
        id:     user.id,
        name:   user.user_metadata?.name || user.user_metadata?.full_name || 'Usuario',
        email:  user.email || user.user_metadata?.email || '',
        avatar: user.user_metadata?.picture || user.user_metadata?.avatar_url || null,
        status: 'pending',
      })
    } else if (profile.status === 'confirmed') {
      path = '/dashboard'
    }

    // Crear el redirect y adjuntar EXPLÍCITAMENTE las cookies de sesión
    const response = NextResponse.redirect(`${base}${path}`)
    pendingCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options)
    })

    return response

  } catch (err) {
    console.error('[auth/callback] Error inesperado:', err?.message ?? err)
    return NextResponse.redirect(`${base}/auth/login?error=auth_error`)
  }
}
