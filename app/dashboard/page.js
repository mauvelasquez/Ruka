'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../lib/store'
import Navbar from '../../components/Navbar'
import {
  Home, Heart, ArrowLeftRight, Plus, MapPin, Users, Calendar,
  CheckCircle, XCircle, Clock, Trash2, Eye, Star
} from 'lucide-react'

const TAB = { HOMES: 'homes', WISHES: 'wishes', RECEIVED: 'received', SENT: 'sent' }

function StatusBadge({ status }) {
  const map = {
    pending:  { label: 'Pendiente',  cls: 'bg-amber-100 text-amber-700',  icon: Clock },
    accepted: { label: 'Aceptada',   cls: 'bg-green-100 text-green-700',  icon: CheckCircle },
    rejected: { label: 'Rechazada',  cls: 'bg-red-100 text-red-700',      icon: XCircle },
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
  const { currentUser, homes, wishes, requests, addWish, removeWish, updateRequest, removeHome } = useApp()
  const [tab, setTab] = useState(TAB.HOMES)
  const [wishForm, setWishForm] = useState({ toCity: '', startDate: '', endDate: '', guests: 1 })
  const [showWishForm, setShowWishForm] = useState(false)

  useEffect(() => {
    if (!currentUser) router.push('/auth/login')
  }, [currentUser])

  if (!currentUser) return null

  const myHomes    = homes.filter(h => h.userId === currentUser.id)
  const myWishes   = wishes.filter(w => w.userId === currentUser.id)
  const received   = requests.filter(r => r.toUserId === currentUser.id || r.receiverId === currentUser.id)
  const sent       = requests.filter(r => r.fromUserId === currentUser.id || r.proposerId === currentUser.id)

  const allHomes   = homes
  const allUsers   = [] // not needed for display

  const handleAddWish = (e) => {
    e.preventDefault()
    if (!wishForm.toCity || !wishForm.startDate || !wishForm.endDate) return
    addWish({ ...wishForm, guests: Number(wishForm.guests) })
    setWishForm({ toCity: '', startDate: '', endDate: '', guests: 1 })
    setShowWishForm(false)
  }

  const tabs = [
    { id: TAB.HOMES,    label: 'Mis hogares',  icon: Home,            count: myHomes.length },
    { id: TAB.WISHES,   label: 'Quiero viajar',icon: Heart,           count: myWishes.length },
    { id: TAB.RECEIVED, label: 'Recibidas',    icon: ArrowLeftRight,  count: received.length },
    { id: TAB.SENT,     label: 'Enviadas',     icon: ArrowLeftRight,  count: sent.length },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Mi panel</h1>
            <p className="text-gray-500 mt-1">Bienvenido, {currentUser.name.split(' ')[0]} 👋</p>
          </div>
          <Link href="/matches"
            className="bg-terra text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-terra-dark transition-colors flex items-center gap-2">
            <Star className="w-4 h-4" /> Buscar match
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Hogares', value: myHomes.length, color: 'bg-forest text-white', icon: Home },
            { label: 'Deseos', value: myWishes.length, color: 'bg-andean text-white', icon: Heart },
            { label: 'Recibidas', value: received.length, color: 'bg-terra text-white', icon: ArrowLeftRight },
            { label: 'Enviadas', value: sent.length, color: 'bg-gray-700 text-white', icon: ArrowLeftRight },
          ].map((s, i) => (
            <div key={i} className={`${s.color} rounded-2xl p-4 flex items-center gap-3`}>
              <s.icon className="w-6 h-6 opacity-80" />
              <div>
                <p className="text-2xl font-black">{s.value}</p>
                <p className="text-xs opacity-80">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

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

        {/* Tab: Mis hogares */}
        {tab === TAB.HOMES && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-gray-800 text-lg">Mis hogares registrados</h2>
              <Link href="/auth/register?step=home"
                className="flex items-center gap-1.5 text-forest font-bold text-sm hover:text-forest-dark">
                <Plus className="w-4 h-4" /> Añadir hogar
              </Link>
            </div>
            {myHomes.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200">
                <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No tienes hogares registrados</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {myHomes.map(home => (
                  <div key={home.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-forest-50 flex items-center justify-center text-3xl flex-shrink-0">
                      🏠
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black text-gray-900 text-lg leading-tight">{home.title}</h3>
                        <div className="flex gap-2 flex-shrink-0">
                          <Link href={`/homes/${home.id}`}
                            className="p-1.5 text-gray-400 hover:text-forest transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => removeHome && removeHome(home.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{home.city}, {home.country}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {home.maxGuests}</span>
                      </div>
                      {home.availabilityPeriods?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {home.availabilityPeriods.map(p => (
                            <span key={p.id} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                              <Calendar className="w-3 h-3" />
                              {new Date(p.start).toLocaleDateString('es-CL', { day:'numeric', month:'short' })} – {new Date(p.end).toLocaleDateString('es-CL', { day:'numeric', month:'short' })}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Deseos de viaje */}
        {tab === TAB.WISHES && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-gray-800 text-lg">¿A dónde quiero ir?</h2>
              <button onClick={() => setShowWishForm(!showWishForm)}
                className="flex items-center gap-1.5 text-forest font-bold text-sm hover:text-forest-dark">
                <Plus className="w-4 h-4" /> Nuevo deseo
              </button>
            </div>

            {showWishForm && (
              <form onSubmit={handleAddWish} className="bg-white rounded-2xl p-5 border border-forest/20 shadow-sm mb-5">
                <h3 className="font-black text-gray-800 mb-4">Añadir destino deseado</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Ciudad destino</label>
                    <input type="text" placeholder="Ej: Tokio, Barcelona, Pucón..."
                      value={wishForm.toCity} onChange={e => setWishForm({...wishForm, toCity: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Desde</label>
                    <input type="date" value={wishForm.startDate} onChange={e => setWishForm({...wishForm, startDate: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Hasta</label>
                    <input type="date" value={wishForm.endDate} onChange={e => setWishForm({...wishForm, endDate: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Viajeros</label>
                    <input type="number" min="1" max="10" value={wishForm.guests} onChange={e => setWishForm({...wishForm, guests: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="submit" className="bg-forest text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
                    Guardar deseo
                  </button>
                  <button type="button" onClick={() => setShowWishForm(false)}
                    className="px-5 py-2 rounded-xl font-bold text-sm text-gray-600 hover:text-gray-800">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {myWishes.length === 0 && !showWishForm ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium mb-2">Aún no tienes destinos guardados</p>
                <p className="text-gray-400 text-sm">Añade ciudades a las que quieres ir para que el algoritmo encuentre tu match perfecto</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {myWishes.map(w => (
                  <div key={w.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-andean/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-andean" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900">{w.toCity}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(w.startDate).toLocaleDateString('es-CL')} – {new Date(w.endDate).toLocaleDateString('es-CL')} · {w.guests} viajero{w.guests !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Link href={`/matches?city=${encodeURIComponent(w.toCity)}&start=${w.startDate}&end=${w.endDate}&guests=${w.guests}`}
                      className="text-xs font-bold text-forest hover:text-forest-dark px-3 py-1.5 bg-forest-50 rounded-lg transition-colors">
                      Ver matches
                    </Link>
                    <button onClick={() => removeWish(w.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Solicitudes recibidas */}
        {tab === TAB.RECEIVED && (
          <div>
            <h2 className="font-black text-gray-800 text-lg mb-4">Solicitudes de intercambio recibidas</h2>
            {received.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200">
                <ArrowLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Aún no has recibido solicitudes</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {received.map(req => {
                  const fromHome = homes.find(h => h.id === (req.fromHomeId || req.proposerHomeId))
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
                      <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 mb-3">
                        <p className="flex items-center gap-2 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-forest" />
                          {new Date(req.startDate || req.dates?.start).toLocaleDateString('es-CL')} – {new Date(req.endDate || req.dates?.end).toLocaleDateString('es-CL')}
                        </p>
                        {req.message && <p className="mt-1 italic">"{req.message}"</p>}
                      </div>
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
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Solicitudes enviadas */}
        {tab === TAB.SENT && (
          <div>
            <h2 className="font-black text-gray-800 text-lg mb-4">Solicitudes que has enviado</h2>
            {sent.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200">
                <ArrowLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Aún no has enviado solicitudes</p>
                <Link href="/matches" className="mt-3 inline-flex items-center gap-1.5 text-forest font-bold text-sm">
                  <Star className="w-4 h-4" /> Buscar mi match perfecto
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {sent.map(req => {
                  const toHome = homes.find(h => h.id === (req.toHomeId || req.receiverHomeId))
                  return (
                    <div key={req.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-black text-gray-900 text-base">{toHome?.title || 'Hogar'}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />{toHome?.city}
                          </p>
                        </div>
                        <StatusBadge status={req.status} />
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-forest" />
                          {new Date(req.startDate || req.dates?.start).toLocaleDateString('es-CL')} – {new Date(req.endDate || req.dates?.end).toLocaleDateString('es-CL')}
                        </p>
                      </div>
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
