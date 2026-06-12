// Teléfono chileno: normalización y validación a formato E.164 (+569XXXXXXXX).
// Acepta '9 1234 5678', '912345678', '+56912345678' o '56912345678'.

export function normalizeChileanPhone(raw) {
  if (!raw) return null
  const digits = String(raw).replace(/\D/g, '')

  let local
  if (digits.length === 11 && digits.startsWith('56')) {
    local = digits.slice(2)
  } else if (digits.length === 9) {
    local = digits
  } else {
    return null
  }

  if (local.length !== 9 || !local.startsWith('9')) return null
  return `+56${local}`
}

export function isValidChileanPhone(phone) {
  return typeof phone === 'string' && /^\+569[0-9]{8}$/.test(phone)
}
