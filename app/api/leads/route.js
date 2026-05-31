import { createClient } from '../../../lib/supabase/server'

export async function POST(request) {
  try {
    const { email, source } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return Response.json({ error: 'Email inválido' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('leads')
      .insert({ email: email.trim().toLowerCase(), source: source || 'publicar_modal' })

    if (error) {
      if (error.code === '23505') {
        return Response.json({ success: true, duplicate: true })
      }
      console.error('leads insert error:', error.message)
      return Response.json({ error: 'Error al guardar' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('leads route error:', err)
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
