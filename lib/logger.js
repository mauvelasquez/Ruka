// SUPABASE_SERVICE_ROLE_KEY: Supabase Dashboard → Project Settings → API → service_role
// Esta key NUNCA lleva prefijo NEXT_PUBLIC_ — es exclusiva del servidor.

import { createClient } from '@supabase/supabase-js'

let _serviceClient = null

function getServiceClient() {
  if (_serviceClient) return _serviceClient
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  _serviceClient = createClient(url, key, { auth: { persistSession: false } })
  return _serviceClient
}

const isProd = process.env.NODE_ENV === 'production'

export function log(level, source, message, context = {}) {
  const { userId, route, requestId, durationMs, error, metadata: extraMeta } = context

  const metadata = { ...(extraMeta ?? {}) }
  if (error instanceof Error) {
    metadata.error = { name: error.name, message: error.message, stack: error.stack }
  }

  const prefix = `[${level.toUpperCase()}] ${source}: ${message}`
  const consoleArgs = Object.keys(metadata).length > 0 ? [prefix, metadata] : [prefix]
  if (level === 'error')      console.error(...consoleArgs)
  else if (level === 'warn')  console.warn(...consoleArgs)
  else                        console.log(...consoleArgs)

  if (isProd) {
    const client = getServiceClient()
    if (client) {
      client.from('app_logs').insert({
        level,
        source,
        message,
        user_id:     userId    ?? null,
        route:       route     ?? null,
        request_id:  requestId ?? null,
        duration_ms: durationMs ?? null,
        metadata:    Object.keys(metadata).length > 0 ? metadata : null,
      }).then(({ error: dbErr }) => {
        if (dbErr) console.error('[logger] insert failed:', dbErr.message)
      })
    }
  }
}

const logger = {
  error: (source, message, ctx) => log('error', source, message, ctx),
  warn:  (source, message, ctx) => log('warn',  source, message, ctx),
  info:  (source, message, ctx) => log('info',  source, message, ctx),
  debug: (source, message, ctx) => log('debug', source, message, ctx),
}

export default logger
