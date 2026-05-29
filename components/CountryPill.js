'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCountry } from '../hooks/useCountry'
import { COUNTRY_NAMES, COUNTRY_FLAGS } from '../lib/country-detection'

const SUPPORTED = ['CL', 'CO', 'AR', 'MX']

export default function CountryPill({ onCountryChange, className = '' }) {
  const { country, setCountry, isLoading } = useCountry()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = async (code) => {
    setOpen(false)
    await setCountry(code)
    onCountryChange?.(code)
  }

  const flag = COUNTRY_FLAGS[country] || '🌎'
  const name = COUNTRY_NAMES[country] || country

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(o => !o)}
        title={`Estás viendo Rukka ${name}`}
        aria-label={`País seleccionado: ${name}. Click para cambiar.`}
        aria-expanded={open}
        disabled={isLoading}
        className="flex items-center gap-1.5 bg-forest-50 border border-forest/20 rounded-full px-3 py-1.5 text-sm font-semibold text-forest hover:bg-forest/10 transition-colors"
      >
        <span>{flag}</span>
        <span className="hidden sm:inline">{name}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
          <p className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Cambiar país
          </p>
          {SUPPORTED.map(code => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                code === country
                  ? 'text-forest font-bold bg-forest-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{COUNTRY_FLAGS[code]}</span>
              {COUNTRY_NAMES[code]}
              {code === country && <span className="ml-auto text-forest text-xs">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
