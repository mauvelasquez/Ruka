import { NextResponse } from 'next/server'
import crypto from 'crypto'

const hash = (val) =>
  val ? crypto.createHash('sha256').update(val.toLowerCase().trim()).digest('hex') : undefined

export async function POST(req) {
  try {
    const body = await req.json()
    const { event_name, event_id, email, phone, url, user_agent, ip, value, currency } = body

    const payload = {
      ...(process.env.META_TEST_CODE && { test_event_code: process.env.META_TEST_CODE }),
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event_id || crypto.randomUUID(),
        event_source_url: url,
        action_source: 'website',
        user_data: {
          em: hash(email),
          ph: hash(phone),
          client_ip_address: ip,
          client_user_agent: user_agent,
        },
        custom_data: value ? { value, currency: currency || 'CLP' } : undefined,
      }],
    }

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_CAPI_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
