'use client'
// TODO: Piloto Chile-only. Al extender a MX/CO/AR, reemplazar por componente
// multi-país con selector de código de área. El formato E.164 en DB garantiza migración limpia.

// Recibe value con o sin +56 y devuelve siempre con +56 (E.164).
function stripPrefix(val) {
  if (!val) return ''
  return val.replace(/^\+56/, '')
}

export default function PhoneInputCL({ value = '', onChange, error, disabled }) {
  const local = stripPrefix(value)

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9)
    onChange(digits ? `+56${digits}` : '')
  }

  const handleKeyDown = (e) => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter']
    if (allowed.includes(e.key)) return
    if (!/^\d$/.test(e.key)) e.preventDefault()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 9)
    onChange(pasted ? `+56${pasted}` : '')
  }

  const isInvalid = local.length > 0 && (local.length !== 9 || !local.startsWith('9'))

  return (
    <div>
      <div className={`flex items-center border rounded-xl overflow-hidden transition-all focus-within:ring-2 ${
        error || isInvalid
          ? 'border-red-400 focus-within:ring-red-300'
          : 'border-gray-200 focus-within:ring-forest'
      }`}>
        <div className="flex items-center gap-1.5 px-3 py-3 bg-gray-50 border-r border-gray-200 flex-shrink-0 select-none">
          <span className="text-base leading-none">🇨🇱</span>
          <span className="text-sm font-bold text-gray-500">+56</span>
        </div>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="9 1234 5678"
          value={local}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled}
          maxLength={9}
          className="flex-1 px-3 py-3 text-base bg-white focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">Solo números de Chile</p>
      {(error || isInvalid) && (
        <p className="text-xs text-red-500 mt-1">
          {error || 'Ingresa un número móvil chileno válido (9 dígitos, comenzando con 9)'}
        </p>
      )}
    </div>
  )
}
