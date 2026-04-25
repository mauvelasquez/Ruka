'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomeCard from '../components/HomeCard'
import { useApp } from '../lib/store'
import { Mountain, ArrowRight, MapPin, Calendar, Users, Sparkles, CheckCircle, Globe, ArrowLeftRight, Star, Shield } from 'lucide-react'

const STEPS = [
  { n: '01', icon: '🏔️', title: 'Publica tu ruka', desc: 'Crea tu perfil y registra tu hogar con fotos, descripción y fechas de disponibilidad.' },
  { n: '02', icon: '🌎', title: 'Elige tu destino', desc: 'Busca hogares en tu ciudad soñada. Filtra por fechas, capacidad y tipo de alojamiento.' },
  { n: '03', icon: '✦', title: 'El algoritmo trabaja', desc: 'Ruka detecta matches perfectos: dos personas que quieren visitarse mutuamente en fechas compatibles.' },
  { n: '04', icon: '🤝', title: 'Intercambia y viaja', desc: 'Confirmen el intercambio y ¡listo! Cada uno vive como local en la ciudad del otro.' },
]

const BENEFITS = [
  { icon: '🏕️', title: 'Inspirado en Chile', desc: 'Nace del espíritu Mapuche de compartir la "ruka" (hogar). Conexión auténtica con personas y lugares.' },
  { icon: '💸', title: 'Alojamiento gratis', desc: 'Sin hoteles, sin Airbnb. Tu hogar como moneda de cambio para viajar por el mundo.' },
  { icon: '🔁', title: 'Match bilateral', desc: 'El sistema detecta automáticamente cuándo dos viajeros quieren visitarse en fechas compatibles.' },
  { icon: '🔒', title: 'Comunidad verificada', desc: 'Verificación de email obligatoria y perfil completo con hogar registrado para todos los miembros.' },
]

export default function HomePage() {
  const { homes, users } = useApp()
  const router = useRouter()
  const [dest, setDest] = useState('')
  const [dates, setDates] = useState('')

  const featured = homes.filter(h => h.featured).slice(0, 6)
  const chileHomes = homes.filter(h => h.country === 'Chile')

  const handleSearch = e => {
    e.preventDefault()
    router.push(`/homes?search=${encodeURIComponent(dest)}`)
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src="https://picsum.photos/seed/chile-landscape/1600/900" alt=""
            className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-ruka" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white rounded-full px-4 py-2 text-sm font-medium mb-8">
              <Mountain className="w-4 h-4" />
              <span>Ruka significa "hogar" en Mapudungun</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              Intercambia<br />
              <span className="text-sand">tu hogar,</span><br />
              vive el mundo.
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-xl">
              La plataforma chilena de intercambio de hogares. Vive auténticamente en Chile y el mundo sin gastar en alojamiento. El algoritmo Ruka conecta viajeros que quieren visitarse mutuamente.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-3 shadow-2xl flex flex-col sm:flex-row gap-3 max-w-xl mb-8">
              <div className="flex items-center gap-3 flex-1 px-2">
                <MapPin className="w-5 h-5 text-terra flex-shrink-0" />
                <input type="text" placeholder="¿A qué ciudad quieres ir?" value={dest} onChange={e => setDest(e.target.value)}
                  className="flex-1 text-gray-800 text-sm font-medium outline-none placeholder-gray-400" />
              </div>
              <button type="submit"
                className="bg-forest text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors flex items-center gap-2 justify-center">
                Buscar <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-4 text-white/70 text-sm">
              {['✓ Gratis para registrarse', '✓ Matches automáticos', '✓ Solo en Chile y el mundo'].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute bottom-8 right-8 hidden lg:flex flex-col gap-3">
          {[
            { v: `${homes.length}+`, l: 'hogares activos' },
            { v: `${users.length}+`, l: 'viajeros' },
            { v: '4.9★', l: 'valoración media' },
          ].map(s => (
            <div key={s.l} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-white text-center">
              <p className="text-2xl font-black">{s.v}</p>
              <p className="text-xs text-white/70">{s.l}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs flex flex-col items-center gap-1 animate-bounce">
          <span>Explorar</span>
          <div className="w-0.5 h-6 bg-white/30 rounded-full" />
        </div>
      </section>

      {/* ── CHILE HIGHLIGHT ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terra mb-1">🇨🇱 Descubre Chile</p>
              <h2 className="text-2xl font-extrabold text-gray-900">Hogares chilenos disponibles</h2>
            </div>
            <Link href="/homes?country=Chile" className="text-forest font-semibold text-sm hover:text-forest-dark flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { city: 'Santiago', img: 'seed/stgo-city', count: homes.filter(h => h.city === 'Santiago').length },
              { city: 'Valparaíso', img: 'seed/valpo-city', count: homes.filter(h => h.city === 'Valparaíso').length },
              { city: 'Pucón', img: 'seed/pucon-city', count: homes.filter(h => h.city === 'Pucón').length },
              { city: 'Atacama', img: 'seed/atacama-city', count: homes.filter(h => h.city.includes('Atacama')).length },
              { city: 'Viña del Mar', img: 'seed/vina-city', count: homes.filter(h => h.city === 'Viña del Mar').length },
            ].map(c => (
              <Link key={c.city} href={`/homes?search=${c.city}`}
                className="group relative rounded-xl overflow-hidden h-28 sm:h-36 block">
                <img src={`https://picsum.photos/${c.img}/400/300`} alt={c.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-bold text-sm">{c.city}</p>
                  <p className="text-white/70 text-xs">{c.count > 0 ? `${c.count} hogar${c.count !== 1 ? 'es' : ''}` : 'Próximamente'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED HOMES ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#F8F4EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terra mb-1">✦ Destacados</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Hogares que te van a enamorar</h2>
            </div>
            <Link href="/homes" className="hidden sm:flex items-center gap-2 text-forest font-semibold text-sm hover:text-forest-dark">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(h => (
              <HomeCard key={h.id} home={h} user={users.find(u => u.id === h.userId)} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/homes"
              className="inline-flex items-center gap-2 bg-forest text-white px-8 py-3.5 rounded-xl font-bold hover:bg-forest-dark transition-colors shadow-md">
              Explorar todos los hogares <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-ruka-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-forest-light mb-3">Cómo funciona</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">4 pasos para viajar diferente</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Sin hoteles, sin Airbnb. Solo intercambio real entre personas reales.</p>
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

      {/* ── MATCH EXPLAINER ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">El corazón de Ruka</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">El sistema de match bilateral</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Ruka detecta automáticamente cuando dos viajeros quieren visitarse mutuamente en fechas compatibles. Es el intercambio perfecto.
            </p>
          </div>
          <div className="bg-forest-50 border border-forest-100 rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8">
              {/* User A */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 border-2 border-forest">
                  <img src="https://i.pravatar.cc/150?img=47" alt="" className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-gray-900 text-sm">Camila</p>
                <p className="text-xs text-gray-500">Santiago 🇨🇱</p>
                <div className="mt-2 bg-terra-50 border border-terra/20 rounded-lg px-3 py-1.5">
                  <p className="text-xs text-terra font-semibold">Quiere ir a Barcelona</p>
                  <p className="text-xs text-gray-500">Mar 10–25 · 2 personas</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-2">
                <div className="bg-forest text-white rounded-full p-3 shadow-lg">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-forest bg-forest-100 px-3 py-1 rounded-full">Match perfecto ✦</span>
              </div>

              {/* User B */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 border-2 border-forest">
                  <img src="https://i.pravatar.cc/150?img=11" alt="" className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-gray-900 text-sm">Lars</p>
                <p className="text-xs text-gray-500">Barcelona 🇪🇸</p>
                <div className="mt-2 bg-terra-50 border border-terra/20 rounded-lg px-3 py-1.5">
                  <p className="text-xs text-terra font-semibold">Quiere ir a Santiago</p>
                  <p className="text-xs text-gray-500">Mar 10–25 · 2 personas</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-6">
                <strong>Resultado:</strong> Camila vive en el Eixample de Barcelona mientras Lars vive en Providencia.
                Ambos sin pagar alojamiento. Ambos con la experiencia de un local.
              </p>
              <Link href="/auth/register"
                className="inline-flex items-center gap-2 bg-forest text-white px-8 py-3.5 rounded-xl font-bold hover:bg-forest-dark transition-colors">
                <Sparkles className="w-5 h-5" /> Encontrar mi match
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ──────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#F8F4EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Por qué Ruka</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Viajar diferente</h2>
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

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="landscape-gradient rounded-3xl p-12 text-white">
            <p className="text-5xl mb-6">🏔️ ↔ 🌍</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">¿Lista tu ruka para el intercambio?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Únete, registra tu hogar y deja que el algoritmo encuentre tu match perfecto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register"
                className="bg-white text-forest-dark px-8 py-4 rounded-xl font-extrabold text-lg hover:bg-sand transition-colors">
                Registrar mi hogar →
              </Link>
              <Link href="/homes"
                className="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
                Explorar hogares
              </Link>
            </div>
            <p className="text-white/50 text-xs mt-6 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> Gratis · Verificado · Sin comisiones de alojamiento
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
