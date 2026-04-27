import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

const PROTECTED = ['/dashboard', '/matches', '/onboarding']
const AUTH_ONLY  = ['/auth/login', '/auth/register']

export async function middleware(req) {
  const res      = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  // Rutas protegidas → redirigir al login si no hay sesión
  if (PROTECTED.some(p => pathname.startsWith(p)) && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Si hay sesión y va al login/register → redirigir al dashboard
  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Si hay sesión, verificar si necesita completar onboarding
  if (session && pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', session.user.id)
      .single()

    if (profile?.status === 'pending') {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/matches/:path*', '/onboarding/:path*', '/auth/:path*'],
}
