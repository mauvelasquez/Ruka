'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomeCard from '../components/HomeCard'
import FresiaSearchModule from '../components/FresiaSearchModule'
import FeaturedHomeCard from '../components/FeaturedHomeCard'
import { useApp } from '../lib/store'
import { CHILE_BANNERS } from '../lib/chile-banners'
import { DESTINOS_RUKKA } from '../lib/comunas'
import { HOGARES_FALLBACK } from '../lib/data/hogaresDestacados'
import { supabase } from '../lib/supabase'
import { ArrowRight, Sparkles, Shield, ArrowLeftRight, Gift, Zap, Heart } from 'lucide-react'

const STEPS = [
  { n: '01', icon: '🏔️', title: 'Publica tu rukka', desc: 'Crea tu perfil y registra tu hogar. ¿Ya estás en Airbnb? Impórtalo en segundos y empieza a recibir solicitudes de intercambio.' },
  { n: '02', icon: '🗺️', title: 'Elige tu destino', desc: 'Busca hogares en tu ciudad soñada dentro de Chile.' },
  { n: '03', icon: '✦', title: 'El algoritmo trabaja', desc: 'Rukka detecta matches perfectos entre viajeros con fechas compatibles.' },
  { n: '04', icon: '🤝', title: 'Intercambia y viaja', desc: 'Confirmen el intercambio y vivan como locales en la ciudad del otro.' },
]

const BENEFITS = [
  { icon: '🏕️', title: 'Inspirado en Chile', desc: 'Nace del espíritu Mapuche de compartir la "rukka". Conexión auténtica entre chilenos.' },
  { icon: '💸', title: '100% gratis', desc: 'Sin hoteles, sin Airbnb, sin comisiones. Tu hogar como moneda de cambio.' },
  { icon: '🔁', title: 'Match bilateral', desc: 'El sistema detecta cuándo dos viajeros quieren visitarse en fechas compatibles.' },
  { icon: '🔒', title: 'Comunidad verificada', desc: 'Verificación de email obligatoria y perfil completo para todos los miembros.' },
  { icon: '✈️', title: 'Importa tu Airbnb al instante', desc: 'Si ya tienes tu propiedad en Airbnb, pega el link y traemos fotos, descripción y características automáticamente. Sin repetir trabajo.' },
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
      title: 'Pichilemu · Puerto Varas · Zapallar · Frutillar · Panguipulli',
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

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { homes, users } = useApp()
  const featured = homes.filter(h => h.featured).slice(0, 3)

  const [heroBanner,    setHeroBanner]    = useState(null)
  const [exploreHomes,  setExploreHomes]  = useState([])
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    setHeroBanner(CHILE_BANNERS[Math.floor(Math.random() * CHILE_BANNERS.length)])
  }, [])

  useEffect(() => {
    supabase
      .from('homes')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setExploreHomes(data)
          setUsingFallback(false)
        } else {
          setExploreHomes(HOGARES_FALLBACK)
          setUsingFallback(true)
        }
      })
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      {/* ── HERO con banner dinámico ──────────────────────────────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroBanner && (
            <img src={heroBanner.image} alt={heroBanner.city} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 hero-rukka" />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center gap-6 overflow-y-auto h-full justify-center">
          {/* Hero copy */}
          <div className="text-center">
            {heroBanner && (
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white rounded-full px-4 py-2 text-sm font-medium mb-4">
                <span>{heroBanner.emoji}</span>
                <span>{heroBanner.tagline}</span>
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-2">
              Intercambia tu hogar,<br />
              <span className="text-sand">viaja por Chile.</span>
            </h1>
            <p className="text-base text-sand/90 font-bold italic">Mi casa es tu casa.</p>
          </div>

          {/* Fresia + buscador */}
          <FresiaSearchModule />

          {/* Badges */}
          <div className="flex flex-wrap gap-3 justify-center text-white/80 text-sm">
            {['✓ 100% gratis', '✓ Solo en Chile', '✓ Matches automáticos'].map(t => (
              <span key={t} className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPLORA HOGARES ──────────────────────────────────────────────────── */}
      {exploreHomes.length > 0 && (
        <section className="py-12" style={{ background: '#F8F4EE' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-forest">Explora hogares</h2>
              <p className="text-sm text-gray-500">Intercambia tu hogar y viaja gratis por Chile</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {exploreHomes.map(home => (
                <FeaturedHomeCard key={home.id} home={home} />
              ))}
            </div>
            {usingFallback && (
              <p className="text-xs text-center mt-5" style={{ color: '#9ca3af' }}>
                Sé el primero en publicar tu hogar en Rukka{' '}
                <Link href="/onboarding" className="hover:underline" style={{ color: '#C4622D' }}>→</Link>
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── BANNER 1 ─────────────────────────────────────────────────────────── */}
      <section className="py-8 bg-white border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner variant="primary" />
        </div>
      </section>

      {/* ── SEGUNDA VIVIENDA ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-forest mb-3">🏡 Para propietarios</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 leading-tight">
              Tu segunda casa,<br className="sm:hidden" /> el primer destino<br className="sm:inline hidden" /> de alguien más
            </h2>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              No necesitas prestar donde vives. Comparte tu casa de veraneo y accede a la de otros.
              Tú eliges cuándo, con quién y por cuánto tiempo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
            {[
              {
                emoji: '🏖️',
                title: 'Tu casa en la playa',
                desc: 'alguien la disfruta en invierno',
                bg: 'bg-blue-50',
                border: 'border-blue-100',
              },
              {
                emoji: '🌲',
                title: 'Tu cabaña en el bosque',
                desc: 'otro la cuida en verano',
                bg: 'bg-green-50',
                border: 'border-green-100',
              },
              {
                emoji: '🏔️',
                title: 'Tu refugio en la montaña',
                desc: 'una familia lo convierte en hogar',
                bg: 'bg-stone-50',
                border: 'border-stone-200',
              },
            ].map(({ emoji, title, desc, bg, border }) => (
              <div key={title}
                className={`${bg} border ${border} rounded-2xl p-7 text-center flex flex-col items-center gap-3`}>
                <span className="text-5xl">{emoji}</span>
                <div>
                  <h3 className="font-black text-gray-900 text-base mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm">→ {desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/onboarding"
              className="inline-flex items-center gap-2.5 bg-forest text-white px-8 py-4 rounded-full font-black text-base hover:bg-forest-dark transition-colors shadow-lg">
              Publicar mi segunda vivienda <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DESTINOS CHILE ───────────────────────────────────────────────────── */}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {DESTINOS_RUKKA.map(b => (
              <Link key={b.id} href={`/homes?search=${encodeURIComponent(b.city)}`}
                className="group relative rounded-2xl overflow-hidden h-32 block shadow-sm hover:shadow-md transition-shadow">
                <img src={b.image} alt={b.city} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-lg mb-0.5">{b.emoji}</p>
                  <p className="text-white font-bold text-xs leading-tight">{b.city}</p>
                  <p className="text-white/60 text-[10px] leading-tight">{b.tipo}</p>
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
                <HomeCard key={h.id} home={h} user={users.find(u => u.id === h.userId)} />
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
              <div style={{ position:'relative', borderRadius:16, overflow:'hidden', height:160, width:'100%', maxWidth:280, flexShrink:0 }}>
                <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600"
                  alt="Hogar Camila"
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.05))' }} />
                <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face"
                  alt="Camila"
                  style={{ position:'absolute', top:12, left:12, width:48, height:48, borderRadius:'50%', border:'2.5px solid white', objectFit:'cover' }} />
                <div style={{ position:'absolute', bottom:12, left:12 }}>
                  <p style={{ color:'white', fontWeight:600, fontSize:14, margin:0 }}>Camila</p>
                  <p style={{ color:'#a8dfc0', fontSize:12, margin:0 }}>San José de Maipo → Pichilemu · Jul 10–25</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="bg-forest text-white rounded-full p-3 shadow-lg">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-forest bg-forest-100 px-3 py-1 rounded-full">Match perfecto ✦</span>
              </div>

              {/* Card Roberto */}
              <div style={{ position:'relative', borderRadius:16, overflow:'hidden', height:160, width:'100%', maxWidth:280, flexShrink:0 }}>
                <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600"
                  alt="Hogar Roberto"
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.05))' }} />
                <img src="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face"
                  alt="Roberto"
                  style={{ position:'absolute', top:12, left:12, width:48, height:48, borderRadius:'50%', border:'2.5px solid white', objectFit:'cover' }} />
                <div style={{ position:'absolute', bottom:12, left:12 }}>
                  <p style={{ color:'white', fontWeight:600, fontSize:14, margin:0 }}>Roberto</p>
                  <p style={{ color:'#a8dfc0', fontSize:12, margin:0 }}>Pichilemu → San José de Maipo · Jul 10–25</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-6">
                <strong>Resultado:</strong> Camila disfruta el surf en Pichilemu mientras Roberto camina los cajones del Maipo. Ambos sin pagar alojamiento.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow ${i === 4 ? 'border-[#ff5a5f]/20 bg-[#ff5a5f]/3' : 'border-stone-200/60'}`}>
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
