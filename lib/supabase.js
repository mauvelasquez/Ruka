import { createBrowserClient } from '@supabase/ssr'
import { processLock } from '@supabase/auth-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Guard prevents crash in local dev when env vars are empty strings.
// In production (Vercel) url and key are always set.
export const supabase = (url && key)
  ? createBrowserClient(url, key, {
      auth: {
        // processLock reemplaza navigatorLock (Web Locks API).
        // Usa una Promise queue interna — sin navigator.locks, sin locks huérfanos entre tabs.
        // Ventaja: getSession() no queda bloqueado por operaciones de otras pestañas/cargas previas.
        lock: processLock,
      },
    })
  : null
