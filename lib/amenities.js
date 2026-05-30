export const AMENITY_CATEGORIES = [
  {
    id: 'esenciales',
    label: 'Esenciales',
    amenities: [
      { id: 'wifi',               emoji: '📶', label: 'WiFi' },
      { id: 'cocina_equipada',    emoji: '🍳', label: 'Cocina equipada' },
      { id: 'calefaccion',        emoji: '🔥', label: 'Calefacción' },
      { id: 'aire_acondicionado', emoji: '❄️', label: 'Aire acondicionado' },
      { id: 'lavadora',           emoji: '🫧', label: 'Lavadora' },
      { id: 'secadora',           emoji: '♻️', label: 'Secadora' },
      { id: 'estacionamiento',    emoji: '🚗', label: 'Estacionamiento gratuito' },
      { id: 'tv_inteligente',     emoji: '📺', label: 'TV inteligente' },
      { id: 'streaming',          emoji: '🎬', label: 'Cable / streaming incluido' },
      { id: 'ropa_cama',          emoji: '🛏️', label: 'Ropa de cama incluida' },
      { id: 'toallas',            emoji: '🛁', label: 'Toallas incluidas' },
      { id: 'agua_caliente',      emoji: '🚿', label: 'Agua caliente' },
    ]
  },
  {
    id: 'bano',
    label: 'Baño',
    amenities: [
      { id: 'secador_cabello',    emoji: '💨', label: 'Secador de cabello' },
      { id: 'articulos_tocador',  emoji: '🧴', label: 'Artículos de tocador básicos' },
      { id: 'banera',             emoji: '🛁', label: 'Bañera' },
      { id: 'ducha_lluvia',       emoji: '🚿', label: 'Ducha lluvia' },
      { id: 'bidet',              emoji: '🚽', label: 'Bidet' },
      { id: 'papel_higienico',    emoji: '🧻', label: 'Papel higiénico incluido' },
    ]
  },
  {
    id: 'dormitorio',
    label: 'Dormitorio y descanso',
    amenities: [
      { id: 'cama_king',          emoji: '🛏️', label: 'Cama king size' },
      { id: 'cama_queen',         emoji: '🛏️', label: 'Cama queen size' },
      { id: 'cama_matrimonial',   emoji: '🛏️', label: 'Cama matrimonial' },
      { id: 'camas_individuales', emoji: '🛏️', label: 'Camas individuales' },
      { id: 'cama_cucheta',       emoji: '🪜',  label: 'Cama cucheta (litera)' },
      { id: 'sofa_cama',          emoji: '🛋️', label: 'Sofá cama' },
      { id: 'cuna_bebe',          emoji: '👶', label: 'Cuna para bebé' },
      { id: 'silla_alta_bebe',    emoji: '🪑', label: 'Silla alta para bebé' },
      { id: 'calienta_camas',     emoji: '🌡️', label: 'Calienta camas' },
      { id: 'almohadas_extra',    emoji: '😴', label: 'Almohadas extra' },
      { id: 'blackout',           emoji: '🌑', label: 'Persianas / blackout' },
    ]
  },
  {
    id: 'cocina',
    label: 'Cocina y comedor',
    amenities: [
      { id: 'cafetera',           emoji: '☕', label: 'Cafetera' },
      { id: 'cafetera_capsulas',  emoji: '☕', label: 'Cafetera de cápsulas (Nespresso)' },
      { id: 'hervidor',           emoji: '💧', label: 'Hervidor eléctrico' },
      { id: 'microondas',         emoji: '📦', label: 'Microondas' },
      { id: 'horno',              emoji: '🔆', label: 'Horno' },
      { id: 'horno_gas',          emoji: '🔆', label: 'Horno a gas' },
      { id: 'lavavajillas',       emoji: '🍽️', label: 'Lavavajillas' },
      { id: 'refrigerador',       emoji: '🧊', label: 'Refrigerador' },
      { id: 'congelador',         emoji: '🧊', label: 'Congelador' },
      { id: 'utensilios',         emoji: '🍴', label: 'Utensilios de cocina completos' },
      { id: 'vajilla',            emoji: '🍽️', label: 'Vajilla completa' },
      { id: 'mesa_comedor',       emoji: '🪑', label: 'Mesa de comedor' },
    ]
  },
  {
    id: 'exteriores',
    label: 'Espacios exteriores',
    amenities: [
      { id: 'jardin',             emoji: '🌿', label: 'Jardín privado' },
      { id: 'terraza',            emoji: '🏡', label: 'Terraza' },
      { id: 'balcon',             emoji: '🌅', label: 'Balcón' },
      { id: 'quincho',            emoji: '🔥', label: 'Quincho / parrilla (BBQ)' },
      { id: 'parrilla_electrica', emoji: '⚡', label: 'Parrilla eléctrica' },
      { id: 'fogon',              emoji: '🪵', label: 'Fogón' },
      { id: 'piscina_privada',    emoji: '🏊', label: 'Piscina privada' },
      { id: 'piscina_compartida', emoji: '🏊', label: 'Piscina compartida' },
      { id: 'hot_tub_privado',    emoji: '♨️', label: 'Tinaja caliente (Hot Tub) privada' },
      { id: 'hot_tub_compartido', emoji: '♨️', label: 'Tinaja caliente (Hot Tub) compartida' },
      { id: 'jacuzzi',            emoji: '🛁', label: 'Jacuzzi' },
      { id: 'ducha_exterior',     emoji: '🚿', label: 'Ducha exterior' },
      { id: 'hamacas',            emoji: '🌴', label: 'Hamacas' },
      { id: 'mobiliario_terraza', emoji: '🪑', label: 'Mobiliario de terraza' },
    ]
  },
  {
    id: 'bienestar',
    label: 'Bienestar y recreación',
    amenities: [
      { id: 'sauna',              emoji: '🧖', label: 'Sauna' },
      { id: 'sala_vapor',         emoji: '💨', label: 'Sala de vapor' },
      { id: 'gimnasio_privado',   emoji: '🏋️', label: 'Gimnasio privado' },
      { id: 'gimnasio_compartido',emoji: '🏋️', label: 'Gimnasio compartido' },
      { id: 'billar',             emoji: '🎱', label: 'Mesa de billar' },
      { id: 'ping_pong',          emoji: '🏓', label: 'Mesa de ping pong' },
      { id: 'juegos_mesa',        emoji: '🎲', label: 'Juegos de mesa' },
      { id: 'cancha_tenis',       emoji: '🎾', label: 'Cancha de tenis' },
      { id: 'cancha_basquet',     emoji: '🏀', label: 'Cancha de básquetbol' },
      { id: 'juegos_ninos',       emoji: '🧸', label: 'Zona de juegos para niños' },
      { id: 'home_theater',       emoji: '🎥', label: 'Sala de cine / home theater' },
    ]
  },
  {
    id: 'trabajo',
    label: 'Trabajo y conectividad',
    amenities: [
      { id: 'escritorio',         emoji: '💻', label: 'Escritorio de trabajo' },
      { id: 'silla_ergonomica',   emoji: '🪑', label: 'Silla ergonómica' },
      { id: 'wifi_rapido',        emoji: '⚡', label: 'WiFi de alta velocidad (>50 Mbps)' },
      { id: 'impresora',          emoji: '🖨️', label: 'Impresora' },
      { id: 'monitor_extra',      emoji: '🖥️', label: 'Monitor extra' },
    ]
  },
  {
    id: 'seguridad',
    label: 'Acceso y seguridad',
    amenities: [
      { id: 'checkin_autonomo',   emoji: '🔑', label: 'Check-in autónomo (caja de llaves)' },
      { id: 'conserjeria',        emoji: '👮', label: 'Conserjería 24/7' },
      { id: 'alarma',             emoji: '🚨', label: 'Sistema de alarma' },
      { id: 'camaras',            emoji: '📷', label: 'Cámaras exteriores' },
      { id: 'cerradura_smart',    emoji: '🔐', label: 'Cerraduras inteligentes' },
      { id: 'detector_humo',      emoji: '🔔', label: 'Detector de humo' },
      { id: 'extinguidor',        emoji: '🧯', label: 'Extinguidor' },
      { id: 'botiquin',           emoji: '🩹', label: 'Botiquín de primeros auxilios' },
    ]
  },
  {
    id: 'servicios',
    label: 'Servicios adicionales',
    amenities: [
      { id: 'desayuno',           emoji: '🥐', label: 'Desayuno incluido' },
      { id: 'limpieza_incluida',  emoji: '🧹', label: 'Servicio de limpieza incluido' },
      { id: 'limpieza_opcional',  emoji: '🧹', label: 'Servicio de limpieza opcional' },
      { id: 'mascotas',           emoji: '🐾', label: 'Acepta mascotas' },
      { id: 'apto_ninos',         emoji: '👨‍👩‍👧', label: 'Apto para niños' },
      { id: 'acceso_reducido',    emoji: '♿', label: 'Apto para movilidad reducida' },
      { id: 'sin_escaleras',      emoji: '🚶', label: 'Acceso sin escaleras' },
      { id: 'estac_grande',       emoji: '🚐', label: 'Estacionamiento vehículos grandes' },
      { id: 'cargador_electrico', emoji: '🔌', label: 'Cargador para autos eléctricos' },
      { id: 'bodega',             emoji: '📦', label: 'Bodega / almacenamiento' },
      { id: 'lavanderia_edificio',emoji: '🫧', label: 'Lavandería en el edificio' },
    ]
  },
]

// Maps legacy short IDs (pre-amenities redesign) → current IDs
const LEGACY_ID_MAP = {
  parking: 'estacionamiento',
  ac:      'aire_acondicionado',
  heating: 'calefaccion',
  tv:      'tv_inteligente',
  coffee:  'cafetera',
  kitchen: 'cocina_equipada',
  washer:  'lavadora',
  pets:    'mascotas',
  baby:    'apto_ninos',
}

export function getAmenityById(id) {
  const normalized = LEGACY_ID_MAP[id] || id
  for (const cat of AMENITY_CATEGORIES) {
    const found = cat.amenities.find(a => a.id === normalized)
    if (found) return found
  }
  return null
}

// Returns categories with only the amenities present in the home, skipping empty categories.
// Handles both current IDs and legacy IDs stored in existing Supabase rows.
export function groupHomeAmenities(amenityIds) {
  if (!amenityIds?.length) return []
  const ids = amenityIds.map(id => LEGACY_ID_MAP[id] || id)
  return AMENITY_CATEGORIES.map(cat => ({
    ...cat,
    present: cat.amenities.filter(a => ids.includes(a.id)),
  })).filter(cat => cat.present.length > 0)
}

// Helper: amenidades destacadas para HomeCard (en orden de prioridad)
export const FEATURED_AMENITY_PRIORITY = [
  'wifi', 'estacionamiento', 'cocina_equipada',
  'piscina_privada', 'piscina_compartida', 'hot_tub_privado',
  'hot_tub_compartido', 'jacuzzi', 'mascotas',
]

// Maps old Airbnb-import IDs → current IDs (for handleAirbnbImport)
export const AIRBNB_IMPORT_LEGACY_MAP = LEGACY_ID_MAP
