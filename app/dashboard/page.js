'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../lib/store'
import Navbar from '../../components/Navbar'
import MessageThread from '../../components/MessageThread'
import {
  Home, Heart, ArrowLeftRight, Plus, MapPin, Users, Calendar,
  CheckCircle, XCircle, Clock, Trash2, Eye, Star, Sparkles, AlertCircle, ScrollText, MessageSquare, User, Lock, ChevronRight, TrendingUp, ExternalLink, Share2, Check
} from 'lucide-react'
import { COMUNAS_RUKKA } from '../../lib/comunas'
import { COUNTRIES as LATAM_COUNTRIES } from '../../lib/geo/latam'
import { COUNTRY_ID_CONFIG } from '../../lib/identification'
import { useVerificationGate } from '../../hooks/useVerificationGate'
import VerificationRequiredModal from '../../components/VerificationRequiredModal'
import PhoneInputCL from '../../components/ui/PhoneInputCL'
import CountryUserSelect from '../../components/ui/CountryUserSelect'

const TAB = { WISHES: 'wishes', HOMES: 'homes', RECEIVED: 'received', SENT: 'sent', PROFILE: 'profile' }

const CHILE_CITIES = COMUNAS_RUKKA
const LATAM_CITIES = LATAM_COUNTRIES.flatMap(country =>
  country.regions.flatMap(region =>
    region.cities.map(city => `${city}, ${country.name}`)
  )
)
const ALL_DESTINATIONS = [...CHILE_CITIES, ...LATAM_CITIES]

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

const TX_ICON = { earned: '📈', bonus: '🎁', spent: '✈️', refunded: '↩️' }

const VALID_TABS = new Set(Object.values(TAB))

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentUser, ready, homes, users, wishes, requests, addWish, removeWish, updateRequest, removeHome, syncSession, updateProfile } = useApp()
  const { gate, modalOpen, modalAction, closeModal } = useVerificationGate()

  const initialTab = (() => {
    const p = searchParams.get('tab')
    return p && VALID_TABS.has(p) ? p : TAB.WISHES
  })()
  const [tab, setTab] = useState(initialTab)

  const changeTab = (tabId) => {
    setTab(tabId)
    router.replace(`/dashboard?tab=${tabId}`)
  }
  const [wishForm, setWishForm] = useState({ toCity: '', startDate: '', endDate: '', guests: 2 })
  const [showWishForm, setShowWishForm] = useState(false)
  const [showNoHomeAlert, setShowNoHomeAlert] = useState(false)
  const [wishBlockReason, setWishBlockReason] = useState(null)
  const [activeThread, setActiveThread] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [yankiBalance, setYankiBalance] = useState(null)
  const [yankiTxs, setYankiTxs] = useState([])
  const [copiedHomeId, setCopiedHomeId] = useState(null)
  const [profileForm, setProfileForm] = useState({ phone: '', birth_date: '', country_user: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    if (!currentUser) return
    setProfileForm({
      phone:        currentUser.phone        || '',
      birth_date:   currentUser.birth_date   || '',
      country_user: currentUser.country_user || '',
    })
  }, [currentUser?.id])

  useEffect(() => {
    if (!ready || !currentUser) return
    fetch('/api/admin/me').then(r => r.json()).then(({ isAdmin: a }) => setIsAdmin(a)).catch(() => {})
  }, [ready, currentUser])

  useEffect(() => {
    if (!ready || !currentUser) return
    fetch('/api/yankis/balance').then(r => r.json()).then(d => setYankiBalance(d)).catch(() => {})
    fetch('/api/yankis/transactions').then(r => r.json()).then(d => setYankiTxs((d || []).slice(0, 4))).catch(() => {})
  }, [ready, currentUser])

  useEffect(() => {
    if (ready) return
    const timer = setTimeout(() => window.location.reload(), 15000)
    return () => clearTimeout(timer)
  }, [ready])

  useEffect(() => {
    if (!ready) return
    if (!currentUser) router.push('/auth/login')
  }, [currentUser, ready])

  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!currentUser) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const handleProfileSave = async () => {
    setProfileError('')
    if (profileForm.phone) {
      const local = profileForm.phone.replace(/^\+56/, '')
      if (local.length !== 9 || !local.startsWith('9')) {
        setProfileError('Teléfono inválido. Debe tener 9 dígitos y comenzar con 9.')
        return
      }
    }
    setProfileSaving(true)
    const updates = {
      phone:        profileForm.phone        || null,
      birth_date:   profileForm.birth_date   || null,
      country_user: profileForm.country_user || null,
    }
    const res = await updateProfile(updates)
    setProfileSaving(false)
    if (!res?.success) {
      setProfileError(res?.error || 'Error al guardar')
    } else {
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    }
  }

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

  const shareHome = (homeId) => {
    const url = `${window.location.origin}/homes/${homeId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopiedHomeId(homeId)
      setTimeout(() => setCopiedHomeId(null), 2000)
    })
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
            <h1 className="text-3xl font-black text-rukka-dark">Mi Rukka</h1>
            <p className="text-gray-500 mt-0.5">Hola, {currentUser.name?.split(' ')[0]} 👋 ¿A dónde viajas hoy?</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link href="/dashboard/logs"
                className="bg-gray-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-700 transition-colors flex items-center gap-2">
                <ScrollText className="w-4 h-4" /> Logs
              </Link>
            )}
            <button onClick={() => changeTab(TAB.PROFILE)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${
                tab === TAB.PROFILE
                  ? 'bg-forest text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-forest hover:text-forest'
              }`}>
              <User className="w-4 h-4" /> Mi perfil
            </button>
            <Link href="/matches"
              className="bg-terra text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-terra-dark transition-colors flex items-center gap-2 shadow-sm">
              <Star className="w-4 h-4" /> Buscar match
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Deseos de viaje', value: myWishes.length, bg: 'bg-andean',   icon: Heart,          tabId: TAB.WISHES },
            { label: 'Mis hogares',     value: myHomes.length,  bg: 'bg-forest',   icon: Home,           tabId: TAB.HOMES },
            { label: 'Recibidas',       value: received.length, bg: 'bg-terra',    icon: ArrowLeftRight, tabId: TAB.RECEIVED },
            { label: 'Enviadas',        value: sent.length,     bg: 'bg-gray-700', icon: ArrowLeftRight, tabId: TAB.SENT },
          ].map((s, i) => (
            <button key={i}
              onClick={() => changeTab(s.tabId)}
              className={`${s.bg} text-white rounded-2xl p-4 flex items-center gap-3 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm text-left w-full`}>
              <s.icon className="w-5 h-5 opacity-75 flex-shrink-0" />
              <div>
                <p className="text-2xl font-black leading-none">{s.value}</p>
                <p className="text-xs opacity-75 mt-0.5 leading-tight">{s.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Módulo Yankis */}
        <div className="bg-white rounded-3xl border border-terra/15 shadow-sm mb-5 overflow-hidden">
          {/* Header del módulo */}
          <div className="bg-gradient-to-r from-terra to-terra-dark px-6 py-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Tus Yankis</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tabular-nums">
                    {yankiBalance === null ? '—' : yankiBalance.balance ?? 0}
                  </span>
                  <span className="text-3xl">🪙</span>
                </div>
                <p className="text-white/60 text-xs mt-1.5">disponibles para viajar</p>
              </div>
              <Link href="/dashboard/yankis"
                className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 mt-1">
                Ver todo <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mini stats si hay datos */}
            {yankiBalance !== null && (
              <div className="flex gap-5 mt-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-white/50 text-xs">Ganados</p>
                  <p className="text-white font-black text-base">{yankiBalance.total_earned ?? 0} 🪙</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs">Gastados</p>
                  <p className="text-white font-black text-base">{yankiBalance.total_spent ?? 0} 🪙</p>
                </div>
              </div>
            )}
          </div>

          {/* Cuerpo del módulo */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Cómo ganas */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Cómo ganar Yankis</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">🏠</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Hospeda viajeros</p>
                    <p className="text-xs text-gray-400 leading-relaxed">1 Yanki por noche al aceptar un intercambio</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">🎁</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Bono de bienvenida</p>
                    <p className="text-xs text-gray-400 leading-relaxed">3 Yankis al completar tu perfil verificado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transacciones recientes o explicación de uso */}
            <div>
              {yankiTxs.length > 0 ? (
                <>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Últimos movimientos</p>
                  <div className="space-y-2.5">
                    {yankiTxs.map(tx => (
                      <div key={tx.id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base flex-shrink-0">{TX_ICON[tx.type] || '🪙'}</span>
                          <p className="text-xs text-gray-600 truncate">{tx.description}</p>
                        </div>
                        <span className={`text-xs font-black flex-shrink-0 ${tx.type === 'spent' ? 'text-red-500' : 'text-forest'}`}>
                          {tx.type === 'spent' ? '−' : '+'}{tx.amount} 🪙
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Para qué sirven</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">✈️</span>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Viaja sin match bilateral</p>
                        <p className="text-xs text-gray-400 leading-relaxed">1 Yanki = 1 noche en cualquier hogar Rukka</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">🤝</span>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Match bilateral = gratis</p>
                        <p className="text-xs text-gray-400 leading-relaxed">Si ambos viajan juntos, los Yankis se cancelan entre sí</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CTA si no tiene hogar */}
        {myHomes.length === 0 && (
          <div className="bg-gradient-to-r from-forest to-forest-dark rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center gap-4 mb-5 shadow-md">
            <div className="flex-1">
              <p className="font-black text-base mb-1">🏠 Aún no tienes un hogar registrado</p>
              <p className="text-white/75 text-sm">Publica tu hogar para intercambiar estadías y ganar Yankis.</p>
            </div>
            <button onClick={() => gate('publish', () => router.push('/dashboard/property/new'))}
              className="flex-shrink-0 bg-white text-forest-dark font-black px-5 py-2.5 rounded-xl text-sm hover:bg-sand transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm">
              <Plus className="w-4 h-4" /> Publicar mi hogar
            </button>
          </div>
        )}

        {/* Quiero viajar hero */}
        {tab === TAB.WISHES && myWishes.length === 0 && !showWishForm && (
          <div className="bg-gradient-to-br from-andean to-blue-700 rounded-3xl p-8 text-white text-center mb-5 shadow-lg">
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
            <button key={t.id} onClick={() => changeTab(t.id)}
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
              <button onClick={() => {
                const isVerified = currentUser?.verification_status === 'verified' || currentUser?.verification_status === 'id_verified'
                if (!isVerified) { setWishBlockReason('unverified'); setShowNoHomeAlert(false); setShowWishForm(false); return }
                if (myHomes.length === 0) { setWishBlockReason('no_home'); setShowNoHomeAlert(false); setShowWishForm(false); return }
                setWishBlockReason(null)
                setShowWishForm(!showWishForm)
                setShowNoHomeAlert(false)
              }}
                className="flex items-center gap-1.5 bg-andean text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" /> Nuevo destino
              </button>
            </div>

            {wishBlockReason === 'unverified' && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-purple-900 text-sm mb-1">Verificación requerida</p>
                  <p className="text-purple-700 text-xs mb-2">Debes verificarte para agregar destinos de viaje.</p>
                  <Link href="/onboarding"
                    className="inline-flex items-center gap-1.5 bg-forest text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-forest-dark transition-colors">
                    Verificar mi identidad →
                  </Link>
                </div>
              </div>
            )}

            {wishBlockReason === 'no_home' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 text-sm mb-1">Debes registrar tu hogar primero</p>
                  <p className="text-amber-700 text-xs mb-2">Para agregar destinos de viaje, primero publica tu hogar en Rukka.</p>
                  <button onClick={() => gate('publish', () => router.push('/dashboard/property/new'))}
                    className="inline-flex items-center gap-1.5 bg-forest text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-forest-dark transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Publicar mi hogar
                  </button>
                </div>
              </div>
            )}

            {showNoHomeAlert && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 text-sm mb-1">Necesitas agregar tu propiedad primero</p>
                  <p className="text-amber-700 text-xs mb-2">Para ingresar un destino de viaje, primero debes publicar tu hogar en Rukka.</p>
                  <button onClick={() => gate('publish', () => router.push('/dashboard/property/new'))}
                    className="inline-flex items-center gap-1.5 bg-forest text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-forest-dark transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Agregar mi propiedad
                  </button>
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
                      ¿A qué ciudad quieres ir?
                    </label>
                    <input list="cities-dash" type="text" placeholder="ej. Pichilemu, Villarrica, Valparaíso..."
                      value={wishForm.toCity} onChange={e => setWishForm({...wishForm, toCity: e.target.value})}
                      className="w-full border-2 border-gray-200 focus:border-andean rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
                    <datalist id="cities-dash">
                      {ALL_DESTINATIONS.map(c => <option key={c} value={c} />)}
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
                        <button onClick={() => removeWish(w.id)} aria-label="Eliminar destino" className="p-2 text-gray-300 hover:text-red-500 transition-colors">
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
              <button onClick={() => gate('publish', () => router.push('/dashboard/property/new'))}
                className="flex items-center gap-1.5 bg-forest text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
                <Plus className="w-4 h-4" /> Añadir hogar
              </button>
            </div>
            {myHomes.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-200">
                <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-900 font-black text-base mb-1">Aún no tienes hogares registrados</p>
                <p className="text-gray-400 text-sm mb-2">¿Tienes una propiedad en Airbnb? Impórtala en un clic e intercámbiala con otros usuarios de Rukka.</p>
                <p className="text-gray-400 text-xs mb-6">O publica tu hogar manualmente en menos de 5 minutos.</p>
                <button onClick={() => gate('publish', () => router.push('/dashboard/property/new'))}
                  className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
                  <Plus className="w-4 h-4" /> Publicar mi primer hogar
                </button>
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
                          <Link href={`/homes/${home.id}`} target="_blank"
                            className="p-1.5 text-gray-400 hover:text-andean transition-colors"
                            aria-label={`Ver página pública de ${home.title}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button onClick={() => shareHome(home.id)}
                            className="p-1.5 transition-colors"
                            aria-label={`Compartir link de ${home.title}`}
                            title="Copiar link">
                            {copiedHomeId === home.id
                              ? <Check className="w-4 h-4 text-forest" />
                              : <Share2 className="w-4 h-4 text-gray-400 hover:text-terra" />
                            }
                          </button>
                          <Link href={`/dashboard/property/${home.id}`}
                            className="p-1.5 text-gray-400 hover:text-forest transition-colors"
                            aria-label={`Editar ${home.title}`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => removeHome(home.id)} aria-label={`Eliminar hogar ${home.title}`} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
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

        {/* ── TAB: MI PERFIL ── */}
        {tab === TAB.PROFILE && (
          <div className="max-w-xl">
            <h2 className="font-black text-gray-800 text-lg mb-4">Mi perfil</h2>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-2xl bg-forest flex items-center justify-center text-white text-3xl font-black overflow-hidden flex-shrink-0">
                  {currentUser.avatar
                    ? <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    : <span>{currentUser.name?.[0]?.toUpperCase() || '?'}</span>
                  }
                </div>
                <div>
                  <p className="font-black text-gray-900 text-xl">{currentUser.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              {/* Campos fijos */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">

                {/* Nombre */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Nombre completo
                  </label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 select-none flex items-center gap-2">
                    <span className="flex-1">{currentUser.name || '—'}</span>
                    {currentUser.verified && <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                  </div>
                  {currentUser.verified && (
                    <p className="text-xs text-gray-400 mt-1">El nombre no puede modificarse una vez verificada la identidad.</p>
                  )}
                </div>

                {/* Correo */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 select-none">
                    {currentUser.email || '—'}
                  </div>
                </div>

                {/* Documento de identidad */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    {COUNTRY_ID_CONFIG[currentUser.identification_country]?.label || 'Documento de identidad'}
                  </label>
                  <div className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm select-none flex items-center gap-2 ${currentUser.identification_number ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                    <span className="flex-1">{currentUser.identification_number || 'No verificado'}</span>
                    {currentUser.verified && <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                  </div>
                </div>

                {/* Estado de verificación */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Estado de identidad
                  </label>
                  {currentUser.verified ? (
                    <span className="inline-flex items-center gap-1.5 bg-forest/10 text-forest text-sm font-bold px-3 py-1.5 rounded-full border border-forest/20">
                      <CheckCircle className="w-4 h-4" /> Verificado
                    </span>
                  ) : (
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-sm font-bold px-3 py-1.5 rounded-full border border-gray-200">
                        <User className="w-4 h-4" /> Sin verificar
                      </span>
                      <Link href="/onboarding"
                        className="text-sm font-bold text-forest hover:text-forest-dark underline underline-offset-2 transition-colors">
                        Verificar mi identidad →
                      </Link>
                    </div>
                  )}
                </div>

              </div>

              {/* Campos editables */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Información de contacto</h3>

                {/* Teléfono */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Teléfono
                  </label>
                  <PhoneInputCL
                    value={profileForm.phone}
                    onChange={v => setProfileForm(f => ({ ...f, phone: v }))}
                  />
                </div>

                {/* País */}
                <CountryUserSelect
                  value={profileForm.country_user}
                  onChange={v => setProfileForm(f => ({ ...f, country_user: v }))}
                  detectIP={false}
                />

                {/* Fecha de nacimiento */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                    Fecha de nacimiento
                    {currentUser.verified && <span className="text-gray-400 normal-case font-normal ml-1">(completada por verificación)</span>}
                  </label>
                  <input
                    type="date"
                    value={profileForm.birth_date}
                    onChange={e => setProfileForm(f => ({ ...f, birth_date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">Se usa para personalización y publicidad. Ver <a href="/terminos#publicidad" className="text-forest hover:underline">Términos</a>.</p>
                </div>

                {profileError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {profileError}
                  </div>
                )}

                <button
                  onClick={handleProfileSave}
                  disabled={profileSaving}
                  className="w-full bg-forest text-white py-3 rounded-xl font-bold text-sm hover:bg-forest-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                >
                  {profileSaving
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : profileSaved
                    ? <><Check className="w-4 h-4" /> Guardado</>
                    : 'Guardar cambios'
                  }
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
      {modalOpen && (
        <VerificationRequiredModal action={modalAction} onClose={closeModal} />
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#F8F4EE' }} />}>
      <DashboardContent />
    </Suspense>
  )
}
