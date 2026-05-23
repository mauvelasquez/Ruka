import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Guard prevents crash in local dev when env vars are empty strings.
// In production (Vercel) url and key are always set.
export const supabase = (url && key)
  ? createBrowserClient(url, key, {
      auth: {
        flowType:          'pkce',
        detectSessionInUrl: true,
        persistSession:    true,
      },
      cookieOptions: {
        path:     '/',
        sameSite: 'lax',
        secure:   typeof window !== 'undefined' && window.location.protocol === 'https:',
      },
    })
  : null
