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

const EXTRACT_PROMPT = `Eres un extractor de datos de documentos de identidad oficiales.
Analiza la imagen y determina si es un documento válido emitido por Chile, Argentina, Colombia o México.

Documentos aceptados:
- Chile: Cédula de Identidad (RUN/RUT), Pasaporte, Licencia de Conducir
- Colombia: Cédula de Ciudadanía, Pasaporte, Licencia de Conducción
- Argentina: DNI, Pasaporte, Licencia de Conducir
- México: INE/IFE (Credencial para votar), Pasaporte, Licencia de Conducir

Extrae los siguientes campos en JSON. Si un campo no es legible, usa null. No inventes datos.

{
  "nombre_completo": "string",
  "numero_identificacion": "string (número principal del documento, sin puntos ni guiones)",
  "rut": "string (SOLO si es documento chileno, formato XX.XXX.XXX-X; null en caso contrario)",
  "pais_emisor": "CL | AR | CO | MX | null (código ISO si lo puedes determinar, null si es de otro país)",
  "tipo_documento": "national_id | passport | drivers_license | null",
  "fecha_nacimiento": "string (DD/MM/YYYY)",
  "fecha_vencimiento": "string (DD/MM/YYYY)",
  "tiene_foto_visible": "boolean",
  "calidad_imagen": "buena | regular | mala",
  "es_documento_valido": "boolean (true si es un documento oficial de los países aceptados y es legible)"
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
        { success: false, error_code: 'RATE_LIMITED', error: 'Demasiados intentos. Espera una hora antes de reintentar.' },
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

    if (!extracted.es_documento_valido) {
      return Response.json({
        success: false,
        error_code: 'DOCUMENT_INVALID',
        error: 'No pudimos verificar tu documento. Asegúrate de que sea legible y esté completo.',
      })
    }
    const SUPPORTED_COUNTRIES = ['CL', 'AR', 'CO', 'MX']
    if (!extracted.pais_emisor || !SUPPORTED_COUNTRIES.includes(extracted.pais_emisor)) {
      return Response.json({
        success: false,
        error_code: 'DOCUMENT_UNSUPPORTED_COUNTRY',
        error: 'El documento debe ser de Chile, Argentina, Colombia o México.',
      })
    }
    if (extracted.calidad_imagen === 'mala') {
      return Response.json({
        success: false,
        error_code: 'DOCUMENT_INVALID',
        error: 'La imagen es de mala calidad. Intenta con mejor iluminación y sin reflejos.',
      })
    }

    const isChilean = extracted.pais_emisor === 'CL'
    const rutValid = isChilean ? validateRUT(extracted.rut) : null
    // For non-Chilean documents, accept any non-empty identification number
    const documentValid = isChilean
      ? rutValid === true
      : !!(extracted.numero_identificacion && extracted.numero_identificacion.length >= 3)

    const idNumber = isChilean && extracted.rut
      ? extracted.rut.replace(/[.\-\s]/g, '')
      : extracted.numero_identificacion ?? null

    // Save OCR data to profile and mark as verified
    if (documentValid) {
      try {
        const admin = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )

        // Block if this identification number is already registered by a different user
        if (idNumber) {
          const { data: idConflict } = await admin
            .from('profiles')
            .select('id')
            .eq('identification_number', idNumber)
            .neq('id', user.id)
            .maybeSingle()

          if (idConflict) {
            return Response.json({
              success: false,
              error_code: 'DOCUMENT_DUPLICATE',
              error: 'Este número de documento ya se encuentra inscrito en Rukka. Si crees que es un error, contáctanos.',
            })
          }
        }

        const ID_TYPE_MAP = {
          CL: { national_id: 'rut', passport: 'passport', drivers_license: 'drivers_license' },
          CO: { national_id: 'cedula', passport: 'passport', drivers_license: 'drivers_license' },
          AR: { national_id: 'dni', passport: 'passport', drivers_license: 'drivers_license' },
          MX: { national_id: 'ine', passport: 'passport', drivers_license: 'drivers_license' },
        }
        const identificationType =
          ID_TYPE_MAP[extracted.pais_emisor]?.[extracted.tipo_documento] ?? extracted.tipo_documento ?? null

        const profileUpdate = {
          verified:                  true,
          verification_status:       'id_verified',
          verification_completed_at: new Date().toISOString(),
          identification_country:    extracted.pais_emisor,
          identification_type:       identificationType,
        }
        if (extracted.nombre_completo) profileUpdate.id_full_name = extracted.nombre_completo
        if (idNumber) profileUpdate.identification_number = idNumber
        const birthDate = parseBirthDate(extracted.fecha_nacimiento)
        if (birthDate) profileUpdate.birth_date = birthDate
        const { error: updateErr } = await admin.from('profiles').update(profileUpdate).eq('id', user.id)
        if (updateErr) {
          console.error('[verify-id/extract] profile update failed:', updateErr.message, '| fields:', Object.keys(profileUpdate))
          return Response.json({ success: false, error: 'Error al guardar la verificación. Intenta nuevamente.' })
        }
      } catch (saveErr) {
        console.error('[verify-id/extract] profile update threw:', saveErr.message)
      }
    }

    return Response.json({
      success: true,
      extracted_data: {
        ...extracted,
        identification_number: idNumber,
      },
      rut_valid: rutValid,
      document_valid: documentValid,
    })
  } catch (err) {
    console.error('[verify-id/extract]', err.message)
    return Response.json({ success: false, error_code: 'OCR_ERROR', error: 'Error al procesar la imagen.' }, { status: 500 })
  }
}
