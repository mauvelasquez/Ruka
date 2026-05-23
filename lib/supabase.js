import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Guard prevents crash in local dev when env vars are empty strings.
// In production (Vercel) url and key are always set.
export const supabase = (url && key)
  ? createBrowserClient(url, key, {
      auth: {
        // El default de lockAcquireTimeout es 5s, igual que nuestro authFallback.
        // Al bajar a 2s, el lock se roba antes de que el authFallback marque user=null.
        lockAcquireTimeout: 2000,
      },
    })
  : null
