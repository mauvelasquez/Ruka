'use client'
import { useState, useEffect } from 'react'
import { REGIONES_RUKKA, getComunasByRegion } from '../lib/comunas'

export default function ChileLocationSelect({
  value = {},
  onChange,
  showDireccion = true,
  required = false,
  className = '',
}) {
  const [region, setRegion]   = useState(value.region   || '')
  const [comuna, setComuna]   = useState(value.comuna   || '')
  const [direccion, setDir]   = useState(value.direccion || '')
  const [comunas, setComunas] = useState([])

  useEffect(() => {
    if (value.region !== undefined)    setRegion(value.region)
    if (value.comuna !== undefined)    setComuna(value.comuna)
    if (value.direccion !== undefined) setDir(value.direccion)
  }, [value.region, value.comuna, value.direccion])

  useEffect(() => {
    const list = getComunasByRegion(region)
    setComunas(list)
    if (comuna && !list.includes(comuna)) {
      setComuna('')
      notify({ region, comuna: '', direccion })
    }
  }, [region])

  const notify = (patch) => onChange?.({ region, comuna, direccion, ...patch })

  const handleRegion = (e) => {
    const val = e.target.value
    setRegion(val)
    setComuna('')
    notify({ region: val, comuna: '' })
  }

  const handleComuna = (e) => {
    const val = e.target.value
    setComuna(val)
    notify({ comuna: val })
  }

  const handleDir = (e) => {
    const val = e.target.value
    setDir(val)
    notify({ direccion: val })
  }

  const selectClass =
    'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent bg-white text-gray-800 appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400'

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Región */}
      <div className="relative">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Región {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select value={region} onChange={handleRegion} required={required} className={selectClass}>
            <option value="">Selecciona una región</option>
            {REGIONES_RUKKA.map(r => (
              <option key={r.id} value={r.nombre}>{r.nombre}</option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      </div>

      {/* Comuna */}
      <div className="relative">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Comuna {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select value={comuna} onChange={handleComuna} disabled={!region} required={required} className={selectClass}>
            <option value="">{region ? 'Selecciona una comuna' : 'Primero elige una región'}</option>
            {comunas.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronIcon />
        </div>
      </div>

      {/* Dirección (opcional) */}
      {showDireccion && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Dirección (calle y número)
          </label>
          <input
            type="text"
            value={direccion}
            onChange={handleDir}
            placeholder="Ej: Los Boldos 123"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
          />
        </div>
      )}
    </div>
  )
}

function ChevronIcon() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}
