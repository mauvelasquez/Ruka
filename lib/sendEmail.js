import { Resend } from 'resend'
import logger from './logger.js'

const FROM = 'Rukka <hola@rukka.cl>'
let _resend = null

function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || 'no-key')
  return _resend
}

export async function sendEmail({
  to,
  subject,
  react,
  html,
  from = FROM,
  event,
  userId = null,
  triggeredBy = 'api_route',
}) {
  const toDomain = to?.split('@')[1] ?? 'unknown'
  try {
    const result = await getResend().emails.send({ from, to, subject, react, html })
    if (result.error) {
      logger.error('email', `${event} | failed`, {
        userId,
        metadata: {
          event,
          status: 'failed',
          to_domain: toDomain,
          error: result.error.message ?? JSON.stringify(result.error),
          triggered_by: triggeredBy,
        },
      })
      return result
    }
    logger.info('email', `${event} | sent`, {
      userId,
      metadata: {
        event,
        status: 'sent',
        resend_id: result.data?.id ?? null,
        to_domain: toDomain,
        triggered_by: triggeredBy,
      },
    })
    return result
  } catch (err) {
    logger.error('email', `${event} | failed`, {
      userId,
      metadata: {
        event,
        status: 'failed',
        to_domain: toDomain,
        error: err.message,
        triggered_by: triggeredBy,
      },
    })
    throw err
  }
}
