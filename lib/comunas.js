// ─── COMUNAS Y REGIONES DE CHILE — Única fuente de verdad ───────────────────
// Todas las regiones y comunas oficiales de Chile.
// Generado a partir de lib/chile-locations.js (División político-administrativa).

// Mapeo code → nombre oficial para los selects
const REGION_NOMBRES = {
  XV:   'Región de Arica y Parinacota',
  I:    'Región de Tarapacá',
  II:   'Región de Antofagasta',
  III:  'Región de Atacama',
  IV:   'Región de Coquimbo',
  V:    'Región de Valparaíso',
  RM:   'Región Metropolitana',
  VI:   "Región de O'Higgins",
  VII:  'Región del Maule',
  XVI:  'Región de Ñuble',
  VIII: 'Región del Biobío',
  IX:   'Región de La Araucanía',
  XIV:  'Región de Los Ríos',
  X:    'Región de Los Lagos',
  XI:   'Región de Aysén',
  XII:  'Región de Magallanes',
}

export const REGIONES_RUKKA = [
  {
    id: 'arica-parinacota',
    nombre: 'Región de Arica y Parinacota',
    comunas: ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  },
  {
    id: 'tarapaca',
    nombre: 'Región de Tarapacá',
    comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
  },
  {
    id: 'antofagasta',
    nombre: 'Región de Antofagasta',
    comunas: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'],
  },
  {
    id: 'atacama',
    nombre: 'Región de Atacama',
    comunas: ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'],
  },
  {
    id: 'coquimbo',
    nombre: 'Región de Coquimbo',
    comunas: ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'],
  },
  {
    id: 'valparaiso',
    nombre: 'Región de Valparaíso',
    comunas: ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Limache', 'Nogales', 'Olmué', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quilpué', 'Villa Alemana'],
  },
  {
    id: 'metropolitana',
    nombre: 'Región Metropolitana',
    comunas: ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'],
  },
  {
    id: 'ohiggins',
    nombre: "Región de O'Higgins",
    comunas: ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'],
  },
  {
    id: 'maule',
    nombre: 'Región del Maule',
    comunas: ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'],
  },
  {
    id: 'nuble',
    nombre: 'Región de Ñuble',
    comunas: ['Chillán', 'Bulnes', 'Chillán Viejo', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay', 'Quirihue', 'Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Ranquil', 'Treguaco', 'San Carlos', 'Coihueco', 'Ñiquén', 'San Fabián', 'San Nicolás'],
  },
  {
    id: 'biobio',
    nombre: 'Región del Biobío',
    comunas: ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén', 'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa', 'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío'],
  },
  {
    id: 'araucania',
    nombre: 'Región de La Araucanía',
    comunas: ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'],
  },
  {
    id: 'los-rios',
    nombre: 'Región de Los Ríos',
    comunas: ['Valdivia', 'Corral', 'Futrono', 'La Unión', 'Lago Ranco', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'Río Bueno'],
  },
  {
    id: 'los-lagos',
    nombre: 'Región de Los Lagos',
    comunas: ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'],
  },
  {
    id: 'aysen',
    nombre: 'Región de Aysén',
    comunas: ['Coihaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', "O'Higgins", 'Tortel', 'Chile Chico', 'Río Ibáñez'],
  },
  {
    id: 'magallanes',
    nombre: 'Región de Magallanes',
    comunas: ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine'],
  },
]

// Lista plana de todas las comunas de Chile
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
    id: 'papudo',
    city: 'Papudo',
    region: 'Región de Valparaíso',
    tipo: 'Playa',
    tagline: 'El balneario más pintoresco',
    description: 'Caleta de pescadores, playas tranquilas y aire puro en la costa de Valparaíso.',
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
    id: 'las-cabras',
    city: 'Las Cabras',
    region: "Región de O'Higgins",
    tipo: 'Lago',
    tagline: 'El lago Rapel te espera',
    description: 'Lago artificial rodeado de cerros. El paraíso del windsurf, el kayak y los fines de semana en familia.',
    image: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=800&q=80',
    color: '#14532d',
    accent: '#86efac',
    emoji: '🏕️',
    tags: ['Lago', 'Deportes acuáticos', 'Familia'],
  },
  {
    id: 'san-jose-de-maipo',
    city: 'San José de Maipo',
    region: 'Región Metropolitana',
    tipo: 'Montaña',
    tagline: 'El Cajón del Maipo',
    description: 'A solo una hora de Santiago. Rafting, trekking, termas y el río Maipo entre cañones de roca.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    color: '#1a3c2c',
    accent: '#4ade80',
    emoji: '🏔️',
    tags: ['Montaña', 'Aventura', 'Termas'],
  },
  {
    id: 'panguipulli',
    city: 'Panguipulli',
    region: 'Región de Los Ríos',
    tipo: 'Lago',
    tagline: 'Tierra de lagos y volcanes',
    description: 'Siete lagos, bosques centenarios y el volcán Choshuenco reflejado en las aguas del Panguipulli.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    color: '#134e4a',
    accent: '#34d399',
    emoji: '🌲',
    tags: ['Lago', 'Naturaleza', 'Tranquilidad'],
  },
  {
    id: 'puerto-varas',
    city: 'Puerto Varas',
    region: 'Región de Los Lagos',
    tipo: 'Lago / Volcán',
    tagline: 'Lago y volcán en Puerto Varas',
    description: 'El volcán Osorno, el lago Llanquihue y casas de arquitectura alemana. El sur de Chile en su máxima expresión.',
    image: 'https://images.unsplash.com/photo-1578704399126-38975ba256d7?w=800&q=80',
    color: '#1e3a5f',
    accent: '#93c5fd',
    emoji: '🌋',
    tags: ['Lago', 'Volcán', 'Sur de Chile'],
  },
  {
    id: 'frutillar',
    city: 'Frutillar',
    region: 'Región de Los Lagos',
    tipo: 'Lago',
    tagline: 'Baviera al sur del mundo',
    description: 'Casas bavaras, el lago Llanquihue y el volcán Osorno reflejado en el agua.',
    image: 'https://images.unsplash.com/photo-1709525481712-65ff5856b9bd?w=800&q=80',
    color: '#1c3d5a',
    accent: '#38bdf8',
    emoji: '🎭',
    tags: ['Lago', 'Cultura', 'Tranquilidad'],
  },
  {
    id: 'calbuco',
    city: 'Calbuco',
    region: 'Región de Los Lagos',
    tipo: 'Archipiélago / Volcán',
    tagline: 'Archipiélago y volcán',
    description: 'Un archipiélago de 14 islas bajo la sombra del volcán Calbuco. Pesca artesanal y mar austral.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    color: '#0f2942',
    accent: '#7dd3fc',
    emoji: '⛵',
    tags: ['Mar', 'Pesca', 'Volcán'],
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
