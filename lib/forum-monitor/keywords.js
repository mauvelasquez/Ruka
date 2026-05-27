// ─── Español — concepto core ───────────────────────────────────────────────
const ES_CORE = [
  "intercambio de casa", "intercambio de hogar", "intercambio de departamento",
  "intercambio de apartamento", "intercambio de vivienda", "intercambio de piso",
  "intercambio habitacional", "intercambio de propiedad",
  "canje de casa", "canje de hogar", "trueque de casa", "trueque de hogar",
  "swap de casa", "swap de hogar", "swapear casa",
  "intercambiar mi casa", "intercambiar casa",
  "casa por casa", "hogar por hogar",
  "turismo de intercambio", "vacaciones de intercambio",
  "viaje de intercambio de hogar",
]

// ─── Español — alojamiento recíproco / alternativo ─────────────────────────
const ES_ALOJAMIENTO = [
  "alojamiento recíproco", "hospedaje recíproco", "alojamiento colaborativo",
  "turismo colaborativo alojamiento", "vivienda colaborativa",
  "alojarme sin pagar", "alojarse gratis", "hospedarse sin pagar",
  "hospedar sin cobrar", "alojar sin cobrar", "anfitrión sin cobrar",
  "alojamiento gratis", "hospedaje gratis", "hospedaje alternativo",
  "alojamiento alternativo", "donde alojarme gratis", "dónde quedarme gratis",
  "viaje sin hotel", "vacaciones sin hotel", "turismo sin hotel",
]

// ─── Español — destinos LATAM ───────────────────────────────────────────────
const ES_LATAM = [
  "viajar a chile barato", "viaje a chile sin hotel", "chile mochilero alojamiento",
  "santiago alojamiento", "patagonia alojamiento barato",
  "alojamiento barato chile", "hospedaje chile gratis",
  "viajar a argentina sin hotel", "buenos aires alojamiento gratis",
  "colombia alojamiento alternativo", "bogotá alojamiento gratis",
  "mexico alojamiento alternativo", "cdmx alojamiento gratis",
  "peru alojamiento alternativo", "lima alojamiento gratis",
  "brasil intercambio de casas", "uruguay intercambio hogar",
]

// ─── English ────────────────────────────────────────────────────────────────
const EN = [
  // Core concept
  "home exchange", "house swap", "house exchange", "home swap",
  "home swapping", "house swapping", "property swap", "home trade",
  "vacation home exchange", "holiday home swap", "holiday exchange",
  "swap homes", "trade homes", "exchange homes",
  "reciprocal hospitality", "reciprocal hosting", "home for home",
  "non simultaneous exchange", "points based exchange",
  // House/home sitting
  "house sitting", "home sitting", "housesitting",
  // Travel without hotels
  "travel without hotels", "trip without hotel", "free accommodation travel",
  "stay for free", "accommodation exchange",
]

// ─── Português (Brasil + Portugal) ─────────────────────────────────────────
const PT = [
  "troca de casas", "troca de casa", "intercâmbio de casas",
  "intercâmbio de moradia", "intercâmbio de imóvel",
  "trocar casa", "permuta de imóvel", "permuta de casa",
  "troca de apartamento", "troca de moradia",
  "hospedagem gratuita", "hospedagem alternativa",
  "moradia grátis", "ficar de graça", "viagem sem hotel",
  "férias sem hotel", "turismo colaborativo hospedagem",
  "troca de lar", "intercâmbio lar",
]

// ─── Français ───────────────────────────────────────────────────────────────
const FR = [
  "échange de maison", "échange de logement", "échange d'appartement",
  "swap maison", "échange de vacances", "hébergement gratuit",
  "hospitalité réciproque", "voyage sans hôtel", "vacances échange",
  "troc de maison", "troc logement",
]

// ─── Italiano ───────────────────────────────────────────────────────────────
const IT = [
  "scambio di case", "scambio casa", "scambio di abitazione",
  "scambio di appartamento", "ospitalità reciproca",
  "alloggio gratuito", "viaggio senza hotel",
]

// ─── Deutsch ────────────────────────────────────────────────────────────────
const DE = [
  "haustausch", "wohnungstausch", "haustausch urlaub",
  "kostenlose unterkunft", "urlaub tauschen",
]

// ─── Plataformas similares a Rukka ─────────────────────────────────────────
const PLATFORMS = [
  // Intercambio de hogares
  "homeexchange", "home exchange .com", "kindred homes", "love home swap",
  "intervac", "intervac.com", "nomador", "homelink", "home link",
  "dial an exchange", "switchome", "trampolinn", "knok",
  "guesttoguest", "guest to guest",
  // House sitting
  "trustedhousesitters", "trusted house sitters", "mindmyhouse",
  "housecarers", "luxuryhousesitting",
  // Hospitalidad gratuita / comunidad
  "couchsurfing", "bewelcome", "servas", "warm showers",
  "pasporta servo", "hospitality club",
  // Work exchange
  "workaway", "wwoof", "helpx", "worldpackers", "volunteer world",
  "workaways",
  // Coliving / nómadas
  "coliving exchange", "nomad exchange", "digital nomad housing swap",
]

// ─── Concepto expandido / intención de búsqueda ────────────────────────────
const INTENT = [
  // Personas buscando solución
  "busco donde quedarme gratis", "necesito alojamiento gratis",
  "alguien que me hospede", "alguien que me aloje",
  "busco anfitrión", "busco hospedarme",
  "intercambio sin plataforma", "intercambio directo de casas",
  "prestar mi casa a cambio", "ofrecer mi casa a cambio",
  "hospedo a cambio de", "alojo a cambio de",
  // Dudas frecuentes
  "es seguro intercambiar casas", "cómo funciona el intercambio de casas",
  "experiencia intercambio de hogar", "intercambiaste tu casa",
  "alguien ha intercambiado casa", "vale la pena intercambiar casa",
  // Inglés intent
  "looking for home exchange", "anyone done home exchange",
  "is home exchange safe", "home exchange experience",
  "free place to stay", "stay at someone's home",
]

export const KEYWORDS = [
  ...ES_CORE,
  ...ES_ALOJAMIENTO,
  ...ES_LATAM,
  ...EN,
  ...PT,
  ...FR,
  ...IT,
  ...DE,
  ...PLATFORMS,
  ...INTENT,
]

const NEGATIVE_KEYWORDS = [
  "arriendo", "arrendar", "comprar casa", "vender casa",
  "casa en venta", "departamento en venta", "apartamento en venta",
  "propiedad en venta", "inmueble en venta",
  "intercambio de divisas", "intercambio de moneda", "tipo de cambio",
  "casa de cambio", "exchange rate", "currency exchange",
  "stock exchange", "bolsa de valores",
]

export function matchesKeyword(text) {
  const lower = text.toLowerCase()
  return (
    KEYWORDS.some(kw => lower.includes(kw)) &&
    !NEGATIVE_KEYWORDS.some(nk => lower.includes(nk))
  )
}
