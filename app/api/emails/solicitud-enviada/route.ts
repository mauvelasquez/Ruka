import { NextResponse } from 'next/server'
import SolicitudEnviada from '@/emails/solicitud-enviada'
import { sendEmail } from '@/lib/sendEmail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, destino, fechaInicio, fechaFin, nombreAnfitrion, imagenHogar } = body

    if (!nombre || !email || !destino || !fechaInicio || !fechaFin || !nombreAnfitrion) {
      return NextResponse.json({ error: 'nombre, email, destino, fechaInicio, fechaFin y nombreAnfitrion son requeridos' }, { status: 400 })
    }

    const { data, error } = await sendEmail({
      to: email,
      subject: `Solicitud enviada a ${nombreAnfitrion} ✈️`,
      react: SolicitudEnviada({ nombre, destino, fechaInicio, fechaFin, nombreAnfitrion, imagenHogar }),
      event: 'solicitud-enviada',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
