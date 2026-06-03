// GA4 + Google Ads conversion events.
// PageView ya está cubierto por RouteChangeTracker en components/GoogleAnalytics.js — no duplicar.
// Google Ads ID configurado en layout: AW-18204995346
// Para activar la conversión de registro en Google Ads, configura un conversion action
// en la cuenta y reemplaza el placeholder de send_to por 'AW-18204995346/LABEL'.

function gtag(...args) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag(...args)
}

// 1. Registro completado
export function trackGA4Registration({ method = 'email' } = {}) {
  gtag('event', 'sign_up', { method })
  // Descomentar y completar el label cuando esté configurado en Google Ads:
  // gtag('event', 'conversion', { send_to: 'AW-18204995346/CONVERSION_LABEL' })
}

// 2. Casa publicada
export function trackGA4ListingPublished() {
  gtag('event', 'generate_lead')
}

// 3. Verificación completada
export function trackGA4IdentityVerified() {
  gtag('event', 'tutorial_complete')
}
