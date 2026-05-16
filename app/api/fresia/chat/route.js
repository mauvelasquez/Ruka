import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '../../../../lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// Rate limit: 20 requests per IP per minute (resets on cold start — acceptable for serverless)
const ipCounts = new Map()

function isRateLimited(ip) {
  const now    = Date.now()
  const WINDOW = 60_000
  const MAX    = 20
  const entry  = ipCounts.get(ip) ?? { count: 0, resetAt: now + WINDOW }
  if (now > entry.resetAt) { entry.count = 1; entry.resetAt = now + WINDOW }
  else entry.count += 1
  ipCounts.set(ip, entry)
  return entry.count > MAX
}

const FRESIA_TOOLS = [
  {
    name: 'create_hogar',
    description: 'Crea un nuevo hogar en la plataforma Rukka. Úsalo solo cuando tengas información suficiente y el usuario haya confirmado los datos.',
    input_schema: {
      type: 'object',
      properties: {
        title:       { type: 'string',  description: 'Título del hogar (ej: "Casa en Providencia")' },
        description: { type: 'string',  description: 'Descripción del hogar' },
        tipo:        { type: 'string',  enum: ['Casa','Departamento','Habitación','Cabaña','Bungalow','Villa','Loft','Estudio'], description: 'Tipo de propiedad' },
        region:      { type: 'string',  description: 'Región de Chile (ej: Región Metropolitana)' },
        comuna:      { type: 'string',  description: 'Ciudad o comuna' },
        direccion:   { type: 'string',  description: 'Dirección específica (opcional)' },
        bedrooms:    { type: 'number',  description: 'Número de dormitorios' },
        bathrooms:   { type: 'number',  description: 'Número de baños' },
        max_guests:  { type: 'number',  description: 'Máximo de huéspedes' },
        amenities:   { type: 'array',   items: { type: 'string' }, description: 'Comodidades (wifi, parking, ac, heating, tv, kitchen, washer, pets)' },
      },
      required: ['title', 'tipo', 'region', 'comuna', 'bedrooms', 'max_guests'],
    },
  },
  {
    name: 'buscar_hogares',
    description: 'Busca hogares disponibles en Rukka según los criterios del usuario',
    input_schema: {
      type: 'object',
      properties: {
        ciudad:         { type: 'string', description: 'Ciudad o comuna a buscar' },
        region:         { type: 'string', description: 'Región de Chile' },
        tipo:           { type: 'string', description: 'Tipo de hogar (Casa, Departamento, etc.)' },
        max_guests_min: { type: 'number', description: 'Mínimo de huéspedes requerido' },
        bedrooms_min:   { type: 'number', description: 'Mínimo de dormitorios' },
      },
    },
  },
  {
    name: 'get_user_hogares',
    description: 'Obtiene los hogares publicados por el usuario actual en Rukka',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
]

function buildSystemPrompt(ctx) {
  return `Eres Fresia, la asistente de IA de Rukka, powered by Claude de Anthropic.

Rukka es una plataforma chilena de intercambio de hogares — conecta viajeros que intercambian sus casas para vivir como locales. Completamente gratis, sin comisiones. Tu misión es ayudar a los usuarios de forma cálida y eficiente, en español chileno.

## CAPACIDADES

### Crear hogares
- Con imágenes: analiza la foto, extrae tipo/dormitorios/características. Confirma con el usuario antes de guardar.
- Sin imágenes: haz preguntas naturales de a una — ciudad, tipo, dormitorios, baños, descripción. Luego llama a \`create_hogar\`.

### Buscar hogares
- Llama a \`buscar_hogares\` con los criterios del usuario.
- Muestra los resultados como tarjetas en este formato exacto:
  **📍 [Título]**
  🏠 [Tipo] | 🛏️ [N] dorm. | 👥 [N] huésp. | 📍 [Ciudad]
  _[Descripción breve]_

### Ver mis hogares
- Llama a \`get_user_hogares\` cuando el usuario quiera ver sus publicaciones.

### Información general
- Explica el funcionamiento de Rukka (intercambio de hogares, 100% gratis).
- Guía al usuario en procesos de registro, publicación, matches.

## PERSONALIDAD
- Nombre: Fresia (evoca lo chileno, lo natural, lo acogedor)
- Tono: cercano y cálido, como una amiga experta
- Español chileno natural — sin exagerar chilenismos
- Emojis con moderación
- Sin lenguaje corporativo frío ni listas de bullets innecesarias
- Si el usuario sube una imagen, siempre confirma haberla recibido antes de describirla

## RESTRICCIONES
- No inventes datos de hogares que no estén en el contexto
- Confirma siempre antes de ejecutar \`create_hogar\`
- Si el usuario no está autenticado y quiere publicar, pídele que inicie sesión

## CONTEXTO ACTUAL
\`\`\`json
${JSON.stringify(ctx, null, 2)}
\`\`\``
}

async function buildContext(supabase, userId) {
  const ctx = {
    usuario: null,
    hogares_disponibles: [],
    stats: { total_hogares: 0, ciudades: [] },
  }

  try {
    const { data: homes } = await supabase
      .from('homes')
      .select('id,title,type,subtype,city,region,comuna,bedrooms,bathrooms,max_guests,amenities,description')
      .limit(60)

    if (homes) {
      ctx.hogares_disponibles = homes.map(h => ({
        id: h.id,
        titulo: h.title,
        tipo: h.type || h.subtype,
        ciudad: h.city || h.comuna,
        region: h.region,
        dormitorios: h.bedrooms,
        banos: h.bathrooms,
        max_huespedes: h.max_guests,
        comodidades: h.amenities,
        descripcion: (h.description || '').slice(0, 150),
      }))
      ctx.stats.total_hogares = homes.length
      ctx.stats.ciudades = [...new Set(homes.map(h => h.city || h.comuna).filter(Boolean))]
    }

    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id,name')
        .eq('id', userId)
        .maybeSingle()

      if (profile) {
        const { data: userHomes } = await supabase
          .from('homes')
          .select('id,title,type,city,bedrooms')
          .eq('user_id', userId)

        ctx.usuario = {
          id: profile.id,
          nombre: profile.name,
          hogares_publicados: userHomes?.length || 0,
          mis_hogares: (userHomes || []).map(h => ({
            id: h.id, titulo: h.title, tipo: h.type, ciudad: h.city, dormitorios: h.bedrooms,
          })),
        }
      }
    }
  } catch (err) {
    console.error('[fresia/context]', err.message)
  }

  return ctx
}

function normalizeText(str) {
  if (!str) return ''
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '').trim()
}

async function executeTool(name, input, ctx, supabase, userId) {
  if (name === 'buscar_hogares') {
    let results = ctx.hogares_disponibles
    if (input.ciudad)  results = results.filter(h => normalizeText(h.ciudad || h.region || '').includes(normalizeText(input.ciudad)))
    if (input.region)  results = results.filter(h => normalizeText(h.region || '').includes(normalizeText(input.region)))
    if (input.tipo)    results = results.filter(h => (h.tipo    || '').toLowerCase().includes(input.tipo.toLowerCase()))
    if (input.max_guests_min) results = results.filter(h => (h.max_huespedes || 0) >= input.max_guests_min)
    if (input.bedrooms_min)   results = results.filter(h => (h.dormitorios   || 0) >= input.bedrooms_min)
    return { encontrados: results.length, hogares: results.slice(0, 8) }
  }

  if (name === 'get_user_hogares') {
    if (!userId || !ctx.usuario) return { error: 'Usuario no autenticado' }
    return { hogares: ctx.usuario.mis_hogares || [], total: ctx.usuario.hogares_publicados || 0 }
  }

  if (name === 'create_hogar') {
    if (!userId) return { error: 'Debes iniciar sesión para publicar un hogar' }
    try {
      const { data: newHome, error } = await supabase.from('homes').insert({
        user_id:           userId,
        title:             input.title,
        description:       input.description || '',
        short_description: (input.description || '').slice(0, 120),
        type:              input.tipo,
        subtype:           input.tipo,
        category:          'full_home',
        region:            input.region  || null,
        comuna:            input.comuna  || null,
        direccion:         input.direccion || null,
        city:              input.comuna  || null,
        country:           'Chile',
        location:          `${input.comuna || ''}, ${input.region || ''}`,
        bedrooms:          input.bedrooms  || 1,
        bathrooms:         input.bathrooms || 1,
        max_guests:        input.max_guests || 2,
        amenities:         input.amenities || [],
        images:            [`https://picsum.photos/seed/${Date.now()}/800/500`],
        availability_periods: [],
        featured:          false,
      }).select().single()

      if (error) return { success: false, error: error.message }
      return { success: true, hogar_id: newHome.id, titulo: newHome.title }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return { error: `Tool desconocido: ${name}` }
}

export async function POST(req) {
  const encoder = new TextEncoder()

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Demasiadas solicitudes. Espera un momento.' }), {
      status: 429, headers: { 'Content-Type': 'application/json' },
    })
  }

  let body
  try { body = await req.json() }
  catch { return new Response('Bad request', { status: 400 }) }

  const { messages = [] } = body
  if (!messages.length) return new Response('No messages', { status: 400 })
  if (messages.length > 50) return new Response('Too many messages', { status: 400 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return new Response('API key not configured', { status: 503 })

  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  const userId = authUser?.id || null

  const client = new Anthropic({ apiKey })
  const ctx = await buildContext(supabase, userId)
  const system = buildSystemPrompt(ctx)

  const readable = new ReadableStream({
    async start(controller) {
      const send = (data) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch { /* client disconnected */ }
      }

      try {
        let currentMessages = messages
        let turns = 0
        const maxTurns = 5

        while (turns++ < maxTurns) {
          const claudeStream = client.messages.stream({
            model:      'claude-sonnet-4-6',
            max_tokens: 2048,
            system,
            tools:      FRESIA_TOOLS,
            messages:   currentMessages,
          })

          for await (const event of claudeStream) {
            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              send({ type: 'text', text: event.delta.text })
            }
          }

          const final = await claudeStream.finalMessage()
          if (final.stop_reason !== 'tool_use') break

          // Execute tool calls
          const toolUseBlocks = final.content.filter(b => b.type === 'tool_use')
          const toolResults = []

          for (const tu of toolUseBlocks) {
            send({ type: 'tool_start', name: tu.name })
            const result = await executeTool(tu.name, tu.input, ctx, supabase, userId)
            send({ type: 'tool_result', name: tu.name, result })
            toolResults.push({ type: 'tool_result', tool_use_id: tu.id, content: JSON.stringify(result) })
          }

          currentMessages = [
            ...currentMessages,
            { role: 'assistant', content: final.content },
            { role: 'user',      content: toolResults },
          ]
        }

        send({ type: 'done' })
      } catch (err) {
        console.error('[fresia/chat]', err.message)
        send({ type: 'error', message: 'Ocurrió un error. Por favor intenta de nuevo.' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    },
  })
}
