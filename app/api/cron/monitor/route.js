import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { scanReddit } from "@/lib/forum-monitor/reddit"
import { scanForosHispanicos } from "@/lib/forum-monitor/foros-hispanicos"
import { sendAlertEmail } from "@/lib/forum-monitor/email"

export const runtime = "nodejs"
export const maxDuration = 300

// Cliente con service role para bypass de RLS en tabla interna del monitor
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function GET(req) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getServiceClient()

  // Cargar URLs ya vistas en los últimos 7 días para no re-alertar
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: seen } = await supabase
    .from("monitor_seen_posts")
    .select("url")
    .gte("created_at", since)

  const seenUrls = new Set((seen ?? []).map(r => r.url))

  // Ambos scans en paralelo para no agotar el timeout
  const [redditPosts, foroPosts] = await Promise.all([
    scanReddit(),
    scanForosHispanicos(),
  ])

  const newPosts = [...redditPosts, ...foroPosts].filter(
    p => p.url && !seenUrls.has(p.url)
  )

  if (newPosts.length > 0) {
    await supabase.from("monitor_seen_posts").insert(
      newPosts.map(p => ({
        url: p.url,
        source: p.source,
        title: p.title,
        snippet: p.snippet ?? null,
      }))
    )

    await sendAlertEmail(newPosts)
  }

  return NextResponse.json({
    scanned: redditPosts.length + foroPosts.length + seenUrls.size,
    new_alerts: newPosts.length,
    timestamp: new Date().toISOString(),
  })
}
