'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import HomeCard from '../../components/HomeCard'
import { useApp } from '../../lib/store'
import { SlidersHorizontal, X, ChevronDown, MapPin } from 'lucide-react'
import { CHILE_REGIONS } from '../../lib/chile-locations'
import { getRandomBanner } from '../../lib/chile-banners'

const TYPES = ['Todos', 'Casa', 'Departamento', 'Cabaña', 'Estudio', 'Loft', 'Villa', 'Habitación']

function HomesContent() {
  const { homes, users } = useApp()
  const searchParams  = useSearchParams()
  const initialSearch = searchParams.get('search') || searchParams.get('location') || ''
  const [banner]      = useState(() => getRandomBanner())

  const [search,      setSearch]      = useState(initialSearch)
  const [type,        setType]        = useState('Todos')
  const [region,      setRegion]      = useState('Todas')
  const [minBeds,     setMinBeds]     = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [sort,        setSort]        = useState('rating')
  const [showSort,    setShowSort]    = useState(false)

  const filtered = homes.filter(h => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      (h.title  || '').toLowerCase().includes(q) ||
      (h.location || '').toLowerCase().includes(q) ||
      (h.city   || '').toLowerCase().includes(q) ||
      (h.comuna || '').toLowerCase().includes(q) ||
      (h.region || '').toLowerCase().includes(q)
    const matchType   = type === 'Todos' || h.type === type || h.subtype === type
    const matchRegion = region === 'Todas' || h.region === region
    const matchBeds   = (h.bedrooms || 0) >= minBeds
    return matchSearch && matchType && matchRegion && matchBeds
  })

  const sorted = [...filtered].sort((a, b) =>
    sort === 'rating'  ? (b.rating || 0) - (a.rating || 0) :
    sort === 'reviews' ? (b.review_count || b.reviewCount || 0) - (a.review_count || a.reviewCount || 0) : 0
  )

  const clear = () => { setSearch(''); setType('Todos'); setRegion('Todas'); setMinBeds(0) }
  const hasFilters = search || type !== 'Todos' || region !== 'Todas' || minBeds > 0
  const sortLabels = { rating: 'Mejor valorados', reviews: 'Más reseñas', newest: 'Más recientes' }

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      {/* Banner dinámico */}
      <div className="relative overflow-hidden" style={{ background: banner.color }}>
        <div className="absolute inset-0">
          <img src={banner.image} alt={banner.city} className="w-full h-full object-cover opacity-25" />
        </div>
        <div className="relative z-10 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-3 py-1 text-xs font-bold mb-3">
              {banner.emoji} {banner.tagline}
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Explorar hogares en Chile</h1>
            <p className="text-white/70 mb-6 text-sm">{banner.description}</p>
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 max-w-xl shadow-lg">
              <MapPin className="w-5 h-5 text-terra flex-shrink-0 ml-1" />
              <input type="text" placeholder="Ciudad, región o tipo de hogar..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-800 font-medium placeholder-gray-400" />
              {search && <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Chips tipo */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  type === t ? 'bg-forest text-white border-forest' : 'bg-white text-gray-600 border-gray-200 hover:border-forest/50 hover:text-forest'
                }`}>
                {t}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                showFilters ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}>
              <SlidersHorizontal className="w-4 h-4" /> Filtros
              {hasFilters && <span className="w-2 h-2 bg-terra rounded-full" />}
            </button>
            <div className="relative">
              <button onClick={() => setShowSort(!showSort)}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Región</label>
                <div className="relative">
                  <select value={region} onChange={e => setRegion(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-gray-50 appearance-none">
                    <option>Todas</option>
                    {CHILE_REGIONS.map(r => <option key={r.code} value={r.name}>{r.name}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Habitaciones mínimas</label>
                <div className="flex gap-2">
                  {[0,1,2,3].map(n => (
                    <button key={n} onClick={() => setMinBeds(n)}
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
            <span className="font-extrabold text-gray-900">{sorted.length}</span> hogares encontrados
            {search && <span className="text-terra"> para "{search}"</span>}
          </p>
          {hasFilters && <button onClick={clear} className="text-sm text-terra font-semibold flex items-center gap-1 hover:text-terra-dark"><X className="w-3.5 h-3.5" /> Limpiar</button>}
        </div>

        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sorted.map(h => <HomeCard key={h.id} home={h} user={users.find(u => u.id === (h.user_id || h.userId))} />)}
          </div>
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
