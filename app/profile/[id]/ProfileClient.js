'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useApp } from '../../../lib/store'
import { MapPin, Home, Calendar, Star, ArrowLeft, Gift, Camera, CheckCircle } from 'lucide-react'

function AdBanner() {
  return (
    <div className="bg-gradient-to-r from-forest to-forest-dark rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center gap-4 shadow-md my-6">
      <div className="flex-1">
        <span className="inline-block bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full mb-2">🎉 100% GRATIS</span>
        <h3 className="font-black text-base sm:text-lg mb-1">¿También quieres intercambiar tu hogar?</h3>
        <p className="text-white/80 text-xs">Regístrate gratis, publica tu hogar y viaja por Chile sin pagar alojamiento.</p>
      </div>
      <Link href="/auth/register"
        className="flex-shrink-0 bg-white text-forest-dark font-black px-5 py-2.5 rounded-xl text-sm hover:bg-sand transition-colors flex items-center gap-2 whitespace-nowrap">
        <Gift className="w-4 h-4" /> Unirme gratis
      </Link>
    </div>
  )
}

export default function ProfileClient({ id }) {
  const { users, homes, wishes, user, updateProfile } = useApp()
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarSaved,     setAvatarSaved]     = useState(false)

  const profileUser = users.find(u => u.id === id)
  const uHomes  = homes.filter(h => (h.user_id || h.userId) === id)
  const uWishes = wishes.filter(w => (w.user_id || w.userId) === id)
  const isOwner = user?.id === id

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 1024 * 1024) { alert('La foto debe pesar menos de 1MB'); return }
    setUploadingAvatar(true)
    const reader = new FileReader()
    reader.onload = async (ev) => {
      await updateProfile({ avatar: ev.target.result })
      setUploadingAvatar(false)
      setAvatarSaved(true)
      setTimeout(() => setAvatarSaved(false), 3000)
    }
    reader.readAsDataURL(file)
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
        <div className="text-center">
          <p className="text-gray-500 font-medium mb-3">Usuario no encontrado</p>
          <Link href="/" className="text-forest font-bold hover:text-forest-dark">← Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const initial    = profileUser.name?.[0]?.toUpperCase() || '?'
  const memberYear = profileUser.created_at
    ? new Date(profileUser.created_at).getFullYear()
    : 2026

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        {/* Profile header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start gap-5">
            {/* Avatar con opción de cambio */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-forest flex items-center justify-center text-white text-3xl font-black overflow-hidden">
                {profileUser.avatar
                  ? <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover" />
                  : initial
                }
              </div>
              {isOwner && (
                <label className="absolute -bottom-1 -right-1 bg-forest text-white rounded-full p-1.5 cursor-pointer hover:bg-forest-dark transition shadow-md">
                  {uploadingAvatar
                    ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    : avatarSaved
                    ? <CheckCircle className="w-3 h-3" />
                    : <Camera className="w-3 h-3" />
                  }
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-900">{profileUser.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                {(profileUser.comuna || profileUser.city) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-terra" />
                    {profileUser.comuna || profileUser.city}
                    {profileUser.region ? `, ${profileUser.region}` : ''}
                  </span>
                )}
                {profileUser.verified && (
                  <span className="flex items-center gap-1 text-forest text-xs font-bold">
                    <CheckCircle className="w-3.5 h-3.5" /> Verificado
                  </span>
                )}
              </div>
              {isOwner && avatarSaved && (
                <p className="mt-2 text-xs text-forest font-semibold">✓ Foto actualizada</p>
              )}
              {profileUser.bio && (
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{profileUser.bio}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
            {[
              { label: 'Hogares',  value: uHomes.length,  icon: Home,     color: 'text-forest' },
              { label: 'Destinos', value: uWishes.length, icon: Star,     color: 'text-terra' },
              { label: 'Miembro',  value: memberYear,     icon: Calendar, color: 'text-andean' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                <p className="text-xl font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Banner para no logueados */}
        {!user && <AdBanner />}

        {/* Homes */}
        <h2 className="font-black text-gray-800 text-lg mb-3 flex items-center gap-2">
          <Home className="w-5 h-5 text-forest" /> Hogares de {profileUser.name?.split(' ')[0]}
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
                <div className="w-16 h-16 rounded-xl bg-forest-50 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                  {home.images?.[0]
                    ? <img src={home.images[0]} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-900 text-base group-hover:text-forest transition-colors">{home.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {home.comuna || home.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-3.5 h-3.5" />{home.bedrooms} hab.
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Wishes */}
        {uWishes.length > 0 && (
          <>
            <h2 className="font-black text-gray-800 text-lg mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-terra" /> Le gustaría visitar en Chile
            </h2>
            <div className="grid gap-3">
              {uWishes.map(w => (
                <div key={w.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-terra/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-terra" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{w.to_city || w.toCity}</p>
                    <p className="text-xs text-gray-500">
                      {w.start_date || w.startDate} → {w.end_date || w.endDate}
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
