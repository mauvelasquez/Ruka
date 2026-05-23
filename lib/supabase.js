import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Guard prevents crash in local dev when env vars are empty strings.
// In production (Vercel) url and key are always set.
export const supabase = (url && key)
  ? createBrowserClient(url, key, {
      auth: {
        // Si el Navigator Lock está atascado (lock huérfano de otra pestaña o
        // React Strict Mode), esperar máximo 5s y luego robar el lock.
        // Sin este valor (default=-1), getSession() y todas las queries REST
        // esperan indefinidamente → dashboard se congela siempre.
        lockAcquireTimeout: 5000,
      },
    })
  : null
