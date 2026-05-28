import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import RecomiendaAmigo from '@/emails/recomienda-amigo'

const resend = new Resend(process.env.RESEND_API_KEY || "no-key")

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, codigoReferido, yanquisPorReferido } = body

    if (!nombre || !email || !codigoReferido || yanquisPorReferido === undefined) {
      return NextResponse.json({ error: 'nombre, email, codigoReferido y yanquisPorReferido son requeridos' }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: 'Rukka <hola@rukka.cl>',
      to: email,
      subject: 'Invita a un amigo y gana Yankis 🤝',
      react: RecomiendaAmigo({ nombre, codigoReferido, yanquisPorReferido }),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
