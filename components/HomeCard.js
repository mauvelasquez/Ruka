'use client'
import Link from 'next/link'
import { Star, MapPin, Bed, Users, Calendar, ArrowLeftRight, CheckCircle } from 'lucide-react'
import { analytics } from '../lib/analytics'

export default function HomeCard({ home, user, compact = false }) {
  if (!home) return null

  const typeColors = {
    'Departamento': 'bg-andean-50 text-andean-dark border-andean/20',
    'Casa': 'bg-forest-50 text-forest-dark border-forest/20',
    'Cabaña': 'bg-terra-50 text-terra-dark border-terra/20',
    'Estudio': 'bg-purple-100 text-purple-800 border-purple-200',
    'Loft': 'bg-amber-100 text-amber-800 border-amber-200',
    'Villa': 'bg-pink-100 text-pink-800 border-pink-200',
  }
  const badge = typeColors[home.type] || 'bg-gray-100 text-gray-700 border-gray-200'

  const nextAvail = home.availabilityPeriods?.find(p => p.end >= new Date().toISOString().split('T')[0])

  return (
    <Link href={`/homes/${home.id}`} className="group block" onClick={() => analytics.homeCardClick(home)}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/50 card-lift">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={home.images?.[0] || `https://picsum.photos/seed/${home.id}/800/500`}
            alt={home.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.src = `https://picsum.photos/seed/home${home.id}/800/500` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badge}`}>{home.type}</span>
          </div>
          {home.is_demo && (
            <div className="absolute top-3 right-3">
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 leading-tight">
                Perfil de ejemplo
              </span>
            </div>
          )}
          {!home.is_demo && home.featured && (
            <div className="absolute top-3 right-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-terra text-white">✦ Destacado</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-terra" />
            <span>{home.location}</span>
          </div>
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-forest transition-colors">
            {home.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {home.bedrooms} hab.</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> hasta {home.maxGuests}</span>
            {home.size && <><span>·</span><span>{home.size}m²</span></>}
          </div>

          {/* Availability */}
          {nextAvail && (
            <div className="flex items-center gap-1.5 text-xs text-forest bg-forest-50 rounded-lg px-2.5 py-1.5 mb-3 border border-forest-100">
              <span className="available-dot flex-shrink-0" />
              Disponible desde {new Date(nextAvail.start).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            {user && (
              <div className="flex items-center gap-2">
                <img src={user.avatar} alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2d6a4f&color=fff&size=150` }}
                />
                <div>
                  <p className="text-xs font-semibold text-gray-700">{user.name.split(' ')[0]}</p>
                  {user.verified && <p className="text-xs text-forest">✓ Verificado</p>}
                </div>
              </div>
            )}
            {/* TODO: re-habilitar valoraciones */}
            <span className="text-xs text-gray-400 italic ml-auto">Intercambio</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
