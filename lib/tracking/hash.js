// SHA-256 hash para Advanced Matching de Meta.
// Normalizar antes de hashear según especificación de Meta:
//   email: lowercase, sin espacios
//   phone: solo dígitos (sin + ni espacios)
//   birth_date: formato YYYYMMDD
//   nombre/apellido: lowercase, sin espacios, sin tildes
export async function hashData(value) {
  if (!value) return null
  const normalized = String(value).trim().toLowerCase()
  if (!normalized) return null
  const encoder = new TextEncoder()
  const data = encoder.encode(normalized)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
