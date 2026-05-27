export const KEYWORDS = [
  // Intercambio de casas
  "intercambio de casa", "intercambio de hogar", "intercambio de departamento",
  "home exchange", "house swap", "house sitting",
  "intercambio habitacional", "canje de casa",

  // Alojamiento alternativo / gratis
  "alojamiento gratis", "donde alojarme gratis", "alojarme sin pagar",
  "hospedaje alternativo", "alojamiento barato chile",
  "hospedaje chile gratis", "dónde quedarme", "donde quedarme",

  // Viajes a Chile desde LATAM
  "viajar a chile barato", "viaje a chile sin hotel",
  "chile mochilero alojamiento", "santiago alojamiento",
  "patagonia alojamiento barato",

  // Plataformas similares
  "couchsurfing chile", "workaway chile", "wwoof chile",
]

const NEGATIVE_KEYWORDS = [
  "arriendo", "arrendar", "comprar casa", "vender casa",
  "casa en venta", "departamento en venta",
]

export function matchesKeyword(text) {
  const lower = text.toLowerCase()
  return (
    KEYWORDS.some(kw => lower.includes(kw)) &&
    !NEGATIVE_KEYWORDS.some(nk => lower.includes(nk))
  )
}
