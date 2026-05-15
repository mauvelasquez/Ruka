'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../lib/store'
import Navbar from '../../components/Navbar'
import MessageThread from '../../components/MessageThread'
import {
  Home, Heart, ArrowLeftRight, Plus, MapPin, Users, Calendar,
  CheckCircle, XCircle, Clock, Trash2, Eye, Star, Sparkles, AlertCircle, ScrollText, MessageSquare
} from 'lucide-react'
import { COMUNAS_RUKKA } from '../../lib/comunas'

const TAB = { WISHES: 'wishes', HOMES: 'homes', RECEIVED: 'received', SENT: 'sent' }

const CHILE_CITIES = COMUNAS_RUKKA

function StatusBadge({ status }) {
  const map = {
    pending:  { label: 'Pendiente', cls: 'bg-amber-100 text-amber-700',  icon: Clock },
    accepted: { label: 'Aceptada',  cls: 'bg-green-100 text-green-700', icon: CheckCircle },
    rejected: { label: 'Rechazada', cls: 'bg-red-100 text-red-700',     icon: XCircle },
  }
  const { label, cls, icon: Icon } = map[status] || map.pending
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${cls}`}>
      <Icon className="w-3 h-3" />{label}
    </span>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { currentUser, ready, homes, users, wishes, requests, addWish, removeWish, updateRequest, removeHome, syncSession } = useApp()
  const [tab, setTab] = useState(TAB.WISHES)
  const [wishForm, setWishForm] = useState({ toCity: '', startDate: '', endDate: '', guests: 2 })
  const [showWishForm, setShowWishForm] = useState(false)
  const [loadingError, setLoadingError] = useState(false)
  const [showNoHomeAlert, setShowNoHomeAlert] = useState(false)
  const [activeThread, setActiveThread] = useState(null) // { requestId, otherUser }

  useEffect(() => {
    if (ready) return
    const timer = setTimeout(() => {
      setLoadingError(true)
      syncSession()
    }, 8000)
    return () => clearTimeout(timer)
  }, [ready])

  useEffect(() => {
    if (!ready) return
    if (!currentUser) router.push('/auth/login')
    // status===null significa que el perfil aún está cargando — no redirigir todavía
    else if (currentUser.status && currentUser.status !== 'confirmed') router.push('/onboarding')
  }, [currentUser, ready])

  // Mostrar loading mientras el store inicializa
  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
      {loadingError ? (
        <div className="text-center px-4">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <p className="text-gray-700 font-bold mb-1">Error de conexión</p>
          <p className="text-gray-400 text-sm mb-4">No se pudo cargar la sesión. Verifica tu conexión a internet.</p>
          <button onClick={() => window.location.reload()}
            className="bg-forest text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
            Reintentar
          </button>
        </div>
      ) : (
        <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  )

  // Mientras el redirect a login ocurre, mostrar spinner en vez de blank page
  if (!currentUser) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const myHomes  = homes.filter(h => h.userId === currentUser.id)
  const myWishes = wishes.filter(w => w.userId === currentUser.id)
  const received = requests.filter(r => r.toUserId === currentUser.id)
  const sent     = requests.filter(r => r.fromUserId === currentUser.id)

  const handleAddWish = async (e) => {
    e.preventDefault()
    if (!wishForm.toCity || !wishForm.startDate || !wishForm.endDate) return
    if (myHomes.length === 0) {
      setShowWishForm(false)
      setShowNoHomeAlert(true)
      return
    }
    await addWish({
      toCity: wishForm.toCity,
      startDate: wishForm.startDate,
      endDate: wishForm.endDate,
      guests: Number(wishForm.guests),
      neededCapacity: Number(wishForm.guests),
    })
    setWishForm({ toCity: '', startDate: '', endDate: '', guests: 2 })
    setShowWishForm(false)
  }

  const tabs = [
    { id: TAB.WISHES,   label: 'Quiero viajar', icon: Heart,          count: myWishes.length },
    { id: TAB.HOMES,    label: 'Mis hogares',   icon: Home,           count: myHomes.length },
    { id: TAB.RECEIVED, label: 'Recibidas',     icon: ArrowLeftRight, count: received.length },
    { id: TAB.SENT,     label: 'Enviadas',      icon: ArrowLeftRight, count: sent.length },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Mi panel</h1>
            <p className="text-gray-500 mt-1">Bienvenido, {currentUser.name?.split(' ')[0]} 👋</p>
          </div>
          <div className="flex items-center gap-2">
            {currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
              <Link href="/dashboard/logs"
                className="bg-gray-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-700 transition-colors flex items-center gap-2">
                <ScrollText className="w-4 h-4" /> Logs
              </Link>
            )}
            <Link href="/matches"
              className="bg-terra text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-terra-dark transition-colors flex items-center gap-2">
              <Star className="w-4 h-4" /> Buscar match
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Deseos de viaje', value: myWishes.length, color: 'bg-andean text-white', icon: Heart,          tabId: TAB.WISHES },
            { label: 'Hogares',         value: myHomes.length,  color: 'bg-forest text-white', icon: Home,           tabId: TAB.HOMES },
            { label: 'Recibidas',       value: received.length, color: 'bg-terra text-white',  icon: ArrowLeftRight, tabId: TAB.RECEIVED },
            { label: 'Enviadas',        value: sent.length,     color: 'bg-gray-700 text-white',icon: ArrowLeftRight, tabId: TAB.SENT },
          ].map((s, i) => (
            <div key={i} className={`${s.color} rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity`}
              onClick={() => setTab(s.tabId)}>
              <s.icon className="w-6 h-6 opacity-80" />
              <div>
                <p className="text-2xl font-black">{s.value}</p>
                <p className="text-xs opacity-80">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA si no tiene hogar */}
        {myHomes.length === 0 && (
          <div className="bg-gradient-to-r from-forest to-forest-dark rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center gap-4 mb-6 shadow-md">
            <div className="flex-1">
              <p className="font-black text-base mb-1">🏠 Aún no tienes un hogar registrado</p>
              <p className="text-white/80 text-sm">Publica tu hogar para poder intercambiar y encontrar matches.</p>
            </div>
            <Link href="/dashboard/property/new"
              className="flex-shrink-0 bg-white text-forest-dark font-black px-5 py-2.5 rounded-xl text-sm hover:bg-sand transition-colors flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" /> Publicar mi hogar
            </Link>
          </div>
        )}

        {/* Quiero viajar hero */}
        {tab === TAB.WISHES && myWishes.length === 0 && !showWishForm && (
          <div className="bg-gradient-to-br from-andean to-blue-700 rounded-3xl p-8 text-white text-center mb-6 shadow-lg">
            <div className="text-5xl mb-4">🗺️</div>
            <h2 className="text-2xl font-black mb-2">¿Cuándo te gustaría ir de vacaciones?</h2>
            <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
              Dinos a qué ciudad quieres viajar y el algoritmo Rukka buscará tu match perfecto.
            </p>
            <button onClick={() => setShowWishForm(true)}
              className="bg-white text-andean font-black px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto">
              <Plus className="w-5 h-5" /> Agregar mi primer destino
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 mb-6 shadow-sm border border-gray-100">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t.id ? 'bg-forest text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
              {t.count > 0 && (
                <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center ${
                  tab === t.id ? 'bg-white/20' : 'bg-gray-100'}`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB: QUIERO VIAJAR ── */}
        {tab === TAB.WISHES && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-gray-800 text-lg">¿Cuándo te gustaría ir de vacaciones?</h2>
              <button onClick={() => { setShowWishForm(!showWishForm); setShowNoHomeAlert(false) }}
                className="flex items-center gap-1.5 bg-andean text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" /> Nuevo destino
              </button>
            </div>

            {showNoHomeAlert && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 text-sm mb-1">Necesitas agregar tu propiedad primero</p>
                  <p className="text-amber-700 text-xs mb-2">Para ingresar un destino de viaje, primero debes publicar tu hogar en Rukka.</p>
                  <Link href="/dashboard/property/new"
                    className="inline-flex items-center gap-1.5 bg-forest text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-forest-dark transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Agregar mi propiedad
                  </Link>
                </div>
              </div>
            )}

            {showWishForm && (
              <form onSubmit={handleAddWish} className="bg-white rounded-2xl p-6 border-2 border-andean/30 shadow-md mb-5">
                <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-andean" /> Añadir destino deseado
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                      ¿A qué ciudad de Chile quieres ir?
                    </label>
                    <input list="cities-dash" type="text" placeholder="ej. Pichilemu, Puerto Varas, Zapallar..."
                      value={wishForm.toCity} onChange={e => setWishForm({...wishForm, toCity: e.target.value})}
                      className="w-full border-2 border-gray-200 focus:border-andean rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
                    <datalist id="cities-dash">
                      {CHILE_CITIES.map(c => <option key={c} value={c} />)}
                    </datalist>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Desde</label>
                      <input type="date" value={wishForm.startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setWishForm({...wishForm, startDate: e.target.value})}
                        className="w-full border-2 border-gray-200 focus:border-andean rounded-xl px-3 py-2.5 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Hasta</label>
                      <input type="date" value={wishForm.endDate}
                        min={wishForm.startDate || new Date().toISOString().split('T')[0]}
                        onChange={e => setWishForm({...wishForm, endDate: e.target.value})}
                        className="w-full border-2 border-gray-200 focus:border-andean rounded-xl px-3 py-2.5 text-sm outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">¿Cuántas personas?</label>
                    <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-2.5">
                      <button type="button" onClick={() => setWishForm(f => ({...f, guests: Math.max(1, f.guests - 1)}))}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-gray-700 flex items-center justify-center text-lg">−</button>
                      <span className="flex-1 text-center font-black text-gray-900">{wishForm.guests} {wishForm.guests === 1 ? 'persona' : 'personas'}</span>
                      <button type="button" onClick={() => setWishForm(f => ({...f, guests: Math.min(20, f.guests + 1)}))}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-gray-700 flex items-center justify-center text-lg">+</button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button type="submit"
                    className="flex-1 bg-andean text-white px-5 py-3 rounded-xl font-black text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" /> Guardar y buscar matches
                  </button>
                  <button type="button" onClick={() => setShowWishForm(false)}
                    className="px-5 py-3 rounded-xl font-bold text-sm text-gray-500 hover:text-gray-700 border border-gray-200">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {myWishes.length > 0 && (
              <div className="grid gap-3">
                {myWishes.map(w => (
                  <div key={w.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-andean/10 flex items-center justify-center flex-shrink-0 text-2xl">🗺️</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-gray-900 text-lg">{w.toCity}</p>
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-forest" />
                              {w.startDate} → {w.endDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-andean" />
                              {w.neededCapacity} viajero{w.neededCapacity !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href={`/matches?city=${encodeURIComponent(w.toCity)}&start=${w.startDate}&end=${w.endDate}&guests=${w.neededCapacity}`}
                          className="flex items-center gap-1.5 text-xs font-black text-white bg-andean hover:bg-blue-700 px-3 py-2 rounded-xl transition-colors">
                          <Star className="w-3.5 h-3.5" /> Ver matches
                        </Link>
                        <button onClick={() => removeWish(w.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: MIS HOGARES ── */}
        {tab === TAB.HOMES && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-gray-800 text-lg">Mis hogares registrados</h2>
              <Link href="/dashboard/property/new"
                className="flex items-center gap-1.5 bg-forest text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
                <Plus className="w-4 h-4" /> Añadir hogar
              </Link>
            </div>
            {myHomes.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200">
                <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-900 font-black text-base mb-1">Aún no tienes hogares registrados</p>
                <p className="text-gray-400 text-sm mb-2">¿Tienes una propiedad en Airbnb? Impórtala en un clic e intercámbiala con otros usuarios de Rukka.</p>
                <p className="text-gray-400 text-xs mb-6">O publica tu hogar manualmente en menos de 5 minutos.</p>
                <Link href="/dashboard/property/new"
                  className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
                  <Plus className="w-4 h-4" /> Publicar mi primer hogar
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {myHomes.map(home => (
                  <div key={home.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-forest-50 flex-shrink-0">
                      {home.images?.[0]
                        ? <img src={home.images[0]} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-gray-900 text-lg leading-tight">{home.title}</h3>
                        <div className="flex gap-2 flex-shrink-0">
                          <Link href={`/dashboard/property/${home.id}`}
                            className="p-1.5 text-gray-400 hover:text-forest transition-colors" title="Editar">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => removeHome(home.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{home.comuna || home.city}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Máx {home.maxGuests}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: RECIBIDAS ── */}
        {tab === TAB.RECEIVED && (
          <div>
            <h2 className="font-black text-gray-800 text-lg mb-4">Solicitudes recibidas</h2>
            {received.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200">
                <ArrowLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Aún no has recibido solicitudes</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {received.map(req => {
                  const fromHome  = homes.find(h => h.id === req.fromHomeId)
                  const fromUser  = users.find(u => u.id === req.fromUserId)
                  const isActive  = activeThread?.requestId === req.id
                  return (
                    <div key={req.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-black text-gray-900 text-base">{fromHome?.title || 'Hogar'}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />{fromHome?.city}
                          </p>
                        </div>
                        <StatusBadge status={req.status} />
                      </div>
                      {req.message && (
                        <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 mb-3 italic">"{req.message}"</div>
                      )}
                      {req.status === 'pending' && (
                        <div className="flex gap-3">
                          <button onClick={() => updateRequest(req.id, 'accepted')}
                            className="flex-1 bg-forest text-white py-2 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors flex items-center justify-center gap-1.5">
                            <CheckCircle className="w-4 h-4" /> Aceptar
                          </button>
                          <button onClick={() => updateRequest(req.id, 'rejected')}
                            className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5">
                            <XCircle className="w-4 h-4" /> Rechazar
                          </button>
                        </div>
                      )}
                      {req.status === 'accepted' && (
                        <>
                          <button
                            onClick={() => setActiveThread(isActive ? null : { requestId: req.id, otherUser: fromUser })}
                            className="mt-2 flex items-center gap-1.5 text-sm font-bold text-forest hover:text-forest-dark transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            {isActive ? 'Cerrar mensajes' : '💬 Mensajes'}
                          </button>
                          {isActive && (
                            <div className="mt-3">
                              <MessageThread
                                requestId={req.id}
                                otherUser={fromUser}
                                onClose={() => setActiveThread(null)}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: ENVIADAS ── */}
        {tab === TAB.SENT && (
          <div>
            <h2 className="font-black text-gray-800 text-lg mb-4">Solicitudes enviadas</h2>
            {sent.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200">
                <ArrowLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium mb-2">Aún no has enviado solicitudes</p>
                <Link href="/matches" className="mt-2 inline-flex items-center gap-1.5 text-forest font-bold text-sm">
                  <Star className="w-4 h-4" /> Buscar mi match perfecto
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {sent.map(req => {
                  const toHome   = homes.find(h => h.id === req.toHomeId)
                  const toUser   = users.find(u => u.id === req.toUserId)
                  const isActive = activeThread?.requestId === req.id
                  return (
                    <div key={req.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-black text-gray-900 text-base">{toHome?.title || 'Hogar'}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />{toHome?.city}
                          </p>
                        </div>
                        <StatusBadge status={req.status} />
                      </div>
                      {req.status === 'accepted' && (
                        <>
                          <button
                            onClick={() => setActiveThread(isActive ? null : { requestId: req.id, otherUser: toUser })}
                            className="mt-3 flex items-center gap-1.5 text-sm font-bold text-forest hover:text-forest-dark transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            {isActive ? 'Cerrar mensajes' : '💬 Mensajes'}
                          </button>
                          {isActive && (
                            <div className="mt-3">
                              <MessageThread
                                requestId={req.id}
                                otherUser={toUser}
                                onClose={() => setActiveThread(null)}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
