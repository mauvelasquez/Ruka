import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const AUTH_REQUIRED = ['/dashboard', '/matches', '/onboarding']
const AUTH_ONLY = ['/auth/login', '/auth/register']

export async function middleware(req) {
  let response = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser ?? null
  } catch (err) {
    console.error('[middleware] getUser falló:', err?.message)
    return response
  }

  const { pathname } = req.nextUrl

  // Rutas que requieren sesión activa
  if (AUTH_REQUIRED.some(p => pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // /onboarding es obsoleto — usuarios autenticados van directo al dashboard
  if (pathname.startsWith('/onboarding') && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // /matches requiere verification_status = 'verified'
  if (pathname.startsWith('/matches') && user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('verification_status')
        .eq('id', user.id)
        .maybeSingle()
      if (profile?.verification_status !== 'verified') {
        return NextResponse.redirect(new URL('/verificar?action=match', req.url))
      }
    } catch (err) {
      // Error de red: dejar pasar en vez de bloquear al usuario
      console.error('[middleware] profile verification check failed:', err?.message)
    }
  }

  // Rutas solo para no autenticados
  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/matches/:path*', '/onboarding/:path*', '/auth/login', '/auth/register'],
}
