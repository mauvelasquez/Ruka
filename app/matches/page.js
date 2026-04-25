'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../lib/store'
import Navbar from '../../components/Navbar'
import { Search, Star, MapPin, Users, Calendar, ArrowLeftRight, Home, Zap, Info } from 'lucide-react'

function MatchCard({ result, myHomes, onRequest }) {
  const { home, owner, isPerfectMatch, ownerWish } = result
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState('')
  const [myHomeId, setMyHomeId] = useState(myHomes[0]?.id || '')
  const [sent, setSent] = useState(false)

  const handleSend = (e) => {
    e.preventDefault()
    onRequest({ toHomeId: home.id, toUserId: home.userId, fromHomeId: myHomeId, message: msg })
    setSent(true)
    setShowForm(false)
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
      isPerfectMatch ? 'border-forest/30 ring-2 ring-forest/10' : 'border-gray-100'}`}>
      {isPerfectMatch && (
        <div className="bg-forest px-4 py-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-white" />
          <span className="text-white text-xs font-black tracking-wide uppercase">Match perfecto bilateral</span>
          {ownerWish && (
            <span className="ml-auto text-green-200 text-xs">
              {owner?.name?.split(' ')[0]} también quiere ir a tu ciudad
            </span>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-xl bg-forest-50 flex items-center justify-center text-2xl flex-shrink-0">
            🏠
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-black text-gray-900 text-lg leading-tight">{home.title}</h3>
              <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                isPerfectMatch ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {isPerfectMatch ? '⭐ Perfecto' : 'Posible'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{home.city}, {home.country}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {home.maxGuests} huéspedes</span>
              <span className="flex items-center gap-1"><Home className="w-3.5 h-3.5" />{home.bedrooms} hab.</span>
            </div>
          </div>
        </div>

        {/* Owner */}
        <div className="mt-4 flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <div className="w-8 h-8 rounded-full bg-forest flex items-center justify-center text-white text-sm font-black flex-shrink-0">
            {owner?.name?.[0] || '?'}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{owner?.name}</p>
            <p className="text-xs text-gray-500">{owner?.city}, {owner?.country}</p>
          </div>
          <Link href={`/profile/${owner?.id}`} className="ml-auto text-xs text-forest font-bold hover:text-forest-dark">
            Ver perfil →
          </Link>
        </div>

        {/* Availability */}
        {home.availabilityPeriods?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {home.availabilityPeriods.map(p => (
              <span key={p.id} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                <Calendar className="w-3 h-3" />
                {new Date(p.start).toLocaleDateString('es-CL', { day:'numeric', month:'short' })} – {new Date(p.end).toLocaleDateString('es-CL', { day:'numeric', month:'short' })}
              </span>
            ))}
          </div>
        )}

        {home.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">{home.description}</p>
        )}

        {/* Action */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          {sent ? (
            <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
              <Star className="w-4 h-4" /> ¡Solicitud enviada!
            </div>
          ) : showForm ? (
            <form onSubmit={handleSend} className="space-y-3">
              {myHomes.length > 1 && (
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Tu hogar a ofrecer</label>
                  <select value={myHomeId} onChange={e => setMyHomeId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest">
                    {myHomes.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Mensaje (opcional)</label>
                <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={2} placeholder="Cuéntales sobre ti..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest resize-none" />
              </div>
              <div className="flex gap-2">
                <button type="submit"
                  className="flex-1 bg-forest text-white py-2 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
                  Enviar solicitud
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl font-bold text-sm text-gray-600 hover:text-gray-800">
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setShowForm(true)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                  isPerfectMatch
                    ? 'bg-forest text-white hover:bg-forest-dark'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <ArrowLeftRight className="w-4 h-4" />
                Solicitar intercambio
              </button>
              <Link href={`/homes/${home.id}`}
                className="px-4 py-2.5 rounded-xl font-bold text-sm bg-andean/10 text-andean hover:bg-andean/20 transition-colors">
                Ver hogar
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MatchesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentUser, homes, users, wishes, sendRequest } = useApp()

  const [city, setCity]     = useState(searchParams.get('city') || '')
  const [start, setStart]   = useState(searchParams.get('start') || '')
  const [end, setEnd]       = useState(searchParams.get('end') || '')
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 1)
  const [results, setResults] = useState(null)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (!currentUser) router.push('/auth/login')
  }, [currentUser])

  // Auto-search if params from URL
  useEffect(() => {
    if (searchParams.get('city') && searchParams.get('start') && searchParams.get('end')) {
      handleSearch()
    }
  }, [])

  if (!currentUser) return null

  const myHomes = homes.filter(h => h.userId === currentUser.id)
  const myCity  = currentUser.city || ''

  function datesOverlap(s1, e1, s2, e2) {
    return new Date(s1) <= new Date(e2) && new Date(e1) >= new Date(s2)
  }
  function homeIsAvailable(home, s, e) {
    return (home.availabilityPeriods || []).some(p => datesOverlap(p.start, p.end, s, e))
  }

  const handleSearch = (e) => {
    e?.preventDefault()
    if (!city || !start || !end) return

    const candidates = homes.filter(h =>
      h.userId !== currentUser.id &&
      h.maxGuests >= guests &&
      h.city.toLowerCase().includes(city.toLowerCase()) &&
      homeIsAvailable(h, start, end)
    )

    const matched = candidates.map(home => {
      const owner = users.find(u => u.id === home.userId)
      const ownerWishes = wishes.filter(w =>
        w.userId === home.userId &&
        w.toCity.toLowerCase().includes(myCity.toLowerCase()) &&
        datesOverlap(w.startDate, w.endDate, start, end)
      )
      return {
        home,
        owner,
        isPerfectMatch: ownerWishes.length > 0,
        ownerWish: ownerWishes[0] || null,
      }
    }).sort((a, b) => b.isPerfectMatch - a.isPerfectMatch)

    setResults(matched)
    setSearched(true)
  }

  const handleRequest = ({ toHomeId, toUserId, fromHomeId, message }) => {
    sendRequest({ toHomeId, toUserId, fromHomeId, message, startDate: start, endDate: end })
  }

  const perfect = (results || []).filter(r => r.isPerfectMatch)
  const possible = (results || []).filter(r => !r.isPerfectMatch)

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Buscar mi match</h1>
          <p className="text-gray-500">El algoritmo encuentra hogares disponibles y detecta si sus dueños también quieren visitar tu ciudad</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-1">
              <label className="block text-xs font-black text-gray-600 mb-1.5 uppercase tracking-wide">Ciudad destino</label>
              <input type="text" placeholder="Ej: Tokio, Pucón..." value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-600 mb-1.5 uppercase tracking-wide">Llegada</label>
              <input type="date" value={start} onChange={e => setStart(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-600 mb-1.5 uppercase tracking-wide">Salida</label>
              <input type="date" value={end} onChange={e => setEnd(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-600 mb-1.5 uppercase tracking-wide">Viajeros</label>
              <div className="flex gap-2">
                <input type="number" min="1" max="20" value={guests} onChange={e => setGuests(Number(e.target.value))}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                <button type="submit"
                  className="bg-forest text-white px-4 py-2.5 rounded-xl hover:bg-forest-dark transition-colors flex items-center gap-2 font-bold text-sm">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            Tu ciudad de origen: <strong className="text-forest">{myCity || 'no definida'}</strong> — se usa para detectar matches perfectos bilaterales
          </div>
        </form>

        {/* Explanation */}
        {!searched && (
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-forest/5 border border-forest/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-forest" />
                <h3 className="font-black text-forest">Match perfecto bilateral</h3>
              </div>
              <p className="text-sm text-gray-600">
                Cuando el dueño del hogar que te gusta <strong>también quiere visitar tu ciudad</strong> en fechas compatibles. ¡El intercambio ideal!
              </p>
            </div>
            <div className="bg-andean/5 border border-andean/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeftRight className="w-5 h-5 text-andean" />
                <h3 className="font-black text-andean">Match posible</h3>
              </div>
              <p className="text-sm text-gray-600">
                El hogar está disponible en tus fechas y tiene capacidad, pero el dueño aún no ha expresado interés en tu ciudad. Puedes contactarlos igual.
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {searched && results !== null && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-gray-900">
                {results.length === 0 ? 'Sin resultados' : `${results.length} hogar${results.length !== 1 ? 'es' : ''} encontrado${results.length !== 1 ? 's' : ''}`}
              </h2>
              {results.length > 0 && (
                <span className="text-sm text-gray-500">
                  {perfect.length} perfecto{perfect.length !== 1 ? 's' : ''} · {possible.length} posible{possible.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-black text-gray-700 text-lg mb-2">Sin hogares disponibles</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                  Intenta cambiar las fechas, el destino o el número de viajeros. También puedes ampliar tu búsqueda a ciudades cercanas.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {perfect.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-forest" />
                      <h3 className="font-black text-forest text-lg">Matches perfectos</h3>
                      <span className="bg-forest text-white text-xs font-black px-2 py-0.5 rounded-full">{perfect.length}</span>
                    </div>
                    <div className="grid gap-4">
                      {perfect.map(r => (
                        <MatchCard key={r.home.id} result={r} myHomes={myHomes} onRequest={handleRequest} />
                      ))}
                    </div>
                  </div>
                )}
                {possible.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowLeftRight className="w-5 h-5 text-andean" />
                      <h3 className="font-black text-andean text-lg">Matches posibles</h3>
                      <span className="bg-andean text-white text-xs font-black px-2 py-0.5 rounded-full">{possible.length}</span>
                    </div>
                    <div className="grid gap-4">
                      {possible.map(r => (
                        <MatchCard key={r.home.id} result={r} myHomes={myHomes} onRequest={handleRequest} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MatchesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Buscando matches...</p>
        </div>
      </div>
    }>
      <MatchesContent />
    </Suspense>
  )
}
