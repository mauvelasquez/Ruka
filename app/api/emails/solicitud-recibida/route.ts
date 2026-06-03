import { NextResponse } from 'next/server'
import SolicitudRecibida from '@/emails/solicitud-recibida'
import { sendEmail } from '@/lib/sendEmail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, nombreViajero, avatarViajero, fechaInicio, fechaFin, personas, mensajePersonal } = body

    if (!nombre || !email || !nombreViajero || !fechaInicio || !fechaFin || !personas) {
      return NextResponse.json({ error: 'nombre, email, nombreViajero, fechaInicio, fechaFin y personas son requeridos' }, { status: 400 })
    }

    const { data, error } = await sendEmail({
      to: email,
      subject: `${nombreViajero} quiere quedarse en tu hogar 🌎`,
      react: SolicitudRecibida({ nombre, nombreViajero, avatarViajero, fechaInicio, fechaFin, personas, mensajePersonal }),
      event: 'solicitud-recibida',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
