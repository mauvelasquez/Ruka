'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomeCard from '../components/HomeCard'
import { useApp } from '../lib/store'
import { CHILE_BANNERS, getRandomBanners } from '../lib/chile-banners'
import { Mountain, ArrowRight, MapPin, Calendar, Users, Sparkles, Shield, Lock, ArrowLeftRight, Gift, Zap, Heart } from 'lucide-react'

const CHILE_CITIES = CHILE_BANNERS.map(b => b.city)

const STEPS = [
  { n: '01', icon: '🏔️', title: 'Publica tu rukka', desc: 'Crea tu perfil y registra tu hogar con fotos y descripción.' },
  { n: '02', icon: '🗺️', title: 'Elige tu destino', desc: 'Busca hogares en tu ciudad soñada dentro de Chile.' },
  { n: '03', icon: '✦', title: 'El algoritmo trabaja', desc: 'Rukka detecta matches perfectos entre viajeros con fechas compatibles.' },
  { n: '04', icon: '🤝', title: 'Intercambia y viaja', desc: 'Confirmen el intercambio y vivan como locales en la ciudad del otro.' },
]

const BENEFITS = [
  { icon: '🏕️', title: 'Inspirado en Chile', desc: 'Nace del espíritu Mapuche de compartir la "rukka". Conexión auténtica entre chilenos.' },
  { icon: '💸', title: '100% gratis', desc: 'Sin hoteles, sin Airbnb, sin comisiones. Tu hogar como moneda de cambio.' },
  { icon: '🔁', title: 'Match bilateral', desc: 'El sistema detecta cuándo dos viajeros quieren visitarse en fechas compatibles.' },
  { icon: '🔒', title: 'Comunidad verificada', desc: 'Verificación de email obligatoria y perfil completo para todos los miembros.' },
]

// ── AD BANNER ─────────────────────────────────────────────────────────────────
function AdBanner({ variant = 'primary', className = '', heroBanner = null }) {
  const variants = {
    primary: {
      bg: 'bg-gradient-to-r from-forest to-forest-dark',
      badge: '🎉 100% GRATIS',
      title: 'Viaja por Chile sin gastar en alojamiento',
      desc: 'Intercambia tu hogar y vive como local en cualquier ciudad. Sin comisiones, sin costos ocultos.',
      cta: 'Registrar mi hogar gratis',
      href: '/auth/register',
      icon: Gift,
    },
    secondary: {
      bg: 'bg-gradient-to-r from-terra to-amber-700',
      badge: '✦ MATCH AUTOMÁTICO',
      title: `¿Quieres ir a ${heroBanner?.city ?? 'Chile'}? Hay alguien que quiere venir a tu ciudad`,
      desc: 'El algoritmo Rukka conecta viajeros que se quieren visitar mutuamente. ¡Gratis!',
      cta: 'Buscar mi match',
      href: '/auth/register',
      icon: Zap,
    },
    tertiary: {
      bg: 'bg-gradient-to-r from-andean to-blue-700',
      badge: '🇨🇱 SOLO CHILE',
      title: 'Pucón · Atacama · Valparaíso · Chiloé · Patagonia',
      desc: 'Hogares disponibles en todo Chile. Regístrate gratis y empieza a intercambiar hoy.',
      cta: 'Ver hogares disponibles',
      href: '/homes',
      icon: Heart,
    },
  }
  const v = variants[variant]
  const Icon = v.icon

  return (
    <div className={`${v.bg} rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center gap-4 shadow-lg ${className}`}>
      <div className="flex-1">
        <span className="inline-block bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full mb-3">{v.badge}</span>
        <h3 className="font-black text-lg sm:text-xl mb-1 leading-tight">{v.title}</h3>
        <p className="text-white/80 text-sm">{v.desc}</p>
      </div>
      <Link href={v.href}
        className="flex-shrink-0 bg-white text-forest-dark font-black px-5 py-3 rounded-xl text-sm hover:bg-sand transition-colors flex items-center gap-2 whitespace-nowrap">
        <Icon className="w-4 h-4" /> {v.cta}
      </Link>
    </div>
  )
}

// ── SEARCH WIZARD ─────────────────────────────────────────────────────────────
function SearchWizard({ homes, users }) {
  const [dest, setDest] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [guests, setGuests] = useState(2)
  const [results, setResults] = useState(null)
  const [showGate, setShowGate] = useState(false)

  const handleSearch = e => {
    e.preventDefault()
    if (!dest) return
    const matches = homes.filter(h =>
      h.city?.toLowerCase().includes(dest.toLowerCase()) ||
      h.comuna?.toLowerCase().includes(dest.toLowerCase()) ||
      h.location?.toLowerCase().includes(dest.toLowerCase())
    )
    setResults(matches)
    setShowGate(false)
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-2xl w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-900">¿A dónde quieres ir?</h2>
        <p className="text-gray-500 text-sm mt-1">Descubre hogares disponibles en Chile — gratis</p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
            <MapPin className="w-3.5 h-3.5 text-terra inline mr-1" /> ¿A qué ciudad de Chile quieres ir?
          </label>
          <div className="relative">
            <input list="cities-list" value={dest} onChange={e => setDest(e.target.value)}
              placeholder="ej. Pucón, Valparaíso, Atacama..."
              className="w-full border-2 border-gray-200 focus:border-forest rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
            <datalist id="cities-list">
              {CHILE_CITIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              <Calendar className="w-3.5 h-3.5 text-terra inline mr-1" /> Desde
            </label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border-2 border-gray-200 focus:border-forest rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Hasta</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="w-full border-2 border-gray-200 focus:border-forest rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
            <Users className="w-3.5 h-3.5 text-terra inline mr-1" /> ¿Cuántas personas?
          </label>
          <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-2.5">
            <button type="button" onClick={() => setGuests(g => Math.max(1, g - 1))}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-gray-700 text-lg flex items-center justify-center">−</button>
            <span className="flex-1 text-center font-black text-gray-900">{guests} {guests === 1 ? 'persona' : 'personas'}</span>
            <button type="button" onClick={() => setGuests(g => Math.min(20, g + 1))}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-gray-700 text-lg flex items-center justify-center">+</button>
          </div>
        </div>

        <button type="submit"
          className="w-full bg-forest text-white py-4 rounded-xl font-black text-base hover:bg-forest-dark transition-colors flex items-center justify-center gap-2 shadow-lg">
          <Sparkles className="w-5 h-5" /> Ver hogares disponibles
        </button>
      </form>

      {results !== null && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          {results.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-3">No encontramos hogares en <strong>{dest}</strong> aún.</p>
              <Link href="/auth/register" className="mt-3 inline-flex items-center gap-1.5 text-forest font-bold text-sm hover:text-forest-dark">
                Registrar mi hogar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div>
              <p className="font-black text-gray-900 mb-4">
                <span className="text-forest text-2xl">{results.length}</span> hogar{results.length !== 1 ? 'es' : ''} en <span className="text-terra">{dest}</span>
              </p>
              <div className="space-y-3 mb-4">
                {results.slice(0, 2).map(h => (
                  <div key={h.id} className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-forest-50">
                      {h.images?.[0] && <img src={h.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{h.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {h.comuna || h.city}
                      </p>
                      <p className="text-xs text-forest font-bold mt-1">✓ Disponible · {h.max_guests || h.maxGuests} pers. máx.</p>
                    </div>
                  </div>
                ))}
              </div>
              {!showGate ? (
                results.length > 2 && (
                  <button onClick={() => setShowGate(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 font-bold hover:border-forest hover:text-forest transition-colors">
                    +{results.length - 2} hogares más — ver todos
                  </button>
                )
              ) : (
                <div className="bg-forest-50 border-2 border-forest rounded-2xl p-5 text-center">
                  <Lock className="w-8 h-8 text-forest mx-auto mb-2" />
                  <h3 className="font-black text-gray-900 mb-1">Crea tu cuenta gratis para continuar</h3>
                  <p className="text-sm text-gray-500 mb-4">Regístrate y contacta a los {results.length} anfitriones en {dest}.</p>
                  <Link href="/auth/register"
                    className="w-full bg-forest text-white py-3 rounded-xl font-black text-sm hover:bg-forest-dark transition-colors flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Registrarme gratis
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { homes, users } = useApp()
  const featured = homes.filter(h => h.featured).slice(0, 3)

  const [heroBanner,     setHeroBanner]     = useState(null)
  const [destinoBanners, setDestinoBanners] = useState([])

  useEffect(() => {
    setHeroBanner(CHILE_BANNERS[Math.floor(Math.random() * CHILE_BANNERS.length)])
    setDestinoBanners(getRandomBanners(6))
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      {/* ── HERO con banner dinámico ──────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {heroBanner && (
            <img src={heroBanner.image} alt={heroBanner.city} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 hero-rukka" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {heroBanner && (
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white rounded-full px-4 py-2 text-sm font-medium mb-4">
                  <span>{heroBanner.emoji}</span>
                  <span>{heroBanner.tagline}</span>
                </div>
              )}
              <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] mb-5">
                Intercambia<br />
                <span className="text-sand">tu hogar,</span><br />
                viaja por Chile.
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-4 max-w-lg">
                {heroBanner?.description}
              </p>
              {heroBanner && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {heroBanner.tags.map(tag => (
                    <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-3 text-white/80 text-sm">
                {['✓ 100% gratis para siempre', '✓ Solo en Chile', '✓ Matches automáticos'].map(t => (
                  <span key={t} className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <SearchWizard homes={homes} users={users} />
            </div>
          </div>
        </div>
      </section>

      {/* ── BANNER 1 ─────────────────────────────────────────────────────────── */}
      <section className="py-8 bg-white border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner variant="primary" />
        </div>
      </section>

      {/* ── DESTINOS CHILE — banners dinámicos ───────────────────────────────── */}
      <section className="py-16" style={{ background: '#F8F4EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terra mb-1">🇨🇱 Destinos en Chile</p>
              <h2 className="text-2xl font-extrabold text-gray-900">¿A dónde quieres ir?</h2>
            </div>
            <Link href="/homes" className="text-forest font-semibold text-sm hover:text-forest-dark flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {destinoBanners.map(b => (
              <Link key={b.id} href={`/homes?search=${encodeURIComponent(b.city)}`}
                className="group relative rounded-2xl overflow-hidden h-32 block shadow-sm hover:shadow-md transition-shadow">
                <img src={b.image} alt={b.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-lg mb-0.5">{b.emoji}</p>
                  <p className="text-white font-bold text-xs leading-tight">{b.city}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER 2 ─────────────────────────────────────────────────────────── */}
      <section className="py-6" style={{ background: '#F8F4EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner variant="secondary" heroBanner={heroBanner} />
        </div>
      </section>

      {/* ── FEATURED HOMES ───────────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-terra mb-1">✦ Destacados</p>
                <h2 className="text-3xl font-extrabold text-gray-900">Hogares que te van a encantar</h2>
              </div>
              <Link href="/homes" className="hidden sm:flex items-center gap-2 text-forest font-semibold text-sm hover:text-forest-dark">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(h => (
                <HomeCard key={h.id} home={h} user={users.find(u => u.id === (h.user_id || h.userId))} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-rukka-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-forest-light mb-3">Cómo funciona</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">4 pasos para viajar diferente</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Sin hoteles, sin Airbnb, sin pagar alojamiento. Solo intercambio real.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
                  <div className="text-3xl mb-4">{s.icon}</div>
                  <p className="text-forest-light text-xs font-bold mb-2">Paso {s.n}</p>
                  <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-forest/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MATCH EXPLAINER ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">El corazón de Rukka</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">El sistema de match bilateral</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Rukka detecta automáticamente cuando dos viajeros quieren visitarse mutuamente en fechas compatibles.
            </p>
          </div>
          <div className="bg-forest-50 border border-forest-100 rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-8">
              {/* Card Camila */}
              <div className="w-64 flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden" style={{ height: 140 }}>
                  <img src="https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=320&h=140&fit=crop"
                    alt="Hogar Camila" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)' }} />
                  <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face"
                    alt="Camila" className="absolute top-3 left-3 w-11 h-11 rounded-full object-cover border-2 border-white shadow-md" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-black text-sm leading-tight">Camila</p>
                    <p className="text-xs text-white/80">Santiago → Pucón · Jul 10–25</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="bg-forest text-white rounded-full p-3 shadow-lg">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-forest bg-forest-100 px-3 py-1 rounded-full">Match perfecto ✦</span>
              </div>

              {/* Card Roberto */}
              <div className="w-64 flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden" style={{ height: 140 }}>
                  <img src="https://images.unsplash.com/photo-1601059381817-9ad55a5a6dc3?w=320&h=140&fit=crop"
                    alt="Hogar Roberto" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)' }} />
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face"
                    alt="Roberto" className="absolute top-3 left-3 w-11 h-11 rounded-full object-cover border-2 border-white shadow-md" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-black text-sm leading-tight">Roberto</p>
                    <p className="text-xs text-white/80">Pucón → Santiago · Jul 10–25</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-6">
                <strong>Resultado:</strong> Camila disfruta la naturaleza en Pucón mientras Roberto explora Providencia. Ambos sin pagar alojamiento.
              </p>
              <Link href="/auth/register"
                className="inline-flex items-center gap-2 bg-forest text-white px-8 py-3.5 rounded-xl font-bold hover:bg-forest-dark transition-colors">
                <Sparkles className="w-5 h-5" /> Encontrar mi match — gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BANNER 3 ─────────────────────────────────────────────────────────── */}
      <section className="py-8" style={{ background: '#F8F4EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner variant="tertiary" />
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Por qué Rukka</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Viajar diferente, en Chile</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="landscape-gradient rounded-3xl p-12 text-white">
            <p className="text-5xl mb-6">🏔️ ↔ 🌿</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">¿Lista tu rukka para el intercambio?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Únete gratis, registra tu hogar y deja que el algoritmo encuentre tu match perfecto en Chile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register"
                className="bg-white text-forest-dark px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-sand transition-colors">
                Registrar mi hogar — gratis →
              </Link>
              <Link href="/homes"
                className="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
                Explorar hogares
              </Link>
            </div>
            <p className="text-white/50 text-xs mt-6 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> 100% gratis · Verificado · Sin comisiones
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
