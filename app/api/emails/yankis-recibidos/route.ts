import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import YankisRecibidos from '@/emails/yankis-recibidos'

const resend = new Resend(process.env.RESEND_API_KEY || "no-key")

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, yanquisRecibidos, yanquisTotal, motivo, nombreHuesped } = body

    if (!nombre || !email || yanquisRecibidos === undefined || yanquisTotal === undefined || !motivo) {
      return NextResponse.json({ error: 'nombre, email, yanquisRecibidos, yanquisTotal y motivo son requeridos' }, { status: 400 })
    }

    const label = yanquisRecibidos === 1 ? 'Yanki' : 'Yankis'

    const { data, error } = await resend.emails.send({
      from: 'Rukka <hola@rukka.cl>',
      to: email,
      subject: `Recibiste ${yanquisRecibidos} ${label} 🪙`,
      react: YankisRecibidos({ nombre, yanquisRecibidos, yanquisTotal, motivo, nombreHuesped }),
    })

    if (error) {
      console.error('[email/yankis-recibidos] Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[email/yankis-recibidos] sent, id:', data?.id)
    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('[email/yankis-recibidos]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
