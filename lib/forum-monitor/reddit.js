import { matchesKeyword } from './keywords.js'

const SUBREDDITS = [
  "chile", "argentina", "colombia", "mexico",
  "viajes", "latinoamerica", "intercambio",
  "mochileros", "digitalnomad_es",
]

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function getAccessToken() {
  const credentials = Buffer.from(
    `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
  ).toString("base64")

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "User-Agent": "rukka-monitor/1.0 by /u/rukka_cl",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`Reddit OAuth falló: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

export async function scanReddit({ debug = false } = {}) {
  const posts = []
  const stats = {}

  let token
  try {
    token = await getAccessToken()
  } catch (e) {
    console.error("[monitor] Reddit OAuth error:", e.message)
    for (const sub of SUBREDDITS) {
      stats[sub] = { error: "oauth_failed", fetched: 0, matched: 0 }
    }
    return debug ? { posts, stats } : posts
  }

  for (const sub of SUBREDDITS) {
    try {
      const res = await fetch(
        `https://oauth.reddit.com/r/${sub}/new?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "rukka-monitor/1.0 by /u/rukka_cl",
          },
          cache: "no-store",
        }
      )

      if (!res.ok) {
        stats[sub] = { status: res.status, fetched: 0, matched: 0 }
        continue
      }

      const data = await res.json()
      const children = data?.data?.children ?? []
      let matched = 0

      for (const child of children) {
        const post = child.data
        const text = `${post.title} ${post.selftext ?? ""}`

        if (matchesKeyword(text)) {
          matched++
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

      stats[sub] = { fetched: children.length, matched }
      await sleep(600)
    } catch (e) {
      console.error(`[monitor] Error en r/${sub}:`, e)
      stats[sub] = { error: e.message, fetched: 0, matched: 0 }
    }
  }

  return debug ? { posts, stats } : posts
}
