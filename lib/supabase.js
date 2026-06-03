import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Guard prevents crash in local dev when env vars are empty strings.
// In production (Vercel) url and key are always set.
// Uses the default navigatorLock (navigator.locks) — browser-native, avoids the
// processLock Promise-queue deadlock where a hung token refresh blocks all updates.
export const supabase = (url && key)
  ? createBrowserClient(url, key)
  : null
