import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '../../../../lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )
}

export async function GET(request) {
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const level  = searchParams.get('level')  || null
  const source = searchParams.get('source') || null
  const hours  = Math.min(parseInt(searchParams.get('hours')  ?? '24', 10), 168) // máx 7d
  const offset = Math.max(parseInt(searchParams.get('offset') ?? '0',  10), 0)

  const since = new Date(Date.now() - hours * 3_600_000).toISOString()

  let query = serviceClient()
    .from('app_logs')
    .select('id, created_at, level, source, message, user_id, route, request_id, duration_ms, metadata')
    .order('created_at', { ascending: false })
    .gte('created_at', since)
    .range(offset, offset + 49)

  if (level)  query = query.eq('level', level)
  if (source) query = query.eq('source', source)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ logs: data ?? [] }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
