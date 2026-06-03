import { NextResponse } from 'next/server'
import AnfitrionProximaSemana from '@/emails/anfitrion-proxima-semana'
import { sendEmail } from '@/lib/sendEmail'

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

    const { data, error } = await sendEmail({
      to: email,
      subject: `Prepara tu hogar, ${nombreViajero} llega en 7 días 🗓️`,
      react: AnfitrionProximaSemana({ nombre, nombreViajero, fechaLlegada, fechaSalida, personas, notas }),
      event: 'anfitrion-proxima-semana',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
