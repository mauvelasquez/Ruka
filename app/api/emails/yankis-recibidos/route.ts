import { NextResponse } from 'next/server'
import YankisRecibidos from '@/emails/yankis-recibidos'
import { sendEmail } from '@/lib/sendEmail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, yanquisRecibidos, yanquisTotal, motivo, nombreHuesped } = body

    if (!nombre || !email || yanquisRecibidos === undefined || yanquisTotal === undefined || !motivo) {
      return NextResponse.json({ error: 'nombre, email, yanquisRecibidos, yanquisTotal y motivo son requeridos' }, { status: 400 })
    }

    const label = yanquisRecibidos === 1 ? 'noche' : 'noches'

    const { data, error } = await sendEmail({
      to: email,
      subject: `Sumaste ${yanquisRecibidos} ${label} de alojamiento gratis 🎁`,
      react: YankisRecibidos({ nombre, yanquisRecibidos, yanquisTotal, motivo, nombreHuesped }),
      event: 'yankis-recibidos',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
