'use client'
import Link from 'next/link'
import { useApp } from '../../../lib/store'
import { MapPin, Home, Calendar, Star, ArrowLeft, Globe } from 'lucide-react'

export default function ProfileClient({ id }) {
  const { users, homes, wishes } = useApp()

  const user  = users.find(u => u.id === id)
  const uHomes = homes.filter(h => h.userId === id)
  const uWishes = wishes.filter(w => w.userId === id)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
        <div className="text-center">
          <p className="text-gray-500 font-medium mb-3">Usuario no encontrado</p>
          <Link href="/" className="text-forest font-bold hover:text-forest-dark">← Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const initial = user.name?.[0]?.toUpperCase() || '?'

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        {/* Profile header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-forest flex items-center justify-center text-white text-3xl font-black flex-shrink-0">
              {initial}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-terra" />
                  {user.city}{user.country ? `, ${user.country}` : ''}
                </span>
                {user.language && (
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-andean" />
                    {user.language}
                  </span>
                )}
              </div>
              {user.bio && (
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{user.bio}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
            {[
              { label: 'Hogares',  value: uHomes.length,  icon: Home,     color: 'text-forest' },
              { label: 'Destinos', value: uWishes.length, icon: Star,     color: 'text-terra' },
              { label: 'Miembro',  value: '2025',         icon: Calendar, color: 'text-andean' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                <p className="text-xl font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Homes */}
        <h2 className="font-black text-gray-800 text-lg mb-3 flex items-center gap-2">
          <Home className="w-5 h-5 text-forest" /> Hogares de {user.name.split(' ')[0]}
        </h2>
        {uHomes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200 mb-6">
            <p className="text-gray-400 text-sm">Este usuario aún no tiene hogares registrados</p>
          </div>
        ) : (
          <div className="grid gap-4 mb-6">
            {uHomes.map(home => (
              <Link key={home.id} href={`/homes/${home.id}`}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4 group">
                <div className="w-16 h-16 rounded-xl bg-forest-50 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                  🏠
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-900 text-base group-hover:text-forest transition-colors">{home.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{home.city}</span>
                    <span className="flex items-center gap-1"><Home className="w-3.5 h-3.5" />{home.bedrooms} hab.</span>
                  </div>
                  {home.availabilityPeriods?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {home.availabilityPeriods.map(p => (
                        <span key={p.id} className="text-xs bg-green-50 text-green-700 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          {new Date(p.start).toLocaleDateString('es-CL', { day:'numeric', month:'short' })} – {new Date(p.end).toLocaleDateString('es-CL', { day:'numeric', month:'short' })}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Wishes */}
        {uWishes.length > 0 && (
          <>
            <h2 className="font-black text-gray-800 text-lg mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-terra" /> Le gustaría visitar
            </h2>
            <div className="grid gap-3">
              {uWishes.map(w => (
                <div key={w.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-terra/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-terra" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{w.toCity}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(w.startDate).toLocaleDateString('es-CL')} – {new Date(w.endDate).toLocaleDateString('es-CL')} · {w.guests} viajero{w.guests !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
