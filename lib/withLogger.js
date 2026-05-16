import { createClient } from './supabase/server'
import logger from './logger'

export function withLogger(source, handler) {
  return async function wrappedHandler(request, ctx) {
    const requestId = crypto.randomUUID()
    const start     = Date.now()
    const route     = new URL(request.url).pathname

    let userId = null
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id ?? null
    } catch {}

    let response
    try {
      response = await handler(request, ctx)
    } catch (err) {
      const durationMs = Date.now() - start
      logger.error(source, 'unhandled_error', { userId, route, requestId, durationMs, error: err })
      throw err
    }

    const durationMs = Date.now() - start
    if (process.env.NODE_ENV === 'production') {
      logger.info(source, 'request_complete', { userId, route, requestId, durationMs })
    }

    // Adjuntar X-Request-Id sin mutar el response original
    const headers = new Headers(response.headers)
    headers.set('X-Request-Id', requestId)
    return new Response(response.body, {
      status:     response.status,
      statusText: response.statusText,
      headers,
    })
  }
}
