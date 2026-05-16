'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../lib/store'
import ChileLocationSelect from '../../components/ChileLocationSelect'
import { User, Home, CheckCircle, ArrowRight, AlertCircle, Camera, Plus } from 'lucide-react'
import RukkaLogo from '../../components/RukkaLogo'

const STEPS = [
  { n: 1, icon: User, label: 'Tu perfil' },
  { n: 2, icon: Home, label: 'Tu hogar'  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { completeProfile, user, ready } = useApp()

  useEffect(() => {
    if (ready && user?.status === 'confirmed') {
      router.replace('/dashboard')
    }
  }, [ready, user, router])

  const [step,          setStep]          = useState(1)
  const [loadingChoice, setLoadingChoice] = useState(null) // null | 'now' | 'later'
  const [error,         setError]         = useState('')

  const [profile, setProfile] = useState({
    phone: '',
    avatar: '',
    location: { region: '', comuna: '' },
  })

  const next = (e) => {
    e.preventDefault()
    setError('')
    if (!profile.location.region) { setError('Selecciona tu región'); return }
    if (!profile.location.comuna) { setError('Selecciona tu comuna'); return }
    setStep(2)
  }

  const handleChoice = async (addNow, destination = null) => {
    setError('')
    setLoadingChoice(addNow ? 'now' : 'later')
    const res = await completeProfile({
      phone:  profile.phone,
      avatar: profile.avatar || null,
      region: profile.location.region,
      comuna: profile.location.comuna,
    })
    setLoadingChoice(null)
    if (!res.success) { setError(res.error || 'Error al guardar. Intenta de nuevo.'); return }
    router.push(destination ?? (addNow ? '/dashboard/property/new' : '/dashboard'))
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <RukkaLogo height={44} />
          <p className="text-sm text-gray-400">Paso {step} de 2</p>
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
                  {done ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
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
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ── PASO 2: ELECCIÓN DE PROPIEDAD ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="text-5xl mb-4">🏠</div>
              <h2 className="text-xl font-black text-gray-900 mb-2">¿Tienes una propiedad para intercambiar?</h2>
              <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                No es obligatorio. Puedes explorar Rukka y agregar tu hogar cuando quieras desde tu dashboard.
              </p>

              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => handleChoice(true)}
                  disabled={loadingChoice !== null}
                  className="w-full bg-forest text-white py-4 rounded-2xl font-extrabold text-sm hover:bg-forest-dark disabled:opacity-60 transition flex items-center justify-center gap-2">
                  {loadingChoice === 'now'
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><Plus className="w-5 h-5" /> Sí, quiero agregar mi hogar</>
                  }
                </button>

                <button
                  type="button"
                  onClick={() => handleChoice(false, '/homes')}
                  disabled={loadingChoice !== null}
                  className="w-full bg-white text-forest border-2 border-forest py-4 rounded-2xl font-bold text-sm hover:bg-forest/5 disabled:opacity-60 transition flex items-center justify-center gap-2">
                  {loadingChoice === 'later'
                    ? <div className="w-5 h-5 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                    : 'Ahora no, quiero explorar'
                  }
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <button type="button" onClick={() => { setStep(1); setError('') }}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition py-2">
              ← Volver al perfil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
