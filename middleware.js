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

  // getSession() lee de cookies sin llamada de red — confiable aunque Supabase sea lento.
  // getUser() (que valida el JWT con red) se reserva para server actions y route handlers
  // donde la seguridad es crítica. En middleware, la latencia de red causaba que usuarios
  // autenticados fueran redirigidos a /login cuando Supabase tardaba en responder.
  let user = null
  try {
    const { data } = await supabase.auth.getSession()
    user = data?.session?.user ?? null
  } catch (err) {
    console.error('[middleware] getSession falló:', err?.message)
    return response // dejar pasar sin redirigir ante error de red
  }
  const { pathname } = req.nextUrl

  if (PROTECTED.some(p => pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/matches/:path*', '/onboarding/:path*', '/auth/:path*'],
}
