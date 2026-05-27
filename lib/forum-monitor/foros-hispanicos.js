import { matchesKeyword } from './keywords.js'

const FORUM_FEEDS = [
  {
    name: "LosViajeros - Chile",
    url: "https://www.losviajeros.com/foros.php?f=73&format=rss",
  },
  {
    name: "LosViajeros - Argentina",
    url: "https://www.losviajeros.com/foros.php?f=5&format=rss",
  },
  {
    name: "LosViajeros - Latinoamérica",
    url: "https://www.losviajeros.com/foros.php?f=1&format=rss",
  },
  {
    name: "Mochileros.org",
    url: "https://mochileros.org/forum/rss.php",
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

  for (const feed of FORUM_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "rukka-monitor/1.0" },
        cache: "no-store",
      })

      if (!res.ok) {
        stats[feed.name] = { status: res.status, fetched: 0, matched: 0 }
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
            source: feed.name,
            title,
            url: link,
            snippet: description.slice(0, 300),
            date: pubDate,
          })
        }
      }

      stats[feed.name] = { fetched: items.length, matched }
      await sleep(2000)
    } catch (e) {
      console.error(`[monitor] Error en ${feed.name}:`, e)
      stats[feed.name] = { error: e.message, fetched: 0, matched: 0 }
    }
  }

  return debug ? { posts, stats } : posts
}
