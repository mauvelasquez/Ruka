import { NextResponse } from 'next/server'
import YankisUsados from '@/emails/yankis-usados'
import { sendEmail } from '@/lib/sendEmail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, yanquisUsados, yanquisRestantes, destino, fechaInicio, fechaFin } = body

    if (!nombre || !email || yanquisUsados === undefined || yanquisRestantes === undefined || !destino || !fechaInicio || !fechaFin) {
      return NextResponse.json({ error: 'nombre, email, yanquisUsados, yanquisRestantes, destino, fechaInicio y fechaFin son requeridos' }, { status: 400 })
    }

    const label = yanquisUsados === 1 ? 'Yanki' : 'Yankis'

    const { data, error } = await sendEmail({
      to: email,
      subject: `Usaste ${yanquisUsados} ${label} en ${destino} 🏠`,
      react: YankisUsados({ nombre, yanquisUsados, yanquisRestantes, destino, fechaInicio, fechaFin }),
      event: 'yankis-usados',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
