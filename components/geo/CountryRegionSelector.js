'use client'
import { useState, useEffect } from 'react'
import { COUNTRIES, getRegions, getCities } from '@/lib/geo/latam'

const REGION_LABEL = { MX: 'Estado', AR: 'Provincia' }

export default function CountryRegionSelector({ value = {}, onChange }) {
  const [country, setCountry] = useState(value.country_code || 'CL')
  const [region,  setRegion]  = useState(value.region_code  || '')
  const [city,    setCity]    = useState(value.city          || '')

  const regions = getRegions(country)
  const cities  = getCities(country, region)

  useEffect(() => { setRegion(''); setCity('') }, [country])
  useEffect(() => { setCity('') }, [region])

  const emit = (c, r, ci) => onChange?.({ country_code: c, region_code: r, city: ci })

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
        <select
          value={country}
          onChange={e => { setCountry(e.target.value); emit(e.target.value, '', '') }}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {REGION_LABEL[country] ?? 'Región'}
        </label>
        <select
          value={region}
          onChange={e => { setRegion(e.target.value); emit(country, e.target.value, '') }}
          disabled={!country}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-50"
        >
          <option value="">Selecciona...</option>
          {regions.map(r => (
            <option key={r.code} value={r.code}>{r.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
        <select
          value={city}
          onChange={e => { setCity(e.target.value); emit(country, region, e.target.value) }}
          disabled={!region}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest disabled:opacity-50"
        >
          <option value="">Selecciona...</option>
          {cities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
