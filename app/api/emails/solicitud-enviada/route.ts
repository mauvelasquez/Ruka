import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import SolicitudEnviada from '@/emails/solicitud-enviada'

const resend = new Resend(process.env.RESEND_API_KEY || "no-key")

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, destino, fechaInicio, fechaFin, nombreAnfitrion, imagenHogar } = body

    if (!nombre || !email || !destino || !fechaInicio || !fechaFin || !nombreAnfitrion) {
      return NextResponse.json({ error: 'nombre, email, destino, fechaInicio, fechaFin y nombreAnfitrion son requeridos' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'Rukka <hola@rukka.cl>',
      to: email,
      subject: `Solicitud enviada a ${nombreAnfitrion} ✈️`,
      react: SolicitudEnviada({ nombre, destino, fechaInicio, fechaFin, nombreAnfitrion, imagenHogar }),
    })

    if (error) {
      console.error('[email/solicitud-enviada] Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[email/solicitud-enviada] sent, id:', data?.id)
    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('[email/solicitud-enviada]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
