import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"
import { ALLOWED_DOCUMENTS } from "@/lib/identity/allowed-documents"
import { IDENTITY_VERIFICATION_PROMPT } from "@/lib/identity/prompts"

export const runtime = "nodejs"
export const maxDuration = 60

const MIN_CONFIDENCE = 0.7

export async function POST(request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "No autorizado" }, { status: 401 })

  let file
  try {
    const formData = await request.formData()
    file = formData.get("document_image")
  } catch {
    return Response.json({ error: "Formato de solicitud inválido" }, { status: 400 })
  }

  if (!file) return Response.json({ error: "Imagen requerida" }, { status: 400 })

  if (file.size > 2 * 1024 * 1024) {
    return Response.json({ error: "La imagen supera 2MB" }, { status: 400 })
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowedTypes.includes(file.type)) {
    return Response.json({ error: "Formato de imagen no soportado" }, { status: 400 })
  }

  // Convert to base64 — image is never persisted in any storage
  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")
  const mediaType = file.type

  let response
  try {
    const anthropic = new Anthropic()
    response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: IDENTITY_VERIFICATION_PROMPT }
        ]
      }]
    })
  } catch (err) {
    console.error("[verify-identity] anthropic error:", err.message)
    return Response.json({ error: "Error al procesar la imagen" }, { status: 500 })
  }

  let result
  try {
    const raw = response.content[0]?.text?.trim() ?? ""
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
    result = JSON.parse(jsonStr)
  } catch {
    return Response.json({ error: "Error procesando respuesta de verificación" }, { status: 500 })
  }

  // Insufficient confidence overrides any other positive result
  if (typeof result.confidence === "number" && result.confidence < MIN_CONFIDENCE) {
    result.verified = false
    result.rejection_reason = `Confianza insuficiente (${Math.round(result.confidence * 100)}%). Intenta con mejor iluminación o enfoque.`
  }

  // Validate supported country and permitted document type
  if (result.verified) {
    const countryDocs = ALLOWED_DOCUMENTS[result.document_country]
    if (!countryDocs) {
      result.verified = false
      result.rejection_reason = "El documento debe ser de Chile, Argentina, Colombia o México."
    } else {
      const validType = countryDocs.documents.some(d => d.type === result.document_type)
      if (!validType) {
        result.verified = false
        result.rejection_reason = `Tipo de documento no permitido para ${countryDocs.country}.`
      }
    }
  }

  // Persist only extracted metadata — never the image
  const updateData = {
    id_document_type:          result.document_type    ?? null,
    id_document_country:       result.document_country ?? null,
    id_document_number:        result.id_number        ?? null,
    id_full_name:              result.full_name         ?? null,
    id_rejection_reason:       result.rejection_reason  ?? null,
    verified:                  result.verified          ?? false,
    verification_status:       result.verified ? 'id_verified' : 'unverified',
    verification_completed_at: result.verified ? new Date().toISOString() : null,
  }

  const { error: dbError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id)

  if (dbError) {
    console.error("[verify-identity] db error:", dbError.message)
  }

  return Response.json({
    success: true,
    verified: result.verified ?? false,
    rejection_reason: result.rejection_reason ?? null,
    document_type: result.document_type ?? null,
    document_country: result.document_country ?? null,
    confidence: result.confidence ?? null,
    validation_details: result.validation_details ?? null,
  })
}
