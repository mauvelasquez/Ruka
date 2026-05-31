'use client'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomeCard from '../components/HomeCard'
import FeaturedHomeCard from '../components/FeaturedHomeCard'
import { useApp } from '../lib/store'
import { supabase } from '../lib/supabase'
import { COUNTRIES } from '../lib/geo/latam'
import { getDestinations, DESTINATIONS } from '../lib/geo/destinations'
import { useCountry } from '../hooks/useCountry'
import { getRandomCountryBanner } from '../lib/country-banners'
import { ArrowRight, Zap, Gift } from 'lucide-react'
import { curateHomesForUser } from '../lib/editorial'
import { openPublicarModal } from '../components/PublicarModal'

const FresiaSearchModule = dynamic(() => import('../components/FresiaSearchModule'), {
  ssr: false,
  loading: () => <div className="h-[72px] w-full max-w-2xl mx-auto rounded-2xl bg-white/10 animate-pulse" />,
})

const COUNTRY_CONFIG = {
  CL: { region: 'Chile', peers: 'distintas regiones de Chile', badge: 'Viaja por Chile' },
  default: { region: 'Chile', peers: 'distintas regiones de Chile', badge: 'Viaja por Chile' },
}

// ── AD BANNER ─────────────────────────────────────────────────────────────────
function AdBanner({ variant = 'primary', className = '', heroBanner = null }) {
  const variants = {
    primary: {
      bg: 'bg-gradient-to-r from-forest to-forest-dark',
      title: 'Viaja por Chile sin gastar en alojamiento',
      desc: 'Intercambia tu hogar y vive como local en cualquier ciudad. Sin intermediarios, sin costos ocultos.',
      cta: 'Publicar mi hogar',
      icon: Gift,
    },
    secondary: {
      bg: 'bg-gradient-to-r from-terra to-amber-700',
      badge: '✦ MATCH AUTOMÁTICO',
      title: `¿Quieres ir a ${heroBanner?.city ?? 'tu próximo destino'}? Hay alguien que quiere venir a tu ciudad`,
      desc: 'El algoritmo Rukka conecta viajeros que se quieren visitar mutuamente en fechas compatibles.',
      cta: 'Buscar mi match',
      icon: Zap,
    },
  }
  const v = variants[variant]
  const Icon = v.icon

  return (
    <div className={`${v.bg} rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center gap-4 shadow-lg ${className}`}>
      <div className="flex-1">
        {v.badge && (
          <span className="inline-block bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full mb-3">{v.badge}</span>
        )}
        <h3 className="font-black text-lg sm:text-xl mb-1 leading-tight">{v.title}</h3>
        <p className="text-white/80 text-sm">{v.desc}</p>
      </div>
      <button
        onClick={openPublicarModal}
        className="flex-shrink-0 bg-white text-forest-dark font-black px-5 py-3 rounded-xl text-sm hover:bg-sand transition-colors flex items-center gap-2 whitespace-nowrap">
        <Icon className="w-4 h-4" /> {v.cta}
      </button>
    </div>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()
  const { homes, users, user } = useApp()
  const [exploringFrom, setExploringFrom] = useState(null)

  const [heroBanner,    setHeroBanner]    = useState(null)

  const { country: userCountry } = useCountry()
  const geoConfig      = COUNTRY_CONFIG[userCountry] ?? COUNTRY_CONFIG.default
  const displayCountry = exploringFrom ?? user?.country_code ?? userCountry ?? 'CL'
  const destData       = getDestinations(displayCountry)
  const userCity       = user?.city ?? ''

  // geo: show local featured homes first, fill with others only if not enough local
  const featured = useMemo(() => {
    const localHomes = homes
      .filter(h => h.featured && h.country_code === displayCountry)
      .sort((a, b) => (a.is_example ? 1 : 0) - (b.is_example ? 1 : 0))
    if (localHomes.length >= 3) return curateHomesForUser(localHomes, displayCountry, userCity).slice(0, 3)
    const fallback = homes.filter(h => h.featured && h.country_code !== displayCountry)
    return curateHomesForUser([...localHomes, ...fallback], displayCountry, userCity).slice(0, 3)
  }, [homes, displayCountry, userCity])

  // Redirect OAuth errors that Supabase sends to the site root
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const errorCode = params.get('error_code')
    if (errorCode === 'bad_oauth_state') {
      router.replace('/auth/login?error=session_expired')
    } else if (params.get('error')) {
      router.replace('/auth/login?error=auth_error')
    }
  }, [router])

  // geo: pick banner from user's country on first render, update if country changes
  useEffect(() => {
    setHeroBanner(getRandomCountryBanner(displayCountry))
  }, [displayCountry])


  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      {/* ── HERO con banner dinámico ──────────────────────────────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroBanner && (
            <img src={heroBanner.image} alt={`Vista panorámica de ${heroBanner.city}`} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 hero-rukka" aria-hidden="true" />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center gap-6 overflow-y-auto h-full justify-center">
          <div className="text-center">
            {heroBanner && (
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white rounded-full px-4 py-2 text-sm font-medium mb-4">
                <span>{heroBanner.emoji}</span>
                <span>{heroBanner.tagline}</span>
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-2">
              El hogar de {geoConfig.region}<br />
              <span className="text-sand">está lleno de puertas abiertas.</span>
            </h1>
            <p className="text-base text-sand/90 font-medium leading-relaxed max-w-lg mx-auto">
              Intercambia tu casa con viajeros de {geoConfig.peers}.<br className="hidden sm:block" /> Cuenta gratuita, matching automático, identidad verificada.
            </p>
          </div>

          <FresiaSearchModule />

          <div className="flex flex-wrap gap-3 justify-center text-white/80 text-sm">
            {[`✓ ${geoConfig.badge}`, '✓ Cuenta gratuita', '✓ Identidad verificada'].map(t => (
              <span key={t} className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTACADOS — local-first por país ────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terra mb-1">✦ Destacados</p>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Hogares destacados en {geoConfig.region}
              </h2>
            </div>
            {featured.length > 0 && (
              <Link href={`/homes?country=${displayCountry}`} className="hidden sm:flex items-center gap-2 text-forest font-semibold text-sm hover:text-forest-dark">
                Ver todos <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(h => (
                <HomeCard key={h.id} home={h} user={users.find(u => u.id === h.userId)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-forest/20 rounded-2xl">
              <p className="text-4xl mb-4">🏠</p>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Sé el primero en publicar tu hogar en {geoConfig.region}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
                Estamos creciendo en tu país. Publica tu hogar y conecta con viajeros de {geoConfig.peers}.
              </p>
              <button
                onClick={openPublicarModal}
                className="inline-flex items-center gap-2 bg-forest text-white font-bold px-6 py-3 rounded-full hover:bg-forest-dark transition-colors">
                Publicar mi hogar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── BANNER 1 ─────────────────────────────────────────────────────────── */}
      <section className="py-8 bg-white border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdBanner variant="primary" />
          {/* Yankis welcome callout */}
          <div className="mt-4 flex items-center gap-3 bg-terra/10 border border-terra/20 rounded-2xl px-5 py-3.5">
            <span className="text-2xl leading-none flex-shrink-0">🪙</span>
            <p className="text-terra font-semibold text-sm sm:text-base">
              <span className="font-black">Regístrate hoy</span> y recibe{' '}
              <span className="font-black">3 Yankis de bienvenida</span> = 3 noches de alojamiento gratis
            </p>
            <button
              onClick={openPublicarModal}
              className="flex-shrink-0 ml-auto bg-terra text-white text-xs sm:text-sm font-black px-4 py-2 rounded-xl hover:bg-terra-dark transition-colors whitespace-nowrap hidden sm:block">
              Crear cuenta gratis
            </button>
          </div>
        </div>
      </section>


      {/* ── 4 PAÍSES LATAM ───────────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: '#F8F4EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terra mb-1">🇨🇱 Destinos Chile</p>
              <h2 className="text-2xl font-extrabold text-gray-900">¿A qué rincón de Chile quieres ir?</h2>
            </div>
            <Link href="/homes" className="text-forest font-semibold text-sm hover:text-forest-dark flex items-center gap-1">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Destinos por región */}
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-1">{destData.badgeLabel}</p>
            <h3 className="text-lg font-extrabold text-gray-900 mb-4">{destData.sectionTitle}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {destData.cities.map(b => (
              <Link key={b.id} href={`/homes?search=${encodeURIComponent(b.city)}`}
                className="group relative rounded-2xl overflow-hidden h-32 block shadow-sm hover:shadow-md transition-shadow" style={{ background: 'linear-gradient(135deg, #2A5C45 0%, #3d7a5e 100%)' }}>
                <img src={b.image} alt={`${b.tipo} en ${b.city}`} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => { e.currentTarget.style.display = 'none' }} />
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

      <Footer />
    </div>
  )
}
