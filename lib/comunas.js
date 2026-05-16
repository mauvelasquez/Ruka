// ─── LOCALIDADES RUKKA — Litoral Central Chile ────────────────────────────────
// Plataforma exclusiva para el litoral central. Única fuente de verdad.

export const REGIONES_RUKKA = [
  {
    id: 'valparaiso',
    nombre: 'Región de Valparaíso',
    comunas: ['Zapallar', 'Cachagua', 'Papudo', 'Santo Domingo'],
  },
  {
    id: 'ohiggins',
    nombre: "Región de O'Higgins",
    comunas: ['Pichilemu', 'Puertecillo', 'Navidad', 'Matanzas'],
  },
]

// Lista plana de todas las localidades disponibles
export const COMUNAS_RUKKA = REGIONES_RUKKA.flatMap(r => r.comunas).sort()

// Destinos con metadata visual para tarjetas, banners y hero
export const DESTINOS_RUKKA = [
  {
    id: 'zapallar',
    city: 'Zapallar',
    region: 'Región de Valparaíso',
    tipo: 'Playa',
    tagline: 'Elegancia frente al mar',
    description: 'El balneario más exclusivo de Chile. Caleta íntima, vegetación exuberante y mar cristalino.',
    image: 'https://images.unsplash.com/photo-1628048373575-ab3f2a663985?w=800&q=80',
    color: '#134e4a',
    accent: '#2dd4bf',
    emoji: '🌺',
    tags: ['Playa', 'Relax', 'Gastronomía'],
  },
  {
    id: 'cachagua',
    city: 'Cachagua',
    region: 'Región de Valparaíso',
    tipo: 'Playa',
    tagline: 'La playa más secreta del litoral',
    description: 'Reserva natural, pingüinos de Humboldt y una playa protegida que enamora a quienes la descubren.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    color: '#0c4a6e',
    accent: '#7dd3fc',
    emoji: '🐧',
    tags: ['Playa', 'Naturaleza', 'Tranquilidad'],
  },
  {
    id: 'papudo',
    city: 'Papudo',
    region: 'Región de Valparaíso',
    tipo: 'Playa',
    tagline: 'El balneario más pintoresco',
    description: 'Caleta de pescadores, playas tranquilas y aire puro en la costa norte de Valparaíso.',
    image: 'https://images.unsplash.com/photo-1628048460441-633a59962c5e?w=800&q=80',
    color: '#0c4a6e',
    accent: '#38bdf8',
    emoji: '⚓',
    tags: ['Playa', 'Tranquilidad', 'Familia'],
  },
  {
    id: 'santo-domingo',
    city: 'Santo Domingo',
    region: 'Región de Valparaíso',
    tipo: 'Playa',
    tagline: 'Arena blanca y olas perfectas',
    description: 'Playas vírgenes, dunas y el mejor borde costero del litoral central de Chile.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    color: '#0369a1',
    accent: '#7dd3fc',
    emoji: '🏖️',
    tags: ['Playa', 'Dunas', 'Surf'],
  },
  {
    id: 'pichilemu',
    city: 'Pichilemu',
    region: "Región de O'Higgins",
    tipo: 'Playa / Surf',
    tagline: 'Las olas te esperan',
    description: 'Capital del surf en Chile. Punta de Lobos, atardeceres de película y brisa de mar todo el año.',
    image: 'https://images.unsplash.com/photo-1582142894463-cfa81bf9083c?w=800&q=80',
    color: '#0f3460',
    accent: '#4ade80',
    emoji: '🏄',
    tags: ['Surf', 'Playa', 'Aventura'],
  },
  {
    id: 'puertecillo',
    city: 'Puertecillo',
    region: "Región de O'Higgins",
    tipo: 'Playa / Surf',
    tagline: 'El secreto del surf chileno',
    description: 'Olas de clase mundial, acantilados salvajes y una comunidad de surfistas que guardan celosamente su paraíso.',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
    color: '#1e3a5f',
    accent: '#4ade80',
    emoji: '🤙',
    tags: ['Surf', 'Playa', 'Aventura'],
  },
  {
    id: 'navidad',
    city: 'Navidad',
    region: "Región de O'Higgins",
    tipo: 'Playa',
    tagline: 'Costa salvaje del Pacífico',
    description: 'Acantilados, playas solitarias y el oleaje más poderoso del litoral central. Naturaleza sin filtros.',
    image: 'https://images.unsplash.com/photo-1476900543704-4312b78632f8?w=800&q=80',
    color: '#1e3a5f',
    accent: '#60a5fa',
    emoji: '🌊',
    tags: ['Playa', 'Naturaleza', 'Tranquilidad'],
  },
  {
    id: 'matanzas',
    city: 'Matanzas',
    region: "Región de O'Higgins",
    tipo: 'Playa / Naturaleza',
    tagline: 'El viento libre de Matanzas',
    description: 'Paraíso del kitesurf y windsurf. Vientos constantes, acantilados imponentes y playas casi deshabitadas.',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
    color: '#1a3c5e',
    accent: '#38bdf8',
    emoji: '🪁',
    tags: ['Kitesurf', 'Playa', 'Naturaleza'],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getComunasByRegion(regionNombre) {
  const region = REGIONES_RUKKA.find(r => r.nombre === regionNombre)
  return region?.comunas ?? []
}

export function getAllComunas() {
  return COMUNAS_RUKKA
}

export function getDestinoByCity(city) {
  return DESTINOS_RUKKA.find(d => d.city.toLowerCase() === city.toLowerCase())
}
