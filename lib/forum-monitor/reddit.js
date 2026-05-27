import { matchesKeyword } from './keywords.js'

const SUBREDDITS = [
  "chile", "argentina", "colombia", "mexico",
  "viajes", "latinoamerica", "intercambio",
  "mochileros", "digitalnomad_es",
]

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

export async function scanReddit() {
  const posts = []

  for (const sub of SUBREDDITS) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/new.json?limit=50`,
        {
          headers: {
            "User-Agent": "rukka-monitor/1.0 (intercambio hogares chile)",
          },
          // Evitar caché de Next.js fetch
          cache: "no-store",
        }
      )

      if (!res.ok) continue

      const data = await res.json()
      const children = data?.data?.children ?? []

      for (const child of children) {
        const post = child.data
        const text = `${post.title} ${post.selftext ?? ""}`

        if (matchesKeyword(text)) {
          posts.push({
            source: `reddit/r/${sub}`,
            title: post.title,
            url: `https://reddit.com${post.permalink}`,
            snippet: (post.selftext ?? "").slice(0, 300),
            author: post.author,
            date: new Date(post.created_utc * 1000).toISOString(),
          })
        }
      }

      await sleep(1000)
    } catch (e) {
      console.error(`[monitor] Error en r/${sub}:`, e)
    }
  }

  return posts
}
