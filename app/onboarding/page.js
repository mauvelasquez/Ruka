'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../lib/store'
import ChileLocationSelect from '../../components/ChileLocationSelect'
import { Mountain, User, Home, Calendar, CheckCircle, ArrowRight, AlertCircle,
         Camera, Plus, X, ChevronDown, BedDouble, Bath, Users, Wifi, Car,
         Snowflake, Flame, Tv, Coffee, Utensils, Shirt, Dog, Baby } from 'lucide-react'

// ── Constantes ────────────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, icon: User,     label: 'Tu perfil'   },
  { n: 2, icon: Home,     label: 'Tu hogar'    },
  { n: 3, icon: Calendar, label: 'Disponibilidad' },
]

const CATEGORY_OPTIONS = [
  { key: 'full_home', label: 'Hogar completo', desc: 'Los huéspedes tienen el alojamiento para ellos solos.', emoji: '🏠' },
  { key: 'room',      label: 'Habitación',     desc: 'Los huéspedes tienen su habitación pero comparten áreas comunes.', emoji: '🛏️' },
]

const SUBTYPES = {
  full_home: ['Casa', 'Departamento', 'Cabaña', 'Bungalow', 'Villa', 'Loft', 'Estudio', 'Otro'],
  room:      ['Habitación estándar', 'Habitación suite', 'Habitación con baño privado'],
}

const BED_TYPES = ['Cama doble', 'Cama queen', 'Cama king', 'Camas individuales', 'Sofá cama', 'Futón']

const AMENITIES = [
  { id: 'wifi',    label: 'WiFi',              icon: Wifi },
  { id: 'parking', label: 'Estacionamiento',   icon: Car },
  { id: 'ac',      label: 'Aire acondicionado',icon: Snowflake },
  { id: 'heating', label: 'Calefacción',       icon: Flame },
  { id: 'tv',      label: 'Televisor',         icon: Tv },
  { id: 'coffee',  label: 'Cafetera',          icon: Coffee },
  { id: 'kitchen', label: 'Cocina equipada',   icon: Utensils },
  { id: 'washer',  label: 'Lavadora',          icon: Shirt },
  { id: 'pets',    label: 'Mascotas ok',       icon: Dog },
  { id: 'baby',    label: 'Apto para bebés',   icon: Baby },
]

// ── Foto uploader ─────────────────────────────────────────────────────────────
function PhotoUploader({ photos, onChange, max = 8 }) {
  const handleFile = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      if (file.size > 1024 * 1024) { alert('Cada foto debe pesar menos de 1MB'); return }
      const reader = new FileReader()
      reader.onload = (ev) => onChange([...photos, ev.target.result])
      reader.readAsDataURL(file)
    })
  }
  return (
    <div className="grid grid-cols-3 gap-3">
      {photos.map((src, i) => (
        <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
          <img src={src} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button type="button" onClick={() => onChange(photos.filter((_, j) => j !== i))}
              className="bg-white text-red-500 rounded-full p-1"><X className="w-4 h-4" /></button>
          </div>
          {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white rounded px-1.5 py-0.5">Portada</span>}
        </div>
      ))}
      {photos.length < max && (
        <label className="aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-forest cursor-pointer flex flex-col items-center justify-center gap-1 transition group">
          <Camera className="w-5 h-5 text-gray-400 group-hover:text-forest transition" />
          <span className="text-xs text-gray-400 group-hover:text-forest transition">Agregar</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
        </label>
      )}
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const { completeOnboarding } = useApp()

  const [step,    setStep]    = useState(1)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  // Paso 1 — perfil
  const [profile, setProfile] = useState({
    phone: '',
    avatar: '',
    location: { region: '', comuna: '' },
  })

  // Paso 2 — hogar
  const [category,  setCategory]  = useState('full_home')
  const [subtype,   setSubtype]   = useState('')
  const [homeForm,  setHomeForm]  = useState({
    title: '', description: '',
    bedrooms: 1, bathrooms: 1, maxGuests: 2,
    private_bathroom: false, bed_type: '', shared_with: 1,
    amenities: [],
  })
  const [homeLocation, setHomeLocation] = useState({ region: '', comuna: '', direccion: '' })
  const [photos, setPhotos] = useState([])

  // Paso 3 — disponibilidad
  const [periods, setPeriods] = useState([{ id: 'p1', start: '', end: '' }])

  const toggleAmenity = (id) => setHomeForm(f => ({
    ...f, amenities: f.amenities.includes(id)
      ? f.amenities.filter(a => a !== id)
      : [...f.amenities, id]
  }))

  const addPeriod = () => setPeriods(p => [...p, { id: `p${Date.now()}`, start: '', end: '' }])
  const removePeriod = (id) => setPeriods(p => p.filter(x => x.id !== id))
  const updatePeriod = (id, field, val) => setPeriods(p => p.map(x => x.id === id ? { ...x, [field]: val } : x))

  // ── Validación y avance ────────────────────────────────────────────────────
  const next = (e) => {
    e.preventDefault()
    setError('')
    if (step === 1) {
      if (!profile.location.region) { setError('Selecciona tu región'); return }
      if (!profile.location.comuna) { setError('Selecciona tu comuna'); return }
      setStep(2)
    } else if (step === 2) {
      if (!homeForm.title.trim()) { setError('Ingresa el título del hogar'); return }
      if (!homeLocation.region)   { setError('Selecciona la región del hogar'); return }
      if (!homeLocation.comuna)   { setError('Selecciona la comuna del hogar'); return }
      if (!subtype)               { setError('Selecciona el tipo de hogar'); return }
      if (homeForm.description.trim().length < 20) { setError('La descripción debe tener al menos 20 caracteres'); return }
      setStep(3)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const validPeriods = periods.filter(p => p.start && p.end)
    if (validPeriods.length === 0) { setError('Agrega al menos un período de disponibilidad'); return }
    setLoading(true)
    const res = await completeOnboarding({
      profileData: {
        phone:  profile.phone,
        avatar: profile.avatar || null,
        region: profile.location.region,
        comuna: profile.location.comuna,
      },
      homeData: {
        title:            homeForm.title,
        description:      homeForm.description,
        category,
        subtype,
        type:             subtype,
        region:           homeLocation.region,
        comuna:           homeLocation.comuna,
        direccion:        homeLocation.direccion,
        bedrooms:         homeForm.bedrooms,
        bathrooms:        homeForm.bathrooms,
        maxGuests:        homeForm.maxGuests,
        amenities:        homeForm.amenities,
        images:           photos,
        availabilityPeriods: validPeriods,
        private_bathroom: homeForm.private_bathroom,
        bed_type:         homeForm.bed_type,
        shared_with:      homeForm.shared_with,
      },
    })
    setLoading(false)
    if (!res.success) { setError(res.error || 'Error al guardar. Intenta de nuevo.'); return }
    router.push('/dashboard')
  }

  const hf = homeForm

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 landscape-gradient rounded-xl flex items-center justify-center shadow-md">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-forest-dark">Rukka</span>
          </div>
          <p className="text-sm text-gray-400">Paso {step} de 3</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const active = step === s.n
            const done   = step > s.n
            return (
              <div key={s.n} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  active ? 'bg-forest text-white shadow-md'
                  : done  ? 'bg-forest/10 text-forest'
                  : 'bg-white text-gray-400 border border-gray-200'
                }`}>
                  {done
                    ? <CheckCircle className="w-4 h-4" />
                    : <Icon className="w-4 h-4" />
                  }
                  <span className="text-xs font-bold hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-0.5 mx-1 ${step > s.n ? 'bg-forest' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* ── PASO 1: PERFIL ── */}
        {step === 1 && (
          <form onSubmit={next} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-black text-gray-900 mb-1">Cuéntanos sobre ti</h2>
              <p className="text-sm text-gray-400 mb-5">Esta información aparecerá en tu perfil público.</p>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-forest-50 overflow-hidden flex-shrink-0 border-2 border-gray-100">
                  {profile.avatar
                    ? <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                  }
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                    Foto de perfil (máx. 1MB)
                  </label>
                  <label className="cursor-pointer flex items-center gap-2 text-sm text-forest font-semibold hover:text-forest-dark transition">
                    <Camera className="w-4 h-4" />
                    {profile.avatar ? 'Cambiar foto' : 'Subir foto'}
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files[0]
                      if (!file) return
                      if (file.size > 1024 * 1024) { alert('La foto debe pesar menos de 1MB'); return }
                      const reader = new FileReader()
                      reader.onload = ev => setProfile(p => ({ ...p, avatar: ev.target.result }))
                      reader.readAsDataURL(file)
                    }} />
                  </label>
                </div>
              </div>

              {/* Teléfono */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Teléfono celular
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+56 9 1234 5678"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <p className="text-xs text-gray-400 mt-1">Solo visible para usuarios con quienes hagas intercambio.</p>
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  ¿Dónde vives? <span className="text-red-500">*</span>
                </label>
                <ChileLocationSelect
                  value={profile.location}
                  onChange={loc => setProfile(p => ({ ...p, location: loc }))}
                  showDireccion={false}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <button type="submit"
              className="w-full bg-forest text-white py-4 rounded-2xl font-bold text-sm hover:bg-forest-dark transition flex items-center justify-center gap-2">
              Siguiente: Tu hogar <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ── PASO 2: HOGAR ── */}
        {step === 2 && (
          <form onSubmit={next} className="space-y-5">
            {/* Categoría */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-black text-gray-900 mb-1">Tu hogar</h2>
              <p className="text-sm text-gray-400 mb-5">Este será tu primer hogar en Rukka.</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {CATEGORY_OPTIONS.map(opt => (
                  <button key={opt.key} type="button" onClick={() => { setCategory(opt.key); setSubtype('') }}
                    className={`p-4 rounded-2xl border-2 text-left transition ${
                      category === opt.key ? 'border-forest bg-forest/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <span className="text-2xl mb-2 block">{opt.emoji}</span>
                    <p className={`font-bold text-sm ${category === opt.key ? 'text-forest' : 'text-gray-700'}`}>{opt.label}</p>
                    <p className="text-xs text-gray-400 leading-snug mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {/* Subtipo */}
              <div className="relative mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Tipo específico *</label>
                <div className="relative">
                  <select value={subtype} onChange={e => setSubtype(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm appearance-none bg-white focus:ring-2 focus:ring-forest focus:outline-none">
                    <option value="">Selecciona una opción</option>
                    {SUBTYPES[category].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Detalles habitación */}
              {category === 'room' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bath className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">Baño privado</span>
                    </div>
                    <button type="button" onClick={() => setHomeForm(f => ({ ...f, private_bathroom: !f.private_bathroom }))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${hf.private_bathroom ? 'bg-forest' : 'bg-gray-200'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-all ${hf.private_bathroom ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Tipo de cama</label>
                    <div className="relative">
                      <select value={hf.bed_type} onChange={e => setHomeForm(f => ({ ...f, bed_type: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm appearance-none bg-white focus:ring-2 focus:ring-forest focus:outline-none">
                        <option value="">Selecciona</option>
                        {BED_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Personas que comparten el hogar</label>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setHomeForm(f => ({ ...f, shared_with: Math.max(0, f.shared_with - 1) }))}
                        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-forest hover:text-forest transition">−</button>
                      <span className="text-xl font-bold text-forest w-8 text-center">{hf.shared_with}</span>
                      <button type="button" onClick={() => setHomeForm(f => ({ ...f, shared_with: f.shared_with + 1 }))}
                        className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-forest hover:text-forest transition">+</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Título */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Título *</label>
                <input type="text" value={hf.title} maxLength={60}
                  onChange={e => setHomeForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="ej. Departamento luminoso en Providencia"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest focus:outline-none" />
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Descripción *</label>
                <textarea value={hf.description} rows={4} maxLength={600}
                  onChange={e => setHomeForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe tu hogar, el barrio, qué lo hace especial..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest focus:outline-none resize-none" />
                <p className="text-xs text-gray-400 text-right mt-0.5">{hf.description.length}/600</p>
              </div>

              {/* Capacidad */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[['bedrooms','Hab.',1,10],['bathrooms','Baños',1,6],['maxGuests','Huéspedes',1,20]].map(([field,lbl,min,max]) => (
                  <div key={field} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1.5">{lbl}</p>
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" onClick={() => setHomeForm(f => ({ ...f, [field]: Math.max(min, f[field]-1) }))}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-forest hover:text-forest text-sm">−</button>
                      <span className="font-bold text-forest w-5 text-center text-sm">{hf[field]}</span>
                      <button type="button" onClick={() => setHomeForm(f => ({ ...f, [field]: Math.min(max, f[field]+1) }))}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-forest hover:text-forest text-sm">+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comodidades */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Comodidades</label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENITIES.map(({ id, label, icon: Icon }) => {
                    const active = hf.amenities.includes(id)
                    return (
                      <button key={id} type="button" onClick={() => toggleAmenity(id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition text-left text-xs font-medium ${
                          active ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}>
                        <Icon className="w-4 h-4 flex-shrink-0" /> {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Fotos */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Fotos (opcional, máx. 1MB c/u)</label>
                <PhotoUploader photos={photos} onChange={setPhotos} max={8} />
              </div>

              {/* Ubicación */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Ubicación del hogar *</label>
                <ChileLocationSelect value={homeLocation} onChange={setHomeLocation} showDireccion required />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)}
                className="px-6 py-4 rounded-2xl border border-gray-200 font-bold text-sm text-gray-600 hover:border-gray-300 transition">
                Atrás
              </button>
              <button type="submit"
                className="flex-1 bg-forest text-white py-4 rounded-2xl font-bold text-sm hover:bg-forest-dark transition flex items-center justify-center gap-2">
                Siguiente: Disponibilidad <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ── PASO 3: DISPONIBILIDAD ── */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-black text-gray-900 mb-1">¿Cuándo está disponible tu hogar?</h2>
              <p className="text-sm text-gray-400 mb-5">Agrega los períodos en que otros pueden solicitar intercambio.</p>

              <div className="space-y-3">
                {periods.map(p => (
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
                    {periods.length > 1 && (
                      <button type="button" onClick={() => removePeriod(p.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {periods.length < 5 && (
                  <button type="button" onClick={addPeriod}
                    className="flex items-center gap-1.5 text-forest text-xs font-semibold hover:text-forest-dark transition mt-1">
                    <Plus className="w-4 h-4" /> Agregar otro período
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)}
                className="px-6 py-4 rounded-2xl border border-gray-200 font-bold text-sm text-gray-600 hover:border-gray-300 transition">
                Atrás
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-forest text-white py-4 rounded-2xl font-extrabold text-sm hover:bg-forest-dark disabled:opacity-60 transition flex items-center justify-center gap-2">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><CheckCircle className="w-5 h-5" /> Publicar mi hogar y entrar a Rukka</>
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
