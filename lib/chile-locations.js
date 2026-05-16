// ─── LOCALIDADES RUKKA — Litoral Central Chile ────────────────────────────────
// Plataforma exclusiva para el litoral central.

export const CHILE_REGIONS = [
  {
    code: 'V',
    name: 'Región de Valparaíso',
    comunas: ['Zapallar', 'Cachagua', 'Papudo', 'Santo Domingo'],
  },
  {
    code: 'VI',
    name: "Región de O'Higgins",
    comunas: ['Pichilemu', 'Puertecillo', 'Navidad', 'Matanzas'],
  },
]

export function getComunasByRegion(regionName) {
  const region = CHILE_REGIONS.find(r => r.name === regionName)
  return region ? region.comunas : []
}

export function getAllComunas() {
  return CHILE_REGIONS.flatMap(r => r.comunas).sort()
}
