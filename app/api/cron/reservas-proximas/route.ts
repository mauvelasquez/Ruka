import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import ReservaProximaSemana from '@/emails/reserva-proxima-semana'
import AnfitrionProximaSemana from '@/emails/anfitrion-proxima-semana'

export const runtime = 'nodejs'

const resend = new Resend(process.env.RESEND_API_KEY || 'no-key')

// Service role: la tabla exchange_requests tiene RLS; el cron no actúa como un usuario.
function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const supabase = serviceClient()

  const en7Dias = new Date()
  en7Dias.setDate(en7Dias.getDate() + 7)
  const fechaObjetivo = en7Dias.toISOString().split('T')[0]

  // Intercambios aceptados que comienzan exactamente en 7 días
  const { data: reservas, error } = await supabase
    .from('exchange_requests')
    .select('id, from_user_id, to_user_id, to_home_id, start_date, end_date, guests')
    .eq('status', 'accepted')
    .eq('start_date', fechaObjetivo)

  if (error) {
    console.error('[reservas-proximas] error consultando exchange_requests:', error.message)
    return NextResponse.json({ error: 'Error consultando base de datos' }, { status: 500 })
  }

  if (!reservas || reservas.length === 0) {
    return NextResponse.json({ success: true, enviados: 0, mensaje: 'No hay reservas en 7 días' })
  }

  // Batch fetch de perfiles (viajero + anfitrión) y hogares destino
  const userIds = [...new Set(reservas.flatMap(r => [r.from_user_id, r.to_user_id]).filter(Boolean))]
  const homeIds = [...new Set(reservas.map(r => r.to_home_id).filter(Boolean))]

  const [{ data: profiles }, { data: homes }] = await Promise.all([
    supabase.from('profiles').select('id, name, email').in('id', userIds),
    supabase.from('homes').select('id, city').in('id', homeIds),
  ])

  const profileById = new Map((profiles || []).map(p => [p.id, p]))
  const homeById = new Map((homes || []).map(h => [h.id, h]))

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : ''

  const resultados = await Promise.allSettled(
    reservas.map(async (reserva) => {
      const guest = profileById.get(reserva.from_user_id)
      const host = profileById.get(reserva.to_user_id)
      const destino = homeById.get(reserva.to_home_id)?.city || 'tu destino'

      const fechaInicio = fmt(reserva.start_date)
      const fechaFin = fmt(reserva.end_date)
      const enviados: string[] = []

      if (guest?.email && guest?.name) {
        const { data, error: errGuest } = await resend.emails.send({
          from: 'Rukka <hola@rukka.cl>',
          to: guest.email,
          subject: `Tu intercambio en ${destino} comienza en 7 días 🗓️`,
          react: ReservaProximaSemana({
            nombre: guest.name,
            destino,
            fechaInicio,
            fechaFin,
            nombreAnfitrion: host?.name || 'tu anfitrión',
          }),
        })
        if (errGuest) throw new Error(`Error enviando a viajero ${guest.email}: ${errGuest.message}`)
        if (data?.id) enviados.push(data.id)
      }

      if (host?.email && host?.name) {
        const { data, error: errHost } = await resend.emails.send({
          from: 'Rukka <hola@rukka.cl>',
          to: host.email,
          subject: `Prepara tu hogar, ${guest?.name || 'tu viajero'} llega en 7 días 🗓️`,
          react: AnfitrionProximaSemana({
            nombre: host.name,
            nombreViajero: guest?.name || 'tu viajero',
            fechaLlegada: fechaInicio,
            fechaSalida: fechaFin,
            personas: reserva.guests ?? 1,
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
