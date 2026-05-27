import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import Bienvenida from '@/emails/bienvenida'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email } = body

    if (!nombre || !email) {
      return NextResponse.json({ error: 'nombre y email son requeridos' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'Rukka <hola@rukka.cl>',
      to: email,
      subject: `¡Bienvenido a Rukka, ${nombre}! 🏠`,
      react: Bienvenida({ nombre, email }),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
