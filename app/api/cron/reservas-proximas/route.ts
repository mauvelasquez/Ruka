import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { Resend } from 'resend'
import ReservaProximaSemana from '@/emails/reserva-proxima-semana'
import AnfitrionProximaSemana from '@/emails/anfitrion-proxima-semana'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = await createClient()

  const hoy = new Date()
  const en7Dias = new Date(hoy)
  en7Dias.setDate(en7Dias.getDate() + 7)
  const fechaObjetivo = en7Dias.toISOString().split('T')[0]

  const { data: reservas, error } = await supabase
    .from('exchanges')
    .select(`
      id,
      fecha_inicio,
      fecha_fin,
      destino,
      personas,
      guest:profiles!guest_id (id, nombre, email),
      host:profiles!host_id (nombre, email)
    `)
    .eq('status', 'accepted')
    .eq('fecha_inicio', fechaObjetivo)

  if (error) {
    console.error('Error consultando reservas:', error)
    return NextResponse.json({ error: 'Error consultando base de datos' }, { status: 500 })
  }

  if (!reservas || reservas.length === 0) {
    return NextResponse.json({ success: true, enviados: 0, mensaje: 'No hay reservas en 7 días' })
  }

  const resultados = await Promise.allSettled(
    reservas.map(async (reserva: any) => {
      const guest = reserva.guest
      const host = reserva.host

      const fechaInicio = new Date(reserva.fecha_inicio).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
      const fechaFin = new Date(reserva.fecha_fin).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })

      const enviados: string[] = []

      if (guest?.email && guest?.nombre) {
        const { data, error: errGuest } = await resend.emails.send({
          from: 'Rukka <hola@rukka.cl>',
          to: guest.email,
          subject: `Tu intercambio en ${reserva.destino} comienza en 7 días 🗓️`,
          react: ReservaProximaSemana({
            nombre: guest.nombre,
            destino: reserva.destino,
            fechaInicio,
            fechaFin,
            nombreAnfitrion: host?.nombre || 'tu anfitrión',
          }),
        })
        if (errGuest) throw new Error(`Error enviando a viajero ${guest.email}: ${errGuest.message}`)
        if (data?.id) enviados.push(data.id)
      }

      if (host?.email && host?.nombre) {
        const { data, error: errHost } = await resend.emails.send({
          from: 'Rukka <hola@rukka.cl>',
          to: host.email,
          subject: `Prepara tu hogar, ${guest?.nombre || 'tu viajero'} llega en 7 días 🗓️`,
          react: AnfitrionProximaSemana({
            nombre: host.nombre,
            nombreViajero: guest?.nombre || 'tu viajero',
            fechaLlegada: fechaInicio,
            fechaSalida: fechaFin,
            personas: reserva.personas ?? 1,
          }),
        })
        if (errHost) throw new Error(`Error enviando a anfitrión ${host.email}: ${errHost.message}`)
        if (data?.id) enviados.push(data.id)
      }

      return enviados
    })
  )

  const exitosos = resultados.filter(r => r.status === 'fulfilled' && (r.value as string[]).length > 0).length
  const fallidos = resultados.filter(r => r.status === 'rejected').length

  return NextResponse.json({
    success: true,
    enviados: exitosos,
    fallidos,
    total: reservas.length,
  })
}
