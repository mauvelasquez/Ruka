import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import SolicitudAceptada from '@/emails/solicitud-aceptada'

const resend = new Resend(process.env.RESEND_API_KEY || "no-key")

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, nombreAnfitrion, destino, fechaInicio, fechaFin, yanquisDescontados } = body

    if (!nombre || !email || !nombreAnfitrion || !destino || !fechaInicio || !fechaFin || yanquisDescontados === undefined) {
      return NextResponse.json({ error: 'nombre, email, nombreAnfitrion, destino, fechaInicio, fechaFin y yanquisDescontados son requeridos' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'Rukka <hola@rukka.cl>',
      to: email,
      subject: `¡${nombreAnfitrion} aceptó tu solicitud! 🎉`,
      react: SolicitudAceptada({ nombre, nombreAnfitrion, destino, fechaInicio, fechaFin, yanquisDescontados }),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
