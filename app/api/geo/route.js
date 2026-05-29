import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server'

const SUPPORTED = ['CL', 'CO', 'AR', 'MX']
const COOKIE_NAME = 'rukka_country'

export async function GET() {
  const cookieStore = await cookies()
  const fromCookie = cookieStore.get(COOKIE_NAME)?.value
  if (fromCookie && SUPPORTED.includes(fromCookie)) {
    return Response.json({ country: fromCookie, source: 'cookie' })
  }

  const h = await headers()
  const fromHeader = h.get('x-vercel-ip-country')
  if (fromHeader && SUPPORTED.includes(fromHeader)) {
    return Response.json({ country: fromHeader, source: 'header' })
  }

  return Response.json({ country: 'CL', source: 'fallback' })
}

export async function POST(req) {
  const { country } = await req.json()
  if (!SUPPORTED.includes(country)) {
    return NextResponse.json({ error: 'País no soportado' }, { status: 400 })
  }

  const res = NextResponse.json({ country, source: 'user' })
  res.cookies.set(COOKIE_NAME, country, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
    httpOnly: false,
  })
  return res
}
