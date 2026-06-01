function stripAccents(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Lock único por artículo: combina título + keywords → misma foto en cada render
function stableHash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return (Math.abs(h) % 9000) + 1000
}

// keyword normalizado → keywords para loremflickr.com
// Orden importa: más específico primero
const DESTINATIONS = [
  // Chile — específico
  ['san pedro de atacama', 'atacama,desert'],
  ['torres del paine',     'patagonia,mountains'],
  ['puerto natales',       'patagonia,lake'],
  ['puerto varas',         'lake,mountains'],
  ['viña del mar',         'beach,sea'],
  ['vina del mar',         'beach,sea'],
  ['san alfonso',          'mountains,river'],
  ['la serena',            'beach,coast'],
  ['atacama',              'desert,landscape'],
  ['patagonia',            'patagonia,wilderness'],
  ['valparaiso',           'valparaiso,colorful'],
  ['santiago',             'santiago,city'],
  ['chiloe',               'island,nature'],
  ['pucon',                'volcano,lake'],
  ['elqui',                'valley,night'],
  // Caribe
  ['punta cana',           'beach,caribbean,turquoise'],
  ['cancun',               'cancun,beach,mexico'],
  ['cuba',                 'havana,cuba'],
  // Internacional (ciudades específicas antes de países)
  ['buenos aires',         'buenos-aires,argentina'],
  ['rio de janeiro',       'rio,brazil'],
  ['sao paulo',            'sao-paulo,city'],
  ['ciudad de mexico',     'mexico-city,mexico'],
  ['machu picchu',         'machu-picchu,peru'],
  ['nueva york',           'new-york,skyline'],
  ['new york',             'new-york,skyline'],
  ['los angeles',          'los-angeles,california'],
  ['madrid',               'madrid,spain'],
  ['barcelona',            'barcelona,spain'],
  ['bogota',               'bogota,colombia'],
  ['lima',                 'lima,peru'],
  ['cusco',                'cusco,peru'],
  ['cuzco',                'cusco,peru'],
  ['paris',                'paris,eiffel'],
  ['roma',                 'rome,colosseum'],
  ['venecia',              'venice,canal'],
  ['florencia',            'florence,italy'],
  ['tokio',                'tokyo,japan'],
  ['berlin',               'berlin,germany'],
  ['lisboa',               'lisbon,portugal'],
  ['miami',                'miami,beach'],
  // Países
  ['espana',               'spain,travel'],
  ['argentina',            'argentina,travel'],
  ['brasil',               'brazil,travel'],
  ['mexico',               'mexico,travel'],
  ['colombia',             'colombia,travel'],
  ['peru',                 'peru,travel'],
  ['francia',              'france,travel'],
  ['italia',               'italy,travel'],
  ['japon',                'japan,travel'],
  ['estados unidos',       'usa,travel'],
  ['portugal',             'portugal,travel'],
  ['alemania',             'germany,travel'],
  // Chile genérico (después de destinos específicos)
  ['chile',                'chile,landscape'],
]

// Detección por tipo de contenido cuando no hay destino geográfico
const CONTENT_TYPES = [
  [['preparar', 'fotografiar', 'ordenar'],     'interior,home,cozy'],
  [['hijos', 'familia', 'ninos'],              'family,travel,children'],
  [['hotel', 'vs hotel', 'mejor que hotel'],   'hotel,room,luxury'],
  [['airbnb', 'anfitrion'],                    'house,hosting,door'],
  [['semana santa', 'fiestas patrias',
    'vacaciones', 'septiembre'],               'holiday,travel,adventure'],
  [['viajar gratis', 'sin pagar', 'ahorrar'],  'travel,freedom,road'],
  [['que es home exchange', 'como funciona'],  'keys,house,travel'],
  [['latinoamerica', 'sudamerica', 'latam'],   'latinamerica,travel'],
]

const FALLBACK_KEYWORDS = 'travel,adventure'

function detectDestination(text) {
  for (const [keyword, kw] of DESTINATIONS) {
    if (text.includes(keyword)) return kw
  }
  for (const [keywords, kw] of CONTENT_TYPES) {
    if (keywords.some(k => text.includes(k))) return kw
  }
  return null
}

/**
 * Devuelve la URL de imagen para un artículo del blog.
 * Prioridad: cover manual → LoremFlickr por destino/contenido → fallback.
 * Lock único por artículo: mismos keywords → fotos distintas en distintos artículos.
 */
export function getArticleCoverImage(title = '', excerpt = '', coverImage = '') {
  if (coverImage && !coverImage.includes('picsum.photos')) return coverImage

  const text = stripAccents(`${title} ${excerpt}`.toLowerCase())
  const keywords = detectDestination(text) ?? FALLBACK_KEYWORDS
  // Incorporar el título al hash para que cada artículo tenga imagen única
  const lock = stableHash(title + keywords)
  return `https://loremflickr.com/800/500/${keywords}?lock=${lock}`
}

/** URL de fallback seguro (picsum siempre sirve) */
export function getFallbackImage(slug = '') {
  return `https://picsum.photos/seed/rukka-${slug || 'blog'}/800/500`
}
