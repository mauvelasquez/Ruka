import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import VerificacionIdentidad from '@/emails/verificacion-identidad'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, accionBloqueada } = body

    if (!nombre || !email || !accionBloqueada) {
      return NextResponse.json({ error: 'nombre, email y accionBloqueada son requeridos' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'Rukka <hola@rukka.cl>',
      to: email,
      subject: 'Verifica tu identidad para continuar en Rukka 🔒',
      react: VerificacionIdentidad({ nombre, accionBloqueada }),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
