'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '../../../lib/store'
import { Mountain, CheckCircle, ArrowRight, AlertCircle, Eye, EyeOff, Home, Plus, X } from 'lucide-react'

const STEPS = [
  { n: 1, icon: '👤', title: 'Tu cuenta' },
  { n: 2, icon: '🏠', title: 'Tu hogar' },
]

const TYPES = ['Departamento', 'Casa', 'Cabaña', 'Estudio', 'Loft', 'Villa', 'Otro']
const AMENITIES = ['WiFi', 'Cocina equipada', 'Lavadora', 'AC', 'Calefacción', 'Smart TV', 'Terraza', 'Jardín', 'Piscina privada', 'Estacionamiento', 'Chimenea', 'Parrilla/BBQ', 'Bicicletas', 'Ascensor']

export default function RegisterPage() {
  const { completeRegister } = useApp()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  // Step 1
  const [acc, setAcc] = useState({ name: '', email: '', password: '', city: '', country: '' })

  // Step 2
  const [homeForm, setHomeForm] = useState({
    title: '', type: '', location: '', city: '', country: '',
    bedrooms: 1, bathrooms: 1, maxGuests: 2, size: '',
    description: '', amenities: [],
    availabilityPeriods: [{ id: 'new1', start: '', end: '' }],
    imageUrl: '',
  })

  // ── STEP 1 ──
  const handleStep1 = async e => {
    e.preventDefault()
    setError('')
    if (!acc.name.trim()) { setError('Ingresa tu nombre'); return }
    if (acc.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setStep(2)
  }

  // ── STEP 2 ──
  const toggleAmenity = a => setHomeForm(f => ({
    ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a]
  }))

  const addPeriod = () => setHomeForm(f => ({
    ...f, availabilityPeriods: [...f.availabilityPeriods, { id: `new${Date.now()}`, start: '', end: '' }]
  }))
  const removePeriod = id => setHomeForm(f => ({
    ...f, availabilityPeriods: f.availabilityPeriods.filter(p => p.id !== id)
  }))
  const updatePeriod = (id, field, val) => setHomeForm(f => ({
    ...f, availabilityPeriods: f.availabilityPeriods.map(p => p.id === id ? { ...p, [field]: val } : p)
  }))

  const handleStep2 = async e => {
    e.preventDefault()
    setError('')
    if (!homeForm.type) { setError('Selecciona el tipo de hogar'); return }
    if (!homeForm.title.trim()) { setError('Ingresa el título del hogar'); return }
    if (!homeForm.location.trim()) { setError('Ingresa la ubicación'); return }
    if (homeForm.description.trim().length < 30) { setError('La descripción debe tener al menos 30 caracteres'); return }
    const validPeriods = homeForm.availabilityPeriods.filter(p => p.start && p.end)
    if (validPeriods.length === 0) { setError('Agrega al menos un período de disponibilidad'); return }

    setLoading(true)
    const images = homeForm.imageUrl
      ? [homeForm.imageUrl, `https://picsum.photos/seed/${Date.now()}/800/500`]
      : [`https://picsum.photos/seed/${Date.now()}/800/500`, `https://picsum.photos/seed/${Date.now() + 1}/800/500`]

    const res = await completeRegister(acc, {
      title: homeForm.title,
      type: homeForm.type,
      location: homeForm.location || `${homeForm.city || acc.city}, ${homeForm.country || acc.country}`,
      city: homeForm.city || acc.city,
      country: homeForm.country || acc.country,
      bedrooms: Number(homeForm.bedrooms),
      bathrooms: Number(homeForm.bathrooms),
      maxGuests: Number(homeForm.maxGuests),
      size: homeForm.size ? Number(homeForm.size) : null,
      description: homeForm.description,
      amenities: homeForm.amenities,
      images,
      availabilityPeriods: validPeriods,
      nearbyAttractions: [],
    })

    setLoading(false)
    if (!res.success) {
      setError(res.error || 'Error al crear la cuenta. Intenta de nuevo.')
      return
    }

    // Supabase envía email de confirmación — informar al usuario
    router.push('/auth/confirm')
  }

  const hf = homeForm

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{ background: '#F8F4EE' }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-4">
            <div className="w-12 h-12 landscape-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-forest-dark">Ruka</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Únete a la comunidad</h1>
          <p className="text-gray-500 mt-1 text-sm">Registra tu hogar y empieza a intercambiar</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${step === s.n ? 'bg-forest text-white shadow-md' : step > s.n ? 'bg-forest-50 text-forest' : 'bg-white text-gray-400 border border-gray-200'}`}>
                <span className="text-base">{step > s.n ? '✓' : s.icon}</span>
                <span className="text-xs font-bold hidden sm:inline">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-6 h-0.5 mx-1 ${step > s.n ? 'bg-forest' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          {/* ── STEP 1: Account ─────────────────────────────────────────────── */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Nombre completo</label>
                <input type="text" value={acc.name} onChange={e => setAcc({ ...acc, name: e.target.value })} placeholder="Tu nombre" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" value={acc.email} onChange={e => setAcc({ ...acc, email: e.target.value })} placeholder="tu@email.com" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Ciudad</label>
                  <input type="text" value={acc.city} onChange={e => setAcc({ ...acc, city: e.target.value })} placeholder="Santiago"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">País</label>
                  <input type="text" value={acc.country} onChange={e => setAcc({ ...acc, country: e.target.value })} placeholder="Chile"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Contraseña</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={acc.password} onChange={e => setAcc({ ...acc, password: e.target.value })} placeholder="Mínimo 6 caracteres" required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl"><AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}</div>}
              <button type="submit" disabled={loading} className="w-full bg-forest text-white py-3.5 rounded-xl font-bold hover:bg-forest-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Siguiente: Tu hogar <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* ── STEP 2: Home Registration ───────────────────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-5">
              <div className="bg-forest-50 border border-forest-100 rounded-xl p-4 text-sm text-forest-dark">
                <p className="font-bold flex items-center gap-1.5 mb-1"><Home className="w-4 h-4" /> Paso obligatorio</p>
                <p className="text-xs text-forest">Para unirte a Ruka necesitas registrar tu hogar. Así todos los miembros tienen algo que ofrecer.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Tipo de hogar</label>
                <div className="grid grid-cols-4 gap-2">
                  {TYPES.map(t => (
                    <button key={t} type="button" onClick={() => setHomeForm(f => ({ ...f, type: t }))}
                      className={`py-2 px-1 rounded-xl border text-xs font-semibold transition-all ${hf.type === t ? 'bg-forest text-white border-forest' : 'border-gray-200 text-gray-600 hover:border-forest/50'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Título del hogar</label>
                <input type="text" value={hf.title} onChange={e => setHomeForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="ej. Apartamento luminoso en Providencia, Santiago"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Ciudad del hogar</label>
                  <input type="text" value={hf.city} onChange={e => setHomeForm(f => ({ ...f, city: e.target.value }))}
                    placeholder={acc.city || 'Santiago'}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">País</label>
                  <input type="text" value={hf.country} onChange={e => setHomeForm(f => ({ ...f, country: e.target.value }))}
                    placeholder={acc.country || 'Chile'}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Dirección / Barrio</label>
                <input type="text" value={hf.location} onChange={e => setHomeForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="ej. Providencia, Santiago, Chile"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[['bedrooms', 'Hab.', 1, 10], ['bathrooms', 'Baños', 1, 6], ['maxGuests', 'Máx. pers.', 1, 20]].map(([field, lbl, min, max]) => (
                  <div key={field} className="text-center">
                    <label className="block text-xs font-bold text-gray-600 mb-2">{lbl}</label>
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" onClick={() => setHomeForm(f => ({ ...f, [field]: Math.max(min, f[field] - 1) }))}
                        className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 font-bold hover:border-forest hover:text-forest text-lg">−</button>
                      <span className="w-6 text-center font-black text-gray-900">{hf[field]}</span>
                      <button type="button" onClick={() => setHomeForm(f => ({ ...f, [field]: Math.min(max, f[field] + 1) }))}
                        className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 font-bold hover:border-forest hover:text-forest text-lg">+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Descripción</label>
                <textarea value={hf.description} onChange={e => setHomeForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe tu hogar: qué lo hace especial, el barrio, qué incluye..." rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest resize-none" />
                <p className="text-xs text-gray-400 mt-1">{hf.description.length} / mín. 30 caracteres</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Períodos de disponibilidad</label>
                <p className="text-xs text-gray-400 mb-3">¿Cuándo está disponible tu hogar para intercambio?</p>
                <div className="space-y-2">
                  {hf.availabilityPeriods.map(p => (
                    <div key={p.id} className="flex items-center gap-2 bg-forest-50 rounded-xl p-3 border border-forest-100">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <input type="date" value={p.start} min={new Date().toISOString().split('T')[0]}
                          onChange={e => updatePeriod(p.id, 'start', e.target.value)}
                          className="flex-1 min-w-0 border border-forest-100 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-forest bg-white" />
                        <span className="text-xs text-forest font-bold">→</span>
                        <input type="date" value={p.end} min={p.start || new Date().toISOString().split('T')[0]}
                          onChange={e => updatePeriod(p.id, 'end', e.target.value)}
                          className="flex-1 min-w-0 border border-forest-100 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-forest bg-white" />
                      </div>
                      {hf.availabilityPeriods.length > 1 && (
                        <button type="button" onClick={() => removePeriod(p.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {hf.availabilityPeriods.length < 5 && (
                    <button type="button" onClick={addPeriod}
                      className="flex items-center gap-1.5 text-forest text-xs font-semibold hover:text-forest-dark transition-colors mt-1">
                      <Plus className="w-4 h-4" /> Agregar otro período
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Comodidades</label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES.map(a => (
                    <button key={a} type="button" onClick={() => toggleAmenity(a)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${hf.amenities.includes(a) ? 'border-forest bg-forest-50 text-forest-dark' : 'border-gray-200 text-gray-600 hover:border-forest/40'}`}>
                      {hf.amenities.includes(a) && <CheckCircle className="w-3.5 h-3.5 text-forest flex-shrink-0" />}
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl"><AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}</div>}

              <button type="submit" disabled={loading}
                className="w-full bg-forest text-white py-4 rounded-xl font-extrabold hover:bg-forest-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-2 text-sm">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Publicar mi hogar y unirme a Ruka</>}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-forest font-bold hover:text-forest-dark">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}
