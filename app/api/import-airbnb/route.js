// app/api/import-airbnb/route.js
// Next.js App Router API — usa Claude Vision para extraer datos de pantallazos Airbnb

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'        // edge no soporta formData bien
export const maxDuration = 60          // Vercel pro; en hobby usa 10

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
    const formData = await req.formData()

    // Recolectar todas las imágenes enviadas
    const imageContent = []
    let idx = 0
    while (formData.has(`image_${idx}`)) {
      const file   = formData.get(`image_${idx}`)
      const buffer = Buffer.from(await file.arrayBuffer())
      const base64 = buffer.toString('base64')

      // Determinar media_type
      let mediaType = file.type || 'image/jpeg'
      if (!['image/jpeg','image/png','image/gif','image/webp'].includes(mediaType)) {
        mediaType = 'image/jpeg'
      }

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
      model:      'claude-opus-4-5',
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
