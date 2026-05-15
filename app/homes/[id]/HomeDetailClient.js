'use client'
import { useState, useEffect } from 'react'

const AMENITY_LABEL = {
  wifi:    'WiFi',
  parking: 'Estacionamiento',
  ac:      'Aire acondicionado',
  heating: 'Calefacción',
  tv:      'Televisor',
  coffee:  'Cafetera',
  kitchen: 'Cocina equipada',
  washer:  'Lavadora',
  pets:    'Mascotas permitidas',
  baby:    'Apto para bebés',
}
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { useApp } from '../../../lib/store'
import { Star, MapPin, Bed, Bath, Users, ChevronLeft, ChevronRight, ArrowLeftRight, Calendar, CheckCircle, Globe, Heart, Share2, Sparkles, Shield, Clock } from 'lucide-react'

export default function HomeDetailClient({ id }) {
  const router = useRouter()
  const { getHomeById, getUserById, user, sendExchangeRequest, homes } = useApp()
  const [home, setHome] = useState(null)
  const [host, setHost] = useState(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [liked, setLiked] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ start: '', end: '', message: '' })
  const [err, setErr] = useState('')

  useEffect(() => {
    const h = getHomeById(id)
    if (h) { setHome(h); setHost(getUserById(h.userId)) }
  }, [id, homes])

  if (!home) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
      <div className="w-10 h-10 border-4 border-forest border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const imgs = home.images || []

  const handleRequest = e => {
    e.preventDefault()
    if (!user) { router.push('/auth/login'); return }
    if (!form.start || !form.end) { setErr('Selecciona las fechas del intercambio'); return }
    const myHome = homes.find(h => h.userId === user.id)
    sendExchangeRequest({
      receiverId:     home.userId,
      receiverHomeId: home.id,
      proposerHomeId: myHome?.id || null,
      dates:          { start: form.start, end: form.end },
      message:        form.message,
    })
    setSent(true); setErr('')
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-gray-500 hover:text-forest text-sm font-medium mb-5 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-forest-50 text-forest text-xs font-bold px-2.5 py-1 rounded-full border border-forest-100">{home.type}</span>
              <span className="bg-green-50 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <ArrowLeftRight className="w-3 h-3" /> Disponible para intercambio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">{home.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-terra" /> {home.location}</span>
              {home.rating > 0 && <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> <b className="text-gray-800">{home.rating.toFixed(1)}</b> ({home.reviewCount})</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLiked(!liked)} className={`p-2.5 rounded-xl border transition-colors ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}>
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : ''}`} />
            </button>
            <button className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:border-gray-300">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="relative rounded-2xl overflow-hidden h-64 sm:h-96 mb-8 group bg-gray-200">
          <img src={imgs[imgIdx] || `https://picsum.photos/seed/${home.id}/800/500`} alt={home.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = `https://picsum.photos/seed/home${home.id}/800/500` }} />
          {imgs.length > 1 && <>
            <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {imgs.map((_, i) => <button key={i} onClick={() => setImgIdx(i)}
                className={`h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-6' : 'bg-white/60 w-2'}`} />)}
            </div>
          </>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[[<Bed className="w-5 h-5" />, `${home.bedrooms} hab.`, 'Habitaciones'],
                [<Bath className="w-5 h-5" />, `${home.bathrooms} baño${home.bathrooms > 1 ? 's' : ''}`, 'Baños'],
                [<Users className="w-5 h-5" />, `${home.maxGuests} pers.`, 'Máx. huéspedes']
              ].map(([icon, val, lbl], i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                  <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center mx-auto mb-2 text-forest">{icon}</div>
                  <p className="font-bold text-gray-900 text-sm">{val}</p>
                  <p className="text-xs text-gray-400">{lbl}</p>
                </div>
              ))}
            </div>

            {/* Host */}
            {host && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Anfitrión</h2>
                <div className="flex items-start gap-4">
                  <Link href={`/profile/${host.id}`} className="relative flex-shrink-0">
                    <img src={host.avatar} alt={host.name} className="w-16 h-16 rounded-2xl object-cover"
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(host.name || '')}&background=2d6a4f&color=fff&size=150` }} />
                    {host.verified && <div className="absolute -bottom-1 -right-1 bg-forest rounded-full p-1 border-2 border-white"><CheckCircle className="w-3.5 h-3.5 text-white" /></div>}
                  </Link>
                  <div className="flex-1">
                    <Link href={`/profile/${host.id}`} className="font-bold text-gray-900 hover:text-forest transition-colors">{host.name}</Link>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5" />{host.location}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      {host.rating > 0 && <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><b className="text-gray-700">{host.rating}</b> ({host.reviewCount})</span>}
                      {host.exchanges > 0 && <span>{host.exchanges} intercambios</span>}
                    </div>
                    {host.languages?.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{host.languages.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
                {host.bio && <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-50 leading-relaxed">{host.bio}</p>}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Sobre este hogar</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{home.description}</p>
              {home.size && <p className="text-xs text-gray-400 mt-3">📐 {home.size}m² {home.floor ? `· Piso ${home.floor}` : ''}</p>}
            </div>

            {/* Availability */}
            {home.availabilityPeriods?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-forest" /> Fechas disponibles
                </h2>
                <div className="space-y-2">
                  {home.availabilityPeriods.map(p => (
                    <div key={p.id} className="flex items-center gap-3 bg-forest-50 rounded-xl p-3 border border-forest-100">
                      <span className="available-dot flex-shrink-0" />
                      <span className="text-sm font-semibold text-forest">
                        {new Date(p.start).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })} → {new Date(p.end).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {home.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Lo que incluye</h2>
                <div className="grid grid-cols-2 gap-3">
                  {home.amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-forest flex-shrink-0" /> {AMENITY_LABEL[a] || a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby */}
            {home.nearbyAttractions?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Cerca de aquí</h2>
                <ul className="space-y-2">
                  {home.nearbyAttractions.map((a, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-terra rounded-full flex-shrink-0" />{a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews */}
            {home.reviews?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> {home.rating.toFixed(1)} · {home.reviewCount} reseñas
                </h2>
                <div className="space-y-5">
                  {home.reviews.map(r => (
                    <div key={r.id} className="border-b border-gray-50 last:border-0 pb-5 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={r.userAvatar} alt={r.userName} className="w-10 h-10 rounded-full object-cover"
                          onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userName || '')}&background=2d6a4f&color=fff&size=150` }} />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{r.userName}</p>
                          <p className="text-gray-400 text-xs">{new Date(r.date).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {[...Array(5)].map((_, j) => <Star key={j} className={`w-3.5 h-3.5 ${j < Math.floor(r.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Request */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {sent ? (
                <div className="bg-white rounded-2xl border border-forest-200 p-6 shadow-sm text-center">
                  <div className="w-16 h-16 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-forest" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">¡Solicitud enviada!</h3>
                  <p className="text-gray-500 text-sm mb-5">
                    {host?.name?.split(' ')[0] || 'El anfitrión'} recibirá tu solicitud. Te responderá pronto.
                  </p>
                  <Link href="/dashboard" className="block bg-forest text-white py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
                    Ver en mi panel
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-5">
                    <ArrowLeftRight className="w-5 h-5 text-forest" />
                    <h3 className="font-bold text-gray-900">Solicitar intercambio</h3>
                  </div>
                  <form onSubmit={handleRequest} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Fecha llegada</label>
                      <input type="date" value={form.start} min={new Date().toISOString().split('T')[0]}
                        onChange={e => setForm({ ...form, start: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Fecha salida</label>
                      <input type="date" value={form.end} min={form.start || new Date().toISOString().split('T')[0]}
                        onChange={e => setForm({ ...form, end: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Mensaje</label>
                      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Cuéntale sobre ti y por qué quieres su hogar..." rows={4}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest resize-none" />
                    </div>
                    {err && <p className="text-red-500 text-xs">{err}</p>}
                    <button type="submit"
                      className="w-full bg-forest text-white py-3.5 rounded-xl font-bold hover:bg-forest-dark transition-colors flex items-center justify-center gap-2">
                      <ArrowLeftRight className="w-5 h-5" />
                      {user ? 'Enviar solicitud' : 'Inicia sesión para solicitar'}
                    </button>
                    {!user && <p className="text-center text-xs text-gray-400"><Link href="/auth/register" className="text-forest font-semibold hover:underline">Regístrate gratis</Link> para intercambiar</p>}
                  </form>
                  <div className="mt-5 pt-5 border-t border-gray-50 space-y-2.5">
                    {[[<Shield className="w-4 h-4 text-forest" />, 'Comunidad verificada'],
                      [<Clock className="w-4 h-4 text-forest" />, 'Respuesta en menos de 24h'],
                      [<Sparkles className="w-4 h-4 text-forest" />, 'Busca tu match bilateral en Matches']
                    ].map(([icon, txt], i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-400">{icon} {txt}</div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 bg-terra-50 rounded-2xl p-4 border border-terra/10">
                <p className="text-xs font-bold text-terra mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> ¿Mejor con match perfecto?
                </p>
                <p className="text-xs text-gray-600 mb-3">Usa el buscador de matches para encontrar intercambios bilaterales automáticos.</p>
                <Link href="/matches" className="block text-center text-xs font-bold text-terra bg-white border border-terra/20 rounded-lg px-3 py-2 hover:bg-terra-50 transition-colors">
                  Buscar mi match →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
