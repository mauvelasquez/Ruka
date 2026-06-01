function stripAccents(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// keyword (sin tildes para comparación) → query string para Unsplash
const DESTINATIONS = [
  // Chile — más específico primero
  ['san pedro de atacama', 'san-pedro-atacama,atacama,desert'],
  ['torres del paine',     'torres-del-paine,patagonia,mountains'],
  ['puerto natales',       'puerto-natales,patagonia,chile'],
  ['puerto varas',         'puerto-varas,lake,chile'],
  ['viña del mar',         'vina-del-mar,beach,chile'],
  ['vina del mar',         'vina-del-mar,beach,chile'],
  ['san alfonso',          'cajon-del-maipo,mountains,chile'],
  ['la serena',            'la-serena,chile,beach'],
  ['atacama',              'atacama,desert,chile'],
  ['patagonia',            'patagonia,mountains,landscape'],
  ['valparaiso',           'valparaiso,chile,port'],
  ['santiago',             'santiago,chile,city'],
  ['chiloe',               'chiloe,island,chile'],
  ['pucon',                'pucon,volcano,chile'],
  ['elqui',                'elqui,valley,chile'],
  // Internacional
  ['buenos aires',         'buenos-aires,argentina'],
  ['rio de janeiro',       'rio-de-janeiro,brazil'],
  ['sao paulo',            'sao-paulo,brazil'],
  ['ciudad de mexico',     'mexico-city,travel'],
  ['machu picchu',         'machu-picchu,peru'],
  ['nueva york',           'new-york,usa'],
  ['new york',             'new-york,usa'],
  ['los angeles',          'los-angeles,california'],
  ['madrid',               'madrid,spain'],
  ['barcelona',            'barcelona,spain'],
  ['bogota',               'bogota,colombia'],
  ['cartagena',            'cartagena,colombia'],
  ['lima',                 'lima,peru'],
  ['cusco',                'cusco,peru'],
  ['cuzco',                'cusco,peru'],
  ['paris',                'paris,france'],
  ['roma',                 'rome,italy'],
  ['venecia',              'venice,italy'],
  ['florencia',            'florence,italy'],
  ['tokio',                'tokyo,japan'],
  ['berlin',               'berlin,germany'],
  ['lisboa',               'lisbon,portugal'],
  ['miami',                'miami,florida'],
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

const FALLBACK_QUERY = 'chile,travel,landscape'

function detectDestination(title, excerpt) {
  const text = stripAccents(`${title} ${excerpt}`.toLowerCase())
  for (const [keyword, query] of DESTINATIONS) {
    if (text.includes(keyword)) return query
  }
  return null
}

/**
 * Devuelve la URL de imagen para un artículo del blog.
 * Prioridad: cover manual → Unsplash por destino detectado → fallback Chile.
 */
export function getArticleCoverImage(title = '', excerpt = '', coverImage = '') {
  if (coverImage && !coverImage.includes('picsum.photos')) return coverImage

  const query = detectDestination(title, excerpt) ?? FALLBACK_QUERY
  return `https://source.unsplash.com/800x500/?${query}`
}
