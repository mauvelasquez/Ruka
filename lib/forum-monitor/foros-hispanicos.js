import { matchesKeyword } from './keywords.js'

// Google News RSS — 200 desde IPs de Vercel, sin auth, ~70 items por query
// Cada query agrupa conceptos similares para no saturar con requests
const GOOGLE_NEWS_QUERIES = [
  {
    name: "Google News — intercambio casas ES",
    q: '"intercambio de casas" OR "intercambio de hogar" OR "canje de casa" OR "trueque de hogar"',
    hl: "es-419", gl: "CL",
  },
  {
    name: "Google News — home exchange EN",
    q: '"home exchange" OR "house swap" OR "house sitting" OR "home swap" latinoamerica',
    hl: "es-419", gl: "CL",
  },
  {
    name: "Google News — alojamiento alternativo",
    q: '"alojamiento reciproco" OR "hospedaje alternativo" OR "alojamiento colaborativo" OR "viaje sin hotel" chile OR argentina OR colombia OR mexico',
    hl: "es-419", gl: "CL",
  },
  {
    name: "Google News — plataformas similares",
    q: 'homeexchange OR "love home swap" OR intervac OR nomador OR trustedhousesitters OR "house sitting" chile',
    hl: "es-419", gl: "CL",
  },
  {
    name: "Google News — troca casas PT",
    q: '"troca de casas" OR "intercambio de moradia" OR "permuta de imóvel" OR "hospedagem gratuita"',
    hl: "pt-BR", gl: "BR",
  },
]

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function extractTag(xml, tag) {
  const re = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`
  )
  const match = xml.match(re)
  return (match?.[1] ?? match?.[2] ?? "").trim()
}

export async function scanForosHispanicos({ debug = false } = {}) {
  const posts = []
  const stats = {}

  for (const query of GOOGLE_NEWS_QUERIES) {
    try {
      const params = new URLSearchParams({
        q: query.q,
        hl: query.hl,
        gl: query.gl,
        ceid: `${query.gl}:${query.hl.split("-")[0]}`,
      })

      const url = `https://news.google.com/rss/search?${params}`
      const res = await fetch(url, {
        headers: { "User-Agent": "rukka-monitor/1.0" },
        cache: "no-store",
      })

      if (!res.ok) {
        stats[query.name] = { status: res.status, fetched: 0, matched: 0 }
        continue
      }

      const xml = await res.text()
      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? []
      let matched = 0

      for (const item of items) {
        const title = extractTag(item, "title")
        const link = extractTag(item, "link")
        const description = extractTag(item, "description")
        const pubDate = extractTag(item, "pubDate")

        if (!link) continue
        if (matchesKeyword(`${title} ${description}`)) {
          matched++
          posts.push({
            source: query.name,
            title,
            url: link,
            snippet: description.replace(/<[^>]+>/g, "").slice(0, 300),
            date: pubDate,
          })
        }
      }

      stats[query.name] = { fetched: items.length, matched }
      await sleep(500)
    } catch (e) {
      console.error(`[monitor] Error en ${query.name}:`, e)
      stats[query.name] = { error: e.message, fetched: 0, matched: 0 }
    }
  }

  // Deduplicar por URL
  const seen = new Set()
  const unique = posts.filter(p => {
    if (seen.has(p.url)) return false
    seen.add(p.url)
    return true
  })

  return debug ? { posts: unique, stats } : unique
}
