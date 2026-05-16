'use client'
import Link from 'next/link'

const GRADIENTS = {
  'Casa completa': 'linear-gradient(135deg, rgba(42,92,69,0.75) 0%, rgba(26,60,44,0.9) 100%)',
  'Cabaña':        'linear-gradient(135deg, rgba(42,92,69,0.7) 0%, rgba(10,50,25,0.9) 100%)',
  'Departamento':  'linear-gradient(135deg, rgba(100,116,139,0.7) 0%, rgba(51,65,85,0.9) 100%)',
}
const DEFAULT_GRADIENT = 'linear-gradient(135deg, rgba(196,98,45,0.7) 0%, rgba(26,46,30,0.9) 100%)'

function TypeIcon({ tipo }) {
  if (tipo === 'Casa completa') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="white" aria-hidden>
        <path d="M24 7L4 23h5v18h10V30h10v11h10V23h5L24 7zm0 5.5l15 12.5H9L24 12.5zM16 30h4v6h-4v-6zm12 0h4v6h-4v-6z" />
      </svg>
    )
  }
  if (tipo === 'Cabaña') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="white" aria-hidden>
        <path d="M24 5L2 22h6v21h13V32h6v11h13V22h6L24 5zm0 6l17 14H7L24 11zM18 32h4v7h-4v-7zm8 0h4v7h-4v-7z" />
        <circle cx="24" cy="15" r="3" fill="white" opacity="0.8" />
      </svg>
    )
  }
  // Departamento / default
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="10" y="6" width="28" height="38" rx="2" stroke="white" strokeWidth="2.5" />
      <rect x="15" y="11" width="7" height="5" rx="1" fill="white" opacity="0.85" />
      <rect x="26" y="11" width="7" height="5" rx="1" fill="white" opacity="0.85" />
      <rect x="15" y="20" width="7" height="5" rx="1" fill="white" opacity="0.85" />
      <rect x="26" y="20" width="7" height="5" rx="1" fill="white" opacity="0.85" />
      <rect x="15" y="29" width="7" height="5" rx="1" fill="white" opacity="0.85" />
      <rect x="26" y="29" width="7" height="5" rx="1" fill="white" opacity="0.85" />
      <rect x="20" y="36" width="8" height="8" rx="1" fill="white" opacity="0.85" />
    </svg>
  )
}

export default function FeaturedHomeCard({ home }) {
  const isFallback = String(home.id ?? '').startsWith('fallback-')
  const href = isFallback ? '/onboarding' : `/homes/${home.id}`

  const images = home.images
  const imgSrc = images && (Array.isArray(images) ? images[0] : images)

  const title        = home.titulo       || home.title       || 'Hogar en Rukka'
  const city         = home.ciudad       || home.city        || ''
  const region       = home.region       || ''
  const tipo         = home.tipo         || home.type        || ''
  const habitaciones = home.habitaciones || home.bedrooms    || 0
  const banos        = home.banos        || home.bathrooms   || 0
  const capacidad    = home.capacidad    || home.maxGuests   || home.max_guests || 0
  const amenities    = home.amenities    || []
  const rating       = home.rating       || null

  const gradient = GRADIENTS[tipo] ?? DEFAULT_GRADIENT

  return (
    <Link
      href={href}
      className="block group rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
    >
      <div className="aspect-square flex flex-col">
        {/* Image / gradient — 62% */}
        <div className="relative overflow-hidden" style={{ flex: '0 0 62%' }}>
          {tipo && (
            <div className="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {tipo}
            </div>
          )}
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: gradient }}
            >
              <TypeIcon tipo={tipo} />
            </div>
          )}
        </div>

        {/* Info — 38% */}
        <div
          className="overflow-hidden flex flex-col justify-between"
          style={{ flex: '0 0 38%', background: '#F8F4EE', padding: '10px 12px 8px' }}
        >
          <div>
            <p className="font-bold text-sm text-gray-900 leading-tight truncate">{title}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {city}{region ? ` · ${region}` : ''}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              {habitaciones > 0 && <span>🛏 {habitaciones}</span>}
              {banos > 0 && <span>🚿 {banos}</span>}
              {capacidad > 0 && <span>👥 {capacidad}</span>}
            </div>
            <div className="flex items-center justify-between gap-1">
              <div className="flex gap-1 flex-wrap overflow-hidden">
                {amenities.slice(0, 2).map(a => (
                  <span
                    key={a}
                    className="text-xs px-2 py-0.5 rounded-full truncate"
                    style={{ background: '#E8D5B0', color: '#3d3020' }}
                  >
                    {a}
                  </span>
                ))}
              </div>
              {rating && (
                <span className="text-xs text-gray-600 flex-shrink-0 font-medium">⭐ {rating}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
