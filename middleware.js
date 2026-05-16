import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const PROTECTED = ['/dashboard', '/matches', '/onboarding']
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

  // getUser() valida el JWT contra Supabase (revalida el token expirado).
  // Si falla por red, el catch devuelve response sin redirigir — mismo comportamiento
  // seguro que antes pero sin el riesgo de sesiones falsas por getSession() local.
  let user = null
  try {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser ?? null
  } catch (err) {
    console.error('[middleware] getUser falló:', err?.message)
    return response // dejar pasar sin redirigir ante error de red
  }
  const { pathname } = req.nextUrl

  if (PROTECTED.some(p => pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return response
}

export const config = {
  // /auth/callback se excluye deliberadamente: es el handler OAuth y no necesita
  // protección de middleware. Incluirlo podría interferir con el flujo de sesión.
  matcher: ['/dashboard/:path*', '/matches/:path*', '/onboarding/:path*', '/auth/login', '/auth/register'],
}
