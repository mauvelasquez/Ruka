'use client'
import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import HomeCard from '../../components/HomeCard'
import { SlidersHorizontal, X, ChevronDown, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { COMUNAS_RUKKA } from '../../lib/comunas'
import { getRandomBanner } from '../../lib/chile-banners'
import { analytics } from '../../lib/analytics'
import { COUNTRIES, getRegions, getCities } from '../../lib/geo/latam'
import { useApp } from '../../lib/store'
import { useCountry } from '../../hooks/useCountry'
import { curateHomesForUser } from '../../lib/editorial'

const TYPES = ['Todos', 'Casa', 'Departamento', 'Cabaña', 'Estudio', 'Loft', 'Villa', 'Habitación']
const LIMIT = 24

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="h-48 bg-forest-50" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-forest-50 rounded w-3/4" />
        <div className="h-3 bg-forest-50 rounded w-1/2" />
        <div className="h-3 bg-forest-50 rounded w-1/3" />
      </div>
    </div>
  )
}

function HomesContent() {
  const searchParams  = useSearchParams()
  const initialSearch = searchParams.get('search') || searchParams.get('location') || ''
  const [banner]      = useState(() => getRandomBanner())

  const { user }       = useApp()
  const { country: ipCountry } = useCountry()
  const displayFrom    = user?.country_code ?? ipCountry ?? 'CL'
  const userCity       = user?.city ?? ''

  const [search,      setSearch]      = useState(initialSearch)
  // geo: default to user's country; URL param overrides (allows cross-country browsing)
  const hasUrlCountry = !!searchParams.get('country')
  const [country,     setCountry]     = useState(searchParams.get('country') || displayFrom)
  const [type,        setType]        = useState('Todos')
  const [region,      setRegion]      = useState('Todas')
  const [city,        setCity]        = useState('Todas')
  const [minBeds,     setMinBeds]     = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [sort,        setSort]        = useState('rating')
  const [showSort,    setShowSort]    = useState(false)

  const [homes,       setHomes]       = useState([])
  const [total,       setTotal]       = useState(0)
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)
  const [loading,     setLoading]     = useState(true)

  const fetchHomes = useCallback(async (currentPage = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page:    String(currentPage),
        limit:   String(LIMIT),
        sort,
        ...(search    && { search }),
        ...(country   && { country }),
        ...(type !== 'Todos'  && { type }),
        ...(region !== 'Todas' && { region }),
        ...(city !== 'Todas'  && { city }),
        ...(minBeds > 0 && { minBeds: String(minBeds) }),
      })
      const res  = await fetch(`/api/homes?${params}`)
      const json = await res.json()
      setHomes(json.data || [])
      setTotal(json.total || 0)
      setTotalPages(json.totalPages || 1)
      setPage(json.page || 1)
    } catch (err) {
      console.error('fetchHomes error:', err)
    } finally {
      setLoading(false)
    }
  }, [search, country, type, region, city, minBeds, sort])

  // Debounce para el campo de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchHomes(1)
      if (search) analytics.homesSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, country, type, region, city, minBeds, sort])

  // geo: sync country filter when user's detected country resolves (no URL override)
  useEffect(() => {
    if (!hasUrlCountry && displayFrom) setCountry(displayFrom)
  }, [displayFrom, hasUrlCountry])

  const clear = () => {
    setSearch('')
    setCountry(displayFrom)
    setType('Todos')
    setRegion('Todas')
    setCity('Todas')
    setMinBeds(0)
    setPage(1)
  }
  const hasFilters = search || country || type !== 'Todos' || region !== 'Todas' || city !== 'Todas' || minBeds > 0

  const selectedCountry = COUNTRIES.find(c => c.code === country)
  const latamRegions    = country ? getRegions(country) : []
  const latamCities     = (country && region !== 'Todas') ? getCities(country, region) : []
  const sortLabels = { rating: 'Mejor valorados', reviews: 'Más reseñas', newest: 'Más recientes' }

  const curatedHomes = useMemo(
    () => curateHomesForUser(homes, displayFrom, userCity),
    [homes, displayFrom, userCity]
  )

  const goToPage = (p) => {
    setPage(p)
    fetchHomes(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      {/* Banner dinámico */}
      <div className="relative overflow-hidden" style={{ background: banner.color }}>
        <div className="absolute inset-0">
          <img src={banner.image} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="relative z-10 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-3 py-1 text-xs font-bold mb-3">
              {banner.emoji} {banner.tagline}
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-1">
            {selectedCountry
              ? `Hogares en ${selectedCountry.flag} ${selectedCountry.name}`
              : 'Explorar hogares en Latinoamérica'}
          </h1>
            <p className="text-white/70 mb-6 text-sm">{banner.description}</p>
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 max-w-xl shadow-lg">
              <MapPin className="w-5 h-5 text-terra flex-shrink-0 ml-1" />
              <input type="text" placeholder="Ciudad, región o tipo de hogar..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-800 font-medium placeholder-gray-400" />
              {search && <button onClick={() => setSearch('')} aria-label="Limpiar búsqueda" className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Chips tipo */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {TYPES.map(t => (
              <button key={t} onClick={() => { setType(t); if (t !== 'Todos') analytics.homesFilterType(t) }}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  type === t ? 'bg-forest text-white border-forest' : 'bg-white text-gray-600 border-gray-200 hover:border-forest/50 hover:text-forest'
                }`}>
                {t}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)}
              aria-label={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
              aria-expanded={showFilters}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                showFilters ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}>
              <SlidersHorizontal className="w-4 h-4" /> Filtros
              {hasFilters && <span className="w-2 h-2 bg-terra rounded-full" />}
            </button>
            <div className="relative">
              <button onClick={() => setShowSort(!showSort)}
                aria-label="Ordenar resultados"
                aria-expanded={showSort}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:border-gray-300 transition-colors">
                {sortLabels[sort]} <ChevronDown className="w-4 h-4" />
              </button>
              {showSort && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20">
                  {Object.entries(sortLabels).map(([k, l]) => (
                    <button key={k} onClick={() => { setSort(k); setShowSort(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm ${sort === k ? 'text-forest font-bold bg-forest-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* País */}
              <div>
                <label htmlFor="homes-filter-country" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">País</label>
                <div className="relative">
                  <select id="homes-filter-country" value={country} onChange={e => { setCountry(e.target.value); setRegion('Todas'); setCity('Todas') }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-gray-50 appearance-none">
                    <option value="">Todos los países</option>
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Localidad: usa LATAM si hay país seleccionado, sino COMUNAS Chile */}
              <div>
                <label htmlFor="homes-filter-locality" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  {country && country !== 'CL' ? (COUNTRIES.find(c=>c.code===country)?.code === 'MX' ? 'Estado' : country === 'AR' ? 'Provincia' : 'Región') : 'Localidad'}
                </label>
                <div className="relative">
                  {country && country !== 'CL' ? (
                    <select id="homes-filter-locality" value={region} onChange={e => { setRegion(e.target.value); setCity('Todas') }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-gray-50 appearance-none">
                      <option value="Todas">Todas</option>
                      {latamRegions.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
                    </select>
                  ) : (
                    <select id="homes-filter-locality" value={city} onChange={e => { setCity(e.target.value); if (e.target.value !== 'Todas') analytics.homesFilterCity(e.target.value) }}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-gray-50 appearance-none">
                      <option value="Todas">Todas las localidades</option>
                      {COMUNAS_RUKKA.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  )}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Habitaciones */}
              <div>
                <label id="homes-filter-beds-label" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Habitaciones mínimas</label>
                <div className="flex gap-2" role="group" aria-labelledby="homes-filter-beds-label">
                  {[0,1,2,3].map(n => (
                    <button key={n} onClick={() => { setMinBeds(n); if (n > 0) analytics.homesFilterBeds(n) }}
                      className={`w-11 h-10 rounded-xl border text-sm font-bold transition-colors ${
                        minBeds === n ? 'bg-forest text-white border-forest' : 'border-gray-200 text-gray-600 hover:border-forest/50'
                      }`}>
                      {n === 0 ? 'T' : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              {hasFilters && (
                <div className="flex items-end">
                  <button onClick={clear} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-semibold">
                    <X className="w-4 h-4" /> Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <p className="text-gray-600 text-sm">
            <span className="font-extrabold text-gray-900">{loading ? '…' : total}</span> hogares encontrados
            {search && <span className="text-terra"> para "{search}"</span>}
          </p>
          {hasFilters && <button onClick={clear} className="text-sm text-terra font-semibold flex items-center gap-1 hover:text-terra-dark"><X className="w-3.5 h-3.5" /> Limpiar</button>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : homes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {curatedHomes.map(h => <HomeCard key={h.id} home={h} />)}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-forest hover:text-forest disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                <span className="text-sm text-gray-500 font-medium">
                  Página <span className="font-extrabold text-gray-900">{page}</span> de <span className="font-extrabold text-gray-900">{totalPages}</span>
                </span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-forest hover:text-forest disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Sin resultados</h3>
            <p className="text-gray-500 mb-6 text-sm">Prueba con otro destino o quita algunos filtros</p>
            <button onClick={clear} className="bg-forest text-white px-6 py-3 rounded-xl font-semibold hover:bg-forest-dark transition-colors text-sm">
              Ver todos los hogares
            </button>
          </div>
        )}
      </div>
      {showSort && <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />}
      <Footer />
    </div>
  )
}

export default function HomesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" /></div>}>
      <HomesContent />
    </Suspense>
  )
}
