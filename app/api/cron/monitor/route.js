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

  const { searchParams } = new URL(req.url)
  const isDebug     = searchParams.get("debug") === "1"
  const isTestEmail = searchParams.get("test_email") === "1"
  const isForce     = searchParams.get("force") === "1"
  const supabase = getServiceClient()

  // Cargar URLs ya vistas en los últimos 7 días para no re-alertar
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: seen } = await supabase
    .from("monitor_seen_posts")
    .select("url")
    .gte("created_at", since)

  const seenUrls = new Set((seen ?? []).map(r => r.url))

  const [redditResult, foroResult] = await Promise.all([
    scanReddit({ debug: isDebug }),
    scanForosHispanicos({ debug: isDebug }),
  ])

  const redditPosts = isDebug ? redditResult.posts : redditResult
  const foroPosts   = isDebug ? foroResult.posts   : foroResult

  const newPosts = [...redditPosts, ...foroPosts].filter(
    p => p.url && (isForce || !seenUrls.has(p.url))
  )

  if (isTestEmail) {
    try {
      await sendAlertEmail([{
        source: "test",
        title: "Test: intercambio de casas en Santiago",
        url: "https://rukka.cl",
        snippet: "Este es un email de prueba para verificar que Resend está configurado correctamente.",
        date: new Date().toISOString(),
      }])
      return NextResponse.json({ email: "test_sent", to: process.env.ALERT_EMAIL })
    } catch (e) {
      return NextResponse.json({ email: "test_failed", error: e.message }, { status: 500 })
    }
  }

  let emailStatus = null
  if (newPosts.length > 0) {
    await supabase.from("monitor_seen_posts").insert(
      newPosts.map(p => ({
        url: p.url,
        source: p.source,
        title: p.title,
        snippet: p.snippet ?? null,
      }))
    )

    try {
      await sendAlertEmail(newPosts)
      emailStatus = "sent"
    } catch (e) {
      emailStatus = e.message
      console.error("[monitor] Email falló:", e.message)
    }
  }

  const response = {
    email: emailStatus,
    scanned_raw: isDebug
      ? Object.values({ ...redditResult.stats, ...foroResult.stats }).reduce((a, s) => a + (s.fetched ?? 0), 0)
      : undefined,
    matched: redditPosts.length + foroPosts.length,
    new_alerts: newPosts.length,
    timestamp: new Date().toISOString(),
    ...(isDebug && { reddit: redditResult.stats, foros: foroResult.stats }),
  }

  return NextResponse.json(response)
}
