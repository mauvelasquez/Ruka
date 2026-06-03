'use client'
import { useEffect, useState } from 'react'

const COUNTRIES = [
  { code: 'CL', label: 'Chile',    flag: '🇨🇱' },
  { code: 'MX', label: 'México',   flag: '🇲🇽' },
  { code: 'CO', label: 'Colombia', flag: '🇨🇴' },
  { code: 'AR', label: 'Argentina',flag: '🇦🇷' },
]

const SUPPORTED_CODES = new Set(COUNTRIES.map(c => c.code))

// detectIP=true → hace fetch a ipapi.co al montar para preseleccionar el país
export default function CountryUserSelect({ value, onChange, error, disabled, detectIP = true }) {
  const [outsideLatam, setOutsideLatam] = useState(false)

  useEffect(() => {
    if (!detectIP || value) return  // ya tiene valor, no sobreescribir
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 3000)

    fetch('https://ipapi.co/json/', { signal: ctrl.signal })
      .then(r => r.json())
      .then(data => {
        const code = data?.country_code
        if (code && SUPPORTED_CODES.has(code)) {
          onChange(code)
        } else if (code) {
          setOutsideLatam(true)
        }
      })
      .catch(() => {})  // silencioso si falla o timeout
      .finally(() => clearTimeout(timer))

    return () => { ctrl.abort(); clearTimeout(timer) }
  }, [detectIP])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
        ¿Desde qué país te unes?
      </label>
      <div className={`relative border rounded-xl transition-all focus-within:ring-2 ${
        error
          ? 'border-red-400 focus-within:ring-red-300'
          : 'border-gray-200 focus-within:ring-forest'
      }`}>
        <select
          value={value || ''}
          onChange={e => onChange(e.target.value || '')}
          disabled={disabled}
          className="w-full bg-white px-4 py-3 text-base appearance-none focus:outline-none rounded-xl disabled:bg-gray-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <option value="">Selecciona un país</option>
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {outsideLatam && !value && (
        <p className="text-xs text-gray-400 mt-1.5">
          Rukka está disponible en Chile, México, Colombia y Argentina. Selecciona el país donde quieres intercambiar.
        </p>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
