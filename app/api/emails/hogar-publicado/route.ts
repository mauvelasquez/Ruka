import { NextResponse } from 'next/server'
import HogarPublicado from '@/emails/hogar-publicado'
import { sendEmail } from '@/lib/sendEmail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, email, nombreHogar, urlHogar, imagenHogar } = body

    if (!nombre || !email || !nombreHogar || !urlHogar) {
      return NextResponse.json(
        { error: 'nombre, email, nombreHogar y urlHogar son requeridos' },
        { status: 400 }
      )
    }

    const { data, error } = await sendEmail({
      to: email,
      subject: '¡Tu hogar ya está en Rukka! 🏠 Ahora compártelo',
      react: HogarPublicado({ nombre, nombreHogar, urlHogar, imagenHogar }),
      event: 'hogar-publicado',
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
