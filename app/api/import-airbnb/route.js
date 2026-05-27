// app/api/import-airbnb/route.js
// Next.js App Router API — usa Claude Vision para extraer datos de pantallazos Airbnb

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '../../../lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_IMAGE_BYTES = 2 * 1024 * 1024  // 2 MB server-side guard

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY no está configurada en las variables de entorno del servidor.')
  return new Anthropic({ apiKey })
}

const SYSTEM_PROMPT = `Eres un extractor de datos de propiedades para la plataforma de intercambio de hogares Rukka.cl.
El usuario te enviará uno o más pantallazos de un anuncio de Airbnb.
Tu tarea es extraer TODA la información disponible y devolver ÚNICAMENTE un JSON válido con esta estructura exacta (sin markdown, sin comillas extras, solo el JSON):

{
  "title": "string",
  "description": "string",
  "location": "string (dirección o zona)",
  "city": "string",
  "region": "string (ej: Región Metropolitana)",
  "country": "Chile",
  "type": "string (Casa|Departamento|Cabaña|Estudio|Loft|Villa|Habitación)",
  "subtype": "string|null",
  "bedrooms": number,
  "bathrooms": number,
  "maxGuests": number,
  "size": number|null,
  "amenities": ["string"],
  "rating": number,
  "reviewCount": number,
  "nearbyAttractions": ["string"],
  "images": [],
  "source": "airbnb"
}

Reglas:
- Si no encuentras un valor, usa null o 0 según corresponda.
- amenities: extrae solo las claves conocidas si corresponden: wifi, parking, ac, heating, tv, coffee, kitchen, washer, pets, baby. Si hay otras, agrégalas como string.
- type: infiere el tipo más cercano de la lista.
- rating: como número decimal (ej: 4.85).
- reviewCount: como entero.
- size: en m², si aparece. Null si no.
- NO inventes datos que no estén visibles en las imágenes.
- Devuelve SOLO el JSON, sin texto adicional.`

export async function POST(req) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    let client
    try {
      client = getClient()
    } catch (authErr) {
      console.error('[import-airbnb] auth:', authErr.message)
      return NextResponse.json({ error: authErr.message }, { status: 503 })
    }

    const formData = await req.formData()

    // Recolectar todas las imágenes enviadas
    const imageContent = []
    let idx = 0
    while (formData.has(`image_${idx}`)) {
      const file   = formData.get(`image_${idx}`)
      const buffer = Buffer.from(await file.arrayBuffer())

      // Guard server-side: reject images above 2 MB
      if (buffer.byteLength > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: `La imagen ${file.name || idx} supera el límite de 2 MB.` },
          { status: 413 }
        )
      }

      // SECURITY FIX #8: validar MIME type por magic bytes reales, no por el campo client-provided
      const MAGIC = {
        jpeg: [0xFF, 0xD8, 0xFF],
        png:  [0x89, 0x50, 0x4E, 0x47],
        gif:  [0x47, 0x49, 0x46],
        webp: [0x52, 0x49, 0x46, 0x46],
      }
      const header = [...buffer.slice(0, 4)]
      let mediaType
      if (MAGIC.png.every((b, i)  => header[i] === b)) mediaType = 'image/png'
      else if (MAGIC.jpeg.every((b, i) => header[i] === b)) mediaType = 'image/jpeg'
      else if (MAGIC.gif.every((b, i)  => header[i] === b)) mediaType = 'image/gif'
      else if (MAGIC.webp.every((b, i) => header[i] === b)) mediaType = 'image/webp'
      else {
        return NextResponse.json(
          { error: `La imagen ${file.name || idx} no es un formato soportado (JPEG, PNG, GIF, WebP).` },
          { status: 415 }
        )
      }
      const base64 = buffer.toString('base64')

      imageContent.push({
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data: base64 },
      })
      idx++
    }

    if (!imageContent.length) {
      return NextResponse.json({ error: 'No se enviaron imágenes' }, { status: 400 })
    }

    // Añadir instrucción de texto al final del array de contenido
    imageContent.push({
      type: 'text',
      text: 'Extrae todos los datos visibles de este/estos pantallazo(s) de Airbnb y devuelve el JSON según las instrucciones.',
    })

    const message = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages: [{ role: 'user', content: imageContent }],
    })

    const raw = message.content[0]?.text || ''

    // Limpiar posibles ```json ... ``` que el modelo pudiera agregar
    const clean = raw.replace(/```json|```/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(clean)
    } catch {
      // Si no es JSON válido, devolver el texto crudo con error descriptivo
      return NextResponse.json(
        { error: 'No se pudo parsear la respuesta de la IA', raw },
        { status: 422 }
      )
    }

    return NextResponse.json(parsed, { status: 200 })

  } catch (err) {
    console.error('[import-airbnb]', err)
    return NextResponse.json(
      { error: err.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
