// ─── BANNERS RUKKA ────────────────────────────────────────────────────────────
// Única fuente de verdad: DESTINOS_RUKKA en /lib/comunas.js
// Este archivo solo reexporta para compatibilidad con imports existentes.

import { DESTINOS_RUKKA } from './comunas'

export const CHILE_BANNERS = DESTINOS_RUKKA

export function getRandomBanner() {
  return DESTINOS_RUKKA[Math.floor(Math.random() * DESTINOS_RUKKA.length)]
}

export function getRandomBanners(n = 5) {
  const shuffled = [...DESTINOS_RUKKA].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, DESTINOS_RUKKA.length))
}

export function getBannerByCity(city) {
  return DESTINOS_RUKKA.find(b => b.city.toLowerCase() === city.toLowerCase())
}
