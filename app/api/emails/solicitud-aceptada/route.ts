import { NextResponse } from 'next/server'
import SolicitudAceptada from '@/emails/solicitud-aceptada'
import { sendEmail } from '@/lib/sendEmail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, nombreAnfitrion, destino, fechaInicio, fechaFin, yanquisDescontados } = body

    if (!nombre || !email || !nombreAnfitrion || !destino || !fechaInicio || !fechaFin || yanquisDescontados === undefined) {
      return NextResponse.json({ error: 'nombre, email, nombreAnfitrion, destino, fechaInicio, fechaFin y yanquisDescontados son requeridos' }, { status: 400 })
    }

    const { data, error } = await sendEmail({
      to: email,
      subject: `¡${nombreAnfitrion} aceptó tu solicitud! 🎉`,
      react: SolicitudAceptada({ nombre, nombreAnfitrion, destino, fechaInicio, fechaFin, yanquisDescontados }),
      event: 'solicitud-aceptada',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
