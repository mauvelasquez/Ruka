import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import VerificacionIdentidad from '@/emails/verificacion-identidad'

const resend = new Resend(process.env.RESEND_API_KEY || "no-key")

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
      console.error('[email/verificacion-identidad] Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[email/verificacion-identidad] sent, id:', data?.id)
    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('[email/verificacion-identidad]', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
