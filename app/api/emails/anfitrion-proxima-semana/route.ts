import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import AnfitrionProximaSemana from '@/emails/anfitrion-proxima-semana'

const resend = new Resend(process.env.RESEND_API_KEY || "no-key")

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, nombreViajero, fechaLlegada, fechaSalida, personas, notas } = body

    if (!nombre || !email || !nombreViajero || !fechaLlegada || !fechaSalida || !personas) {
      return NextResponse.json(
        { error: 'nombre, email, nombreViajero, fechaLlegada, fechaSalida y personas son requeridos' },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: 'Rukka <hola@rukka.cl>',
      to: email,
      subject: `Prepara tu hogar, ${nombreViajero} llega en 7 días 🗓️`,
      react: AnfitrionProximaSemana({ nombre, nombreViajero, fechaLlegada, fechaSalida, personas, notas }),
    })

    if (error) {
      console.error('[email/anfitrion-proxima-semana] Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[email/anfitrion-proxima-semana] sent, id:', data?.id)
    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('[email/anfitrion-proxima-semana]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
