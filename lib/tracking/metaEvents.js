'use client'
import { hashData } from './hash'

const PIXEL_ID = '1265542175650565'

// Llama fbq('init') de nuevo con los datos del usuario para activar Advanced Matching.
// Meta permite múltiples llamadas a init; no re-dispara PageView.
async function attachUserData(user) {
  if (typeof window === 'undefined' || !window.fbq || !user) return
  const phoneDigits = user.phone ? user.phone.replace(/\D/g, '') : null
  const birthFormatted = user.birth_date
    ? String(user.birth_date).replace(/-/g, '')  // YYYY-MM-DD → YYYYMMDD
    : null

  const [em, ph, db, fn, ln] = await Promise.all([
    hashData(user.email),
    hashData(phoneDigits),
    hashData(birthFormatted),
    hashData((user.name || '').split(' ')[0]),
    hashData((user.name || '').split(' ').slice(1).join(' ') || null),
  ])

  const ud = {}
  if (em) ud.em = em
  if (ph) ud.ph = ph
  if (db) ud.db = db
  if (fn) ud.fn = fn
  if (ln) ud.ln = ln
  if (user.country_user) ud.country = user.country_user.toLowerCase()

  window.fbq('init', PIXEL_ID, ud)
}

// 1. Registro completado (verificación de correo confirmada o signup inmediato)
export async function trackCompleteRegistration(user) {
  if (typeof window === 'undefined' || !window.fbq) return
  await attachUserData(user)
  window.fbq('track', 'CompleteRegistration')
}

// 2. Casa publicada
export async function trackListingPublished(user) {
  if (typeof window === 'undefined' || !window.fbq) return
  await attachUserData(user)
  window.fbq('trackCustom', 'CasaPublicada')
}

// 3. Verificación de identidad completada
export async function trackIdentityVerified(user) {
  if (typeof window === 'undefined' || !window.fbq) return
  await attachUserData(user)
  window.fbq('trackCustom', 'VerificacionCompletada')
}
