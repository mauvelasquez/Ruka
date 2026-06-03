import { NextResponse } from 'next/server'
import ReservaProximaSemana from '@/emails/reserva-proxima-semana'
import { sendEmail } from '@/lib/sendEmail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, destino, fechaInicio, fechaFin, nombreAnfitrion } = body

    if (!nombre || !email || !destino || !fechaInicio || !fechaFin || !nombreAnfitrion) {
      return NextResponse.json({ error: 'nombre, email, destino, fechaInicio, fechaFin y nombreAnfitrion son requeridos' }, { status: 400 })
    }

    const { data, error } = await sendEmail({
      to: email,
      subject: `Tu intercambio en ${destino} comienza en 7 días 🗓️`,
      react: ReservaProximaSemana({ nombre, destino, fechaInicio, fechaFin, nombreAnfitrion }),
      event: 'reserva-proxima-semana',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
