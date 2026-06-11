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

// Borra a mano las cookies sb-<ref>-auth-token (+ chunks/code-verifier).
// Fallback para cuando supabase.auth.signOut() no responde: el GoTrueClient
// puede quedar con su lock interno (_acquireLock/pendingInLock) bloqueado
// para siempre si _initialize() se cuelga refrescando el token (el fetch de
// refresh no tiene timeout), dejando signOut() en deadlock detrás de esa cola.
export function clearAuthStorageCookies() {
  if (typeof document === 'undefined') return
  const projectRef = url?.match(/^https:\/\/([^.]+)\.supabase\.co/)?.[1]
  if (!projectRef) return
  const base = `sb-${projectRef}-auth-token`
  const names = [base, `${base}-code-verifier`, ...Array.from({ length: 5 }, (_, i) => `${base}.${i}`)]
  names.forEach(name => { document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax` })
}
