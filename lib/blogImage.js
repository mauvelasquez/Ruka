function stripAccents(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Hash determinista para el parámetro ?lock de LoremFlickr (misma semilla = misma foto)
function stableHash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return (Math.abs(h) % 9000) + 1000
}

// keyword normalizado → keywords para loremflickr.com (simples, en inglés)
const DESTINATIONS = [
  // Chile — más específico primero
  ['san pedro de atacama', 'atacama,desert'],
  ['torres del paine',     'patagonia,mountains'],
  ['puerto natales',       'patagonia,lake'],
  ['puerto varas',         'lake,mountains'],
  ['viña del mar',         'beach,sea'],
  ['vina del mar',         'beach,sea'],
  ['san alfonso',          'mountains,river'],
  ['la serena',            'beach,coast'],
  ['atacama',              'atacama,desert'],
  ['patagonia',            'patagonia,wilderness'],
  ['valparaiso',           'valparaiso,colorful'],
  ['santiago',             'santiago,city'],
  ['chiloe',               'island,nature'],
  ['pucon',                'volcano,lake'],
  ['elqui',                'valley,stars'],
  // Internacional
  ['buenos aires',         'buenos-aires,argentina'],
  ['rio de janeiro',       'rio,brazil'],
  ['sao paulo',            'sao-paulo,city'],
  ['ciudad de mexico',     'mexico-city,mexico'],
  ['machu picchu',         'machu-picchu,inca'],
  ['nueva york',           'new-york,skyline'],
  ['new york',             'new-york,skyline'],
  ['los angeles',          'los-angeles,california'],
  ['madrid',               'madrid,spain'],
  ['barcelona',            'barcelona,spain'],
  ['bogota',               'bogota,colombia'],
  ['cartagena',            'cartagena,caribbean'],
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
]

const FALLBACK_KEYWORDS = 'chile,landscape'

function detectDestination(title, excerpt) {
  const text = stripAccents(`${title} ${excerpt}`.toLowerCase())
  for (const [keyword, kw] of DESTINATIONS) {
    if (text.includes(keyword)) return kw
  }
  return null
}

/**
 * Devuelve la URL de imagen para un artículo del blog.
 * Prioridad: cover manual → LoremFlickr por destino → fallback Chile.
 */
export function getArticleCoverImage(title = '', excerpt = '', coverImage = '') {
  if (coverImage && !coverImage.includes('picsum.photos')) return coverImage

  const keywords = detectDestination(title, excerpt) ?? FALLBACK_KEYWORDS
  const lock = stableHash(keywords)
  return `https://loremflickr.com/800/500/${keywords}?lock=${lock}`
}

/** URL de fallback seguro (picsum siempre sirve) */
export function getFallbackImage(slug = '') {
  return `https://picsum.photos/seed/rukka-${slug || 'blog'}/800/500`
}
