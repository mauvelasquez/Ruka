// ─── LOCALIDADES RUKKA — Todas las regiones y comunas de Chile ────────────────
// Re-exports from comunas.js (single source of truth)

export { REGIONES_RUKKA as CHILE_REGIONS, getComunasByRegion, getAllComunas } from './comunas'

import { REGIONES_RUKKA } from './comunas'

export function getComunasByRegionCode(code) {
  const region = REGIONES_RUKKA.find(r => r.id === code)
  return region?.comunas ?? []
}
