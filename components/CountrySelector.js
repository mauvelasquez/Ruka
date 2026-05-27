'use client'
import { COUNTRIES } from '../lib/geo/latam'

export default function CountrySelector({ value, onChange, label = 'Exploro desde' }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      {COUNTRIES.map(c => (
        <button
          key={c.code}
          onClick={() => onChange(c.code)}
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            value === c.code
              ? 'bg-forest text-white border-forest'
              : 'bg-white text-gray-600 border-gray-200 hover:border-forest/50 hover:text-forest'
          }`}
        >
          {c.flag} {c.name}
        </button>
      ))}
    </div>
  )
}
