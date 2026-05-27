import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  // Only allow internal paths to prevent open redirect attacks
  const redirectAfterLogin = next?.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'

  // Prefer explicit SITE_URL, then x-forwarded-host, then request origin
  const forwardedHost = request.headers.get('x-forwarded-host')
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (forwardedHost ? `https://${forwardedHost}` : origin)

  if (!code) {
    console.error('[auth/callback] Missing code param — direct access or OAuth error')
    return NextResponse.redirect(`${base}/auth/login?error=no_code`)
  }

  // Collect cookies that Supabase wants to set so we can apply them to the redirect response
  const pendingCookies = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          // Update request.cookies so Supabase can read back what it just wrote
          // (needed if a token refresh occurs during the profile fetch)
          list.forEach(({ name, value }) => request.cookies.set(name, value))
          pendingCookies.push(...list)
        },
      },
    }
  )

  // ── 1. Exchange the one-time OAuth code for a session ──────────────────────
  let user
  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[auth/callback] exchangeCodeForSession failed:', error.message, `[${error.status ?? error.code}]`)
      return redirect(`${base}/auth/login?error=auth_error`, pendingCookies)
    }
    if (!data?.session) {
      console.error('[auth/callback] exchangeCodeForSession returned no session')
      return redirect(`${base}/auth/login?error=auth_error`, pendingCookies)
    }

    user = data.session.user
  } catch (err) {
    console.error('[auth/callback] exchangeCodeForSession threw:', err?.message)
    return redirect(`${base}/auth/login?error=auth_error`, pendingCookies)
  }

  // ── 2. Determine where to send the user based on profile state ──────────────
  // Skip profile check when the caller provided an explicit ?next= destination
  let destination = redirectAfterLogin

  if (!next) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', user.id)
        .maybeSingle()

      const isGoogleLogin = user.app_metadata?.provider === 'google'

      if (profileError) {
        // DB error → go to dashboard optimistically
        console.error('[auth/callback] profile fetch error:', profileError.message)
      } else if (!profile) {
        // First login → create basic profile
        const { error: upsertErr } = await supabase.from('profiles').upsert({
          id:     user.id,
          name:   user.user_metadata?.full_name || user.user_metadata?.name || 'Usuario',
          email:  user.email || user.user_metadata?.email || '',
          avatar: user.user_metadata?.picture || user.user_metadata?.avatar_url || null,
          status: 'pending',
        })
        if (upsertErr) {
          console.error('[auth/callback] profile upsert failed:', upsertErr.message)
        }
      } else if (user.email && !profile.email) {
        // Existing profile missing email (OAuth users created before email sync) — backfill
        const { error: emailErr } = await supabase
          .from('profiles')
          .update({ email: user.email })
          .eq('id', user.id)
        if (emailErr) {
          console.error('[auth/callback] email backfill failed:', emailErr.message)
        }
      }
      // Always land on dashboard — onboarding is no longer mandatory
    } catch (err) {
      // Unexpected error → proceed optimistically; store handles edge cases
      console.error('[auth/callback] profile check threw:', err?.message)
    }
  }

  // ── 3. Build redirect response with session cookies ─────────────────────────
  return redirect(`${base}${destination}`, pendingCookies)
}

// Helper: build a 302 with session cookies and cache prevention headers
function redirect(url, pendingCookies) {
  const response = NextResponse.redirect(url, { status: 302 })
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  pendingCookies.forEach(({ name, value, options }) => {
    // Ensure cookies are accessible across all paths and persist for the session duration.
    // Supabase's default options may omit path, which causes some browsers to scope
    // the cookie to /auth/* only — making it invisible to the client on /dashboard.
    const mergedOptions = {
      path:     '/',
      sameSite: 'lax',
      secure:   process.env.NODE_ENV === 'production',
      ...options,
    }
    response.cookies.set(name, value, mergedOptions)
  })
  return response
}
