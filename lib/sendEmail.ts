import { Resend } from 'resend'
import type React from 'react'
import logger from './logger.js'

const FROM = 'Rukka <hola@rukka.cl>'
let _resend: Resend | null = null

function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY || 'no-key')
  return _resend
}

interface SendEmailParams {
  to: string
  subject: string
  react?: React.ReactElement
  html?: string
  from?: string
  event: string
  userId?: string | null
  triggeredBy?: string
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
}: SendEmailParams) {
  const toDomain = to?.split('@')[1] ?? 'unknown'
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await getResend().emails.send({ from, to, subject, react, html } as any)
    if (result.error) {
      logger.error('email', `${event} | failed`, {
        userId,
        metadata: {
          event,
          status: 'failed',
          to_domain: toDomain,
          error: (result.error as any).message ?? JSON.stringify(result.error),
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
  } catch (err: unknown) {
    logger.error('email', `${event} | failed`, {
      userId,
      metadata: {
        event,
        status: 'failed',
        to_domain: toDomain,
        error: (err as Error).message,
        triggered_by: triggeredBy,
      },
    })
    throw err
  }
}
