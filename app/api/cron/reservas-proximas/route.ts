import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import ReservaProximaSemana from '@/emails/reserva-proxima-semana'
import AnfitrionProximaSemana from '@/emails/anfitrion-proxima-semana'
import RecomiendaAmigo from '@/emails/recomienda-amigo'
import { sendEmail } from '@/lib/sendEmail'

export const runtime = 'nodejs'

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

  const { data: reservas, error } = await supabase
    .from('exchange_requests')
    .select('id, from_user_id, to_user_id, to_home_id, start_date, end_date, guests')
    .eq('status', 'accepted')
    .eq('start_date', fechaObjetivo)

  if (error) {
    console.error('[reservas-proximas] error consultando exchange_requests:', error.message)
    return NextResponse.json({ error: 'Error consultando base de datos' }, { status: 500 })
  }

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : ''

  let proximosEnviados = 0
  let proximosFallidos = 0

  if (reservas && reservas.length > 0) {
    const userIds = [...new Set(reservas.flatMap(r => [r.from_user_id, r.to_user_id]).filter(Boolean))]
    const homeIds = [...new Set(reservas.map(r => r.to_home_id).filter(Boolean))]

    const [{ data: profiles }, { data: homes }] = await Promise.all([
      supabase.from('profiles').select('id, name, email').in('id', userIds),
      supabase.from('homes').select('id, city').in('id', homeIds),
    ])

    const profileById = new Map((profiles || []).map((p: any) => [p.id, p]))
    const homeById    = new Map((homes    || []).map((h: any) => [h.id, h]))

    const resultados = await Promise.allSettled(
      reservas.map(async (reserva) => {
        const guest   = profileById.get(reserva.from_user_id)
        const host    = profileById.get(reserva.to_user_id)
        const destino = homeById.get(reserva.to_home_id)?.city || 'tu destino'
        const fechaInicio = fmt(reserva.start_date)
        const fechaFin    = fmt(reserva.end_date)
        const enviados: string[] = []

        if (guest?.email && guest?.name) {
          const { data, error: errGuest } = await sendEmail({
            to: guest.email,
            subject: `Tu intercambio en ${destino} comienza en 7 días 🗓️`,
            react: ReservaProximaSemana({ nombre: guest.name, destino, fechaInicio, fechaFin, nombreAnfitrion: host?.name || 'tu anfitrión' }),
            event: 'reserva-proxima-semana',
            userId: reserva.from_user_id,
            triggeredBy: 'cron',
          })
          if (errGuest) throw new Error(`viajero ${guest.email}: ${errGuest.message}`)
          if (data?.id) enviados.push(data.id)
        }

        if (host?.email && host?.name) {
          const { data, error: errHost } = await sendEmail({
            to: host.email,
            subject: `Prepara tu hogar, ${guest?.name || 'tu viajero'} llega en 7 días 🗓️`,
            react: AnfitrionProximaSemana({ nombre: host.name, nombreViajero: guest?.name || 'tu viajero', fechaLlegada: fechaInicio, fechaSalida: fechaFin, personas: reserva.guests ?? 1 }),
            event: 'anfitrion-proxima-semana',
            userId: reserva.to_user_id,
            triggeredBy: 'cron',
          })
          if (errHost) throw new Error(`anfitrión ${host.email}: ${errHost.message}`)
          if (data?.id) enviados.push(data.id)
        }

        return enviados
      })
    )

    proximosEnviados = resultados.filter(r => r.status === 'fulfilled' && (r.value as string[]).length > 0).length
    proximosFallidos = resultados.filter(r => r.status === 'rejected').length
  }

  // ── Recomienda-amigo: intercambios que terminaron hace exactamente 7 días ──
  let referralsEnviados = 0
  let referralsFallidos = 0

  const hace7Dias = new Date()
  hace7Dias.setDate(hace7Dias.getDate() - 7)
  const fechaFinalizada = hace7Dias.toISOString().split('T')[0]

  const { data: finalizadas, error: errorFin } = await supabase
    .from('exchange_requests')
    .select('id, from_user_id, to_user_id')
    .eq('status', 'accepted')
    .eq('end_date', fechaFinalizada)

  if (errorFin) {
    console.error('[reservas-proximas] error consultando finalizadas:', errorFin.message)
  } else if (finalizadas && finalizadas.length > 0) {
    const makeCode = (userId: string) =>
      'RUKKA-' + userId.replace(/-/g, '').slice(0, 8).toUpperCase()

    const userIdsFin = [...new Set(finalizadas.flatMap((r: any) => [r.from_user_id, r.to_user_id]).filter(Boolean))]
    const { data: profilesFin } = await supabase
      .from('profiles').select('id, name, email').in('id', userIdsFin)

    const profileByIdFin = new Map((profilesFin || []).map((p: any) => [p.id, p]))

    const refResultados = await Promise.allSettled(
      finalizadas.flatMap((r: any) => {
        const guest = profileByIdFin.get(r.from_user_id)
        const host  = profileByIdFin.get(r.to_user_id)
        const sends: Promise<any>[] = []

        if (guest?.email && guest?.name) {
          sends.push(sendEmail({
            to: guest.email,
            subject: 'Invita a un amigo y gana Yankis 🤝',
            react: RecomiendaAmigo({ nombre: guest.name, codigoReferido: makeCode(r.from_user_id), yanquisPorReferido: 2 }),
            event: 'recomienda-amigo',
            userId: r.from_user_id,
            triggeredBy: 'cron',
          }))
        }
        if (host?.email && host?.name) {
          sends.push(sendEmail({
            to: host.email,
            subject: 'Invita a un amigo y gana Yankis 🤝',
            react: RecomiendaAmigo({ nombre: host.name, codigoReferido: makeCode(r.to_user_id), yanquisPorReferido: 2 }),
            event: 'recomienda-amigo',
            userId: r.to_user_id,
            triggeredBy: 'cron',
          }))
        }
        return sends
      })
    )

    referralsEnviados = refResultados.filter(r => r.status === 'fulfilled').length
    referralsFallidos = refResultados.filter(r => r.status === 'rejected').length
  }

  return NextResponse.json({
    success: true,
    proximos:  { enviados: proximosEnviados,  fallidos: proximosFallidos,  total: reservas?.length ?? 0 },
    referrals: { enviados: referralsEnviados, fallidos: referralsFallidos, total: finalizadas?.length ?? 0 },
  })
}
