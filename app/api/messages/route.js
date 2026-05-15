import { createClient } from '../../../lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const requestId = searchParams.get('request_id')
  if (!requestId) return Response.json({ error: 'request_id requerido' }, { status: 400 })

  try {
    const supabase = await createClient()
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) return Response.json({ error: 'No autenticado' }, { status: 401 })

    // Verificar que el usuario es participante del intercambio
    const { data: request } = await supabase
      .from('exchange_requests')
      .select('from_user_id, to_user_id')
      .eq('id', requestId)
      .maybeSingle()

    if (!request) return Response.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    if (request.from_user_id !== user.id && request.to_user_id !== user.id) {
      return Response.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return Response.json({ messages: messages || [] })
  } catch (err) {
    console.error('[api/messages GET]', err.message)
    return Response.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) return Response.json({ error: 'No autenticado' }, { status: 401 })

    const body = await req.json()
    const { request_id, content } = body

    if (!request_id || !content?.trim()) {
      return Response.json({ error: 'request_id y content son requeridos' }, { status: 400 })
    }
    if (content.length > 2000) {
      return Response.json({ error: 'El mensaje no puede superar los 2000 caracteres' }, { status: 400 })
    }

    // Verificar participación y que el intercambio esté aceptado
    const { data: request } = await supabase
      .from('exchange_requests')
      .select('from_user_id, to_user_id, status')
      .eq('id', request_id)
      .maybeSingle()

    if (!request) return Response.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    if (request.from_user_id !== user.id && request.to_user_id !== user.id) {
      return Response.json({ error: 'Acceso denegado' }, { status: 403 })
    }
    if (request.status !== 'accepted') {
      return Response.json({ error: 'Solo se puede mensajear en intercambios aceptados' }, { status: 400 })
    }

    const receiverId = request.from_user_id === user.id
      ? request.to_user_id
      : request.from_user_id

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        request_id,
        sender_id:   user.id,
        receiver_id: receiverId,
        content:     content.trim(),
      })
      .select()
      .single()

    if (error) throw error
    return Response.json({ message }, { status: 201 })
  } catch (err) {
    console.error('[api/messages POST]', err.message)
    return Response.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
