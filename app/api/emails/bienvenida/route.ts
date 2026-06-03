import { NextResponse } from 'next/server'
import Bienvenida from '@/emails/bienvenida'
import { sendEmail } from '@/lib/sendEmail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email } = body

    if (!nombre || !email) {
      return NextResponse.json({ error: 'nombre y email son requeridos' }, { status: 400 })
    }

    const { data, error } = await sendEmail({
      to: email,
      subject: `¡Bienvenido a Rukka, ${nombre}! 🏠`,
      react: Bienvenida({ nombre, email }),
      event: 'bienvenida',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
