import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '../../../../lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 30

// Rate limit: 5 requests per user per hour
const userCounts = new Map()

function isRateLimited(userId) {
  const now    = Date.now()
  const WINDOW = 60 * 60 * 1000 // 1 hour
  const MAX    = 5
  const entry  = userCounts.get(userId) ?? { count: 0, resetAt: now + WINDOW }
  if (now > entry.resetAt) { entry.count = 1; entry.resetAt = now + WINDOW }
  else entry.count += 1
  userCounts.set(userId, entry)
  return entry.count > MAX
}

function parseBirthDate(dateStr) {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const [day, month, year] = parts
  if (!day || !month || !year || year.length !== 4) return null
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

// Chilean RUT digit verifier
function validateRUT(rut) {
  if (!rut || typeof rut !== 'string') return false
  const clean = rut.replace(/[.\-\s]/g, '').toUpperCase()
  if (clean.length < 2) return false
  const body = clean.slice(0, -1)
  const dv   = clean.slice(-1)
  if (!/^\d+$/.test(body)) return false
  let sum = 0
  let factor = 2
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * factor
    factor = factor === 7 ? 2 : factor + 1
  }
  const remainder = 11 - (sum % 11)
  const expected  = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder)
  return dv === expected
}

const EXTRACT_PROMPT = `Eres un extractor de datos de carnets de identidad chilenos.
Analiza la imagen y extrae los siguientes campos en JSON.
Si un campo no es legible, usa null. No inventes datos.

Campos a extraer:
{
  "nombre_completo": "string",
  "rut": "string (formato XX.XXX.XXX-X)",
  "fecha_nacimiento": "string (DD/MM/YYYY)",
  "fecha_vencimiento": "string (DD/MM/YYYY)",
  "numero_documento": "string",
  "tiene_foto_visible": "boolean",
  "calidad_imagen": "buena | regular | mala",
  "es_carnet_chileno": "boolean"
}

Retorna SOLO el JSON, sin texto adicional.`

const anthropic = new Anthropic()

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ success: false, error: 'No autenticado' }, { status: 401 })
    }

    if (isRateLimited(user.id)) {
      return Response.json(
        { success: false, error: 'Demasiados intentos. Espera una hora antes de reintentar.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { image_base64, media_type = 'image/jpeg' } = body

    if (!image_base64) {
      return Response.json({ success: false, error: 'Imagen requerida' }, { status: 400 })
    }

    // Validate rough size (base64 of 1MB ≈ 1.37M chars)
    if (image_base64.length > 1_500_000) {
      return Response.json({ success: false, error: 'Imagen demasiado grande' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type, data: image_base64 } },
          { type: 'text', text: EXTRACT_PROMPT },
        ],
      }],
    })

    const raw = message.content[0]?.text?.trim()
    if (!raw) throw new Error('Claude no retornó respuesta')

    // Strip markdown code fences if present
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    let extracted
    try {
      extracted = JSON.parse(jsonStr)
    } catch {
      throw new Error('Respuesta no es JSON válido')
    }

    if (!extracted.es_carnet_chileno) {
      return Response.json({
        success: false,
        error: 'La imagen no parece ser un carnet de identidad chileno.',
      })
    }
    if (extracted.calidad_imagen === 'mala') {
      return Response.json({
        success: false,
        error: 'La imagen es de mala calidad. Intenta con mejor iluminación y sin reflejos.',
      })
    }

    const rutValid = validateRUT(extracted.rut)

    // Save OCR data to profile (non-critical — doesn't block the response)
    if (rutValid) {
      try {
        const admin = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )
        const profileUpdate = {}
        if (extracted.nombre_completo) {
          profileUpdate.full_name = extracted.nombre_completo
          profileUpdate.name = extracted.nombre_completo
        }
        if (extracted.rut) profileUpdate.rut = extracted.rut
        const birthDate = parseBirthDate(extracted.fecha_nacimiento)
        if (birthDate) profileUpdate.birth_date = birthDate
        if (Object.keys(profileUpdate).length > 0) {
          await admin.from('profiles').update(profileUpdate).eq('id', user.id)
        }
      } catch (saveErr) {
        console.error('[verify-id/extract] profile update failed:', saveErr.message)
      }
    }

    return Response.json({
      success: true,
      extracted_data: extracted,
      rut_valid: rutValid,
    })
  } catch (err) {
    console.error('[verify-id/extract]', err.message)
    return Response.json({ success: false, error: 'Error al procesar la imagen.' }, { status: 500 })
  }
}
