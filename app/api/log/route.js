import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import logger from '../../../lib/logger'

const VALID_LEVELS = new Set(['error', 'warn', 'info', 'debug'])

// Rate limit en memoria — en serverless es efímero pero suficiente contra spam accidental.
// El Map se resetea con cada cold start, lo que es aceptable para este uso.
const ipCounts = new Map()

function isRateLimited(ip) {
  const now    = Date.now()
  const WINDOW = 60_000
  const MAX    = 20

  const entry = ipCounts.get(ip) ?? { count: 0, resetAt: now + WINDOW }
  if (now > entry.resetAt) { entry.count = 1; entry.resetAt = now + WINDOW }
  else entry.count += 1
  ipCounts.set(ip, entry)

  return entry.count > MAX
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip)) return NextResponse.json({ ok: true })

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ ok: true })

    const { level, source, message, metadata } = body
    if (!VALID_LEVELS.has(level) || !source || typeof message !== 'string') {
      return NextResponse.json({ ok: true })
    }

    let userId = null
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id ?? null
    } catch {}

    logger[level](source, message.slice(0, 500), { userId, metadata: metadata ?? {} })
  } catch {}

  return NextResponse.json({ ok: true })
}
