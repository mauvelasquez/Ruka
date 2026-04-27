import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const PROTECTED  = ['/dashboard', '/matches', '/onboarding']
const AUTH_ONLY  = ['/auth/login', '/auth/register']

export async function middleware(req) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get:    (name)         => req.cookies.get(name)?.value,
        set:    (name, value, options) => res.cookies.set({ name, value, ...options }),
        remove: (name, options)        => res.cookies.set({ name, value: '', ...options }),
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  if (PROTECTED.some(p => pathname.startsWith(p)) && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (AUTH_ONLY.some(p => pathname.startsWith(p)) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (session && pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.status === 'pending') {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/matches/:path*', '/onboarding/:path*', '/auth/:path*'],
}