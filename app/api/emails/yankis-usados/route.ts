import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import YankisUsados from '@/emails/yankis-usados'

const resend = new Resend(process.env.RESEND_API_KEY || "no-key")

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, yanquisUsados, yanquisRestantes, destino, fechaInicio, fechaFin } = body

    if (!nombre || !email || yanquisUsados === undefined || yanquisRestantes === undefined || !destino || !fechaInicio || !fechaFin) {
      return NextResponse.json({ error: 'nombre, email, yanquisUsados, yanquisRestantes, destino, fechaInicio y fechaFin son requeridos' }, { status: 400 })
    }

    const label = yanquisUsados === 1 ? 'Yanki' : 'Yankis'

    const { data, error } = await resend.emails.send({
      from: 'Rukka <hola@rukka.cl>',
      to: email,
      subject: `Usaste ${yanquisUsados} ${label} en ${destino} 🏠`,
      react: YankisUsados({ nombre, yanquisUsados, yanquisRestantes, destino, fechaInicio, fechaFin }),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
