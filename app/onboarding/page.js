'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../lib/store'
import ChileLocationSelect from '../../components/ChileLocationSelect'
import {
  User, Home, CheckCircle, ArrowRight, AlertCircle, Camera, Plus,
  ShieldCheck, Upload, RotateCcw, Loader, Globe, MessageCircle,
} from 'lucide-react'
import RukkaLogo from '../../components/RukkaLogo'
import { COUNTRY_ID_CONFIG, SUPPORTED_COUNTRIES, COUNTRY_NAMES } from '../../lib/identification'

const STEPS = [
  { n: 1, icon: User,        label: 'Tu perfil'  },
  { n: 2, icon: ShieldCheck, label: 'Identidad'  },
  { n: 3, icon: Home,        label: 'Tu hogar'   },
]

function compressImage(file, maxBytes = 800_000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      const MAX_DIM = 1600
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height)
        width  = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      let q = quality
      const tryEncode = () => {
        canvas.toBlob(blob => {
          if (!blob) return reject(new Error('No se pudo comprimir la imagen'))
          if (blob.size <= maxBytes || q <= 0.3) {
            const reader = new FileReader()
            reader.onload = e => resolve(e.target.result.split(',')[1])
            reader.readAsDataURL(blob)
          } else {
            q -= 0.1
            tryEncode()
          }
        }, 'image/jpeg', q)
      }
      tryEncode()
    }
    img.onerror = reject
    img.src = url
  })
}

const REJECTION_MESSAGES = {
  ilegible: 'No pudimos leer el documento. Intenta con mejor iluminación.',
  documento_no_reconocido: (label) => `Este documento no es compatible. Usa tu ${label} oficial.`,
  imagen_invalida: 'La imagen no es válida. Sube una foto del documento.',
}

export default function OnboardingPage() {
  const router = useRouter()
  const { completeProfile, updateProfile, user, ready } = useApp()

  useEffect(() => {
    if (ready && user?.status === 'confirmed') {
      router.replace('/dashboard')
    }
  }, [ready, user, router])

  const [step,          setStep]          = useState(1)
  const [loadingChoice, setLoadingChoice] = useState(null)
  const [error,         setError]         = useState('')

  const [profile, setProfile] = useState({
    phone:    '',
    avatar:   '',
    location: { region: '', comuna: '' },
  })

  // ── Identity step state ──────────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry] = useState('CL')
  const [detectedCountry, setDetectedCountry] = useState(null)
  const [ipCountryName,   setIpCountryName]   = useState(null)
  const [idFile,          setIdFile]          = useState(null)
  const [idPreview,       setIdPreview]       = useState(null)
  // idle | loading | extracted | saving | error
  const [idStatus,        setIdStatus]        = useState('idle')
  const [idResult,        setIdResult]        = useState(null)
  const [idError,         setIdError]         = useState(null)
  const [retriesLeft,     setRetriesLeft]     = useState(3)
  const inputRef = useRef()

  // Detect country from IP
  useEffect(() => {
    if (typeof window === 'undefined') return
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const code = data.country_code
        if (SUPPORTED_COUNTRIES.includes(code)) {
          setDetectedCountry(code)
          setSelectedCountry(code)
          setIpCountryName(COUNTRY_NAMES[code])
        }
      })
      .catch(() => {})
  }, [])

  // ── Step 1: profile ──────────────────────────────────────────────────────────
  const nextToStep2 = (e) => {
    e.preventDefault()
    setError('')
    if (!profile.location.region) { setError('Selecciona tu región'); return }
    if (!profile.location.comuna) { setError('Selecciona tu comuna'); return }
    setStep(2)
  }

  // ── Step 2: identity ─────────────────────────────────────────────────────────
  const handleIdFile = (f) => {
    if (!f || !f.type.startsWith('image/')) {
      setIdError('Solo se aceptan imágenes (JPG, PNG, HEIC)')
      return
    }
    setIdError(null)
    setIdResult(null)
    setIdStatus('idle')
    setIdFile(f)
    setIdPreview(URL.createObjectURL(f))
  }

  const handleIdAnalyze = async () => {
    if (!idFile) return
    setIdStatus('loading')
    setIdError(null)
    try {
      const base64 = await compressImage(idFile)
      const res = await fetch('/api/verify-identity', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ imageBase64: base64, mimeType: 'image/jpeg' }),
      })
      const data = await res.json()
      if (!res.ok) {
        setIdStatus('error')
        setRetriesLeft(r => r - 1)
        const reason   = data.rejection_reason || 'imagen_invalida'
        const docLabel = COUNTRY_ID_CONFIG[selectedCountry]?.label || 'documento'
        const msg = typeof REJECTION_MESSAGES[reason] === 'function'
          ? REJECTION_MESSAGES[reason](docLabel)
          : (REJECTION_MESSAGES[reason] || 'No se pudo verificar el documento.')
        setIdError(msg)
        return
      }
      setIdStatus('extracted')
      setIdResult(data)
    } catch {
      setIdStatus('error')
      setRetriesLeft(r => r - 1)
      setIdError('Error de conexión. Verifica tu internet e intenta nuevamente.')
    }
  }

  const handleIdConfirm = async () => {
    if (!idResult) return
    setIdStatus('saving')
    const res = await updateProfile({
      identification_number:    idResult.identification_number,
      identification_type:      idResult.document_type,
      identification_country:   idResult.country,
      identification_verified:  true,
      verified:                 true,
      verification_status:      'id_verified',
      verification_completed_at: new Date().toISOString(),
    })
    if (res?.success) {
      setStep(3)
    } else {
      setIdError('Error al guardar. Intenta de nuevo.')
      setIdStatus('extracted')
    }
  }

  const resetIdUpload = () => {
    setIdFile(null)
    setIdPreview(null)
    setIdStatus('idle')
    setIdError(null)
    setIdResult(null)
  }

  // ── Step 3: property choice ──────────────────────────────────────────────────
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

  // ── Render ────────────────────────────────────────────────────────────────────
  const config = COUNTRY_ID_CONFIG[selectedCountry]

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <RukkaLogo height={44} />
          <p className="text-sm text-gray-400">Paso {step} de 3</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const Icon   = s.icon
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
          <form onSubmit={nextToStep2} className="space-y-6">
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

        {/* ── PASO 2: IDENTIDAD ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-black text-gray-900 mb-1">Verifica tu identidad</h2>
              <p className="text-sm text-gray-400 mb-5">Sube una foto de tu documento para verificar quién eres.</p>

              {/* Country selector */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> País del documento
                </label>
                <select
                  value={selectedCountry}
                  onChange={e => { setSelectedCountry(e.target.value); resetIdUpload() }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                >
                  {SUPPORTED_COUNTRIES.map(code => (
                    <option key={code} value={code}>{COUNTRY_NAMES[code]}</option>
                  ))}
                </select>
                {detectedCountry && ipCountryName && (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Detectamos que te conectas desde <span className="font-semibold">{ipCountryName}</span>.
                    Puedes cambiar el país si es necesario.
                  </p>
                )}
              </div>

              {/* Document instructions */}
              <div className="bg-forest/5 border border-forest/20 rounded-xl p-4 mb-5">
                <p className="text-sm font-bold text-forest mb-1">
                  Sube una foto de tu {config?.label}
                </p>
                <p className="text-xs text-gray-500">{config?.description}</p>
                <p className="text-xs text-gray-400 mt-1">Formato de referencia: <span className="font-mono">{config?.format_hint}</span></p>
              </div>

              {/* Upload + result area */}
              {idStatus !== 'extracted' && idStatus !== 'saving' ? (
                <>
                  {!idPreview ? (
                    <div
                      onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleIdFile(e.dataTransfer.files[0]) }}
                      onDragOver={e => e.preventDefault()}
                      onClick={() => inputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-forest/40 hover:bg-forest/5 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700">Arrastra tu foto aquí</p>
                        <p className="text-xs text-gray-400 mt-0.5">o haz clic para seleccionar</p>
                      </div>
                      <p className="text-xs text-gray-300">JPG, PNG, HEIC — máx. 10MB</p>
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={e => e.target.files[0] && handleIdFile(e.target.files[0])}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[1.586/1]">
                        <img src={idPreview} alt="Documento preview" className="w-full h-full object-contain" />
                      </div>

                      {idStatus === 'error' && (
                        <>
                          <div className="flex gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{idError}</p>
                          </div>
                          {retriesLeft <= 0 && (
                            <a href="mailto:soporte@rukka.cl"
                              className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                              <MessageCircle className="w-4 h-4" /> Contactar soporte
                            </a>
                          )}
                        </>
                      )}

                      <div className="flex gap-2">
                        <button onClick={resetIdUpload}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                          <RotateCcw className="w-4 h-4" /> Cambiar foto
                        </button>
                        <button
                          onClick={handleIdAnalyze}
                          disabled={idStatus === 'loading' || retriesLeft <= 0}
                          className="flex-1 flex items-center justify-center gap-2 bg-forest text-white py-2.5 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {idStatus === 'loading' ? (
                            <><Loader className="w-4 h-4 animate-spin" /> Analizando...</>
                          ) : (
                            <><Camera className="w-4 h-4" /> Analizar documento</>
                          )}
                        </button>
                      </div>

                      {retriesLeft < 3 && retriesLeft > 0 && (
                        <p className="text-xs text-center text-gray-400">
                          Te quedan <span className="font-bold text-gray-600">{retriesLeft} {retriesLeft === 1 ? 'intento' : 'intentos'}</span>
                        </p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                /* Extracted data confirmation */
                <div className="space-y-4">
                  <div className="bg-forest/5 border border-forest/20 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold text-forest uppercase tracking-wide mb-3">Datos extraídos — confirma que son correctos</p>
                    {idResult?.full_name && (
                      <div>
                        <p className="text-xs text-gray-400">Nombre completo</p>
                        <p className="text-sm font-semibold text-gray-800">{idResult.full_name}</p>
                      </div>
                    )}
                    {idResult?.identification_number && (
                      <div>
                        <p className="text-xs text-gray-400">{idResult.document_label || config?.label || 'N° documento'}</p>
                        <p className="text-sm font-semibold text-gray-800">{idResult.identification_number}</p>
                      </div>
                    )}
                    {idResult?.birth_date && (
                      <div>
                        <p className="text-xs text-gray-400">Fecha de nacimiento</p>
                        <p className="text-sm font-semibold text-gray-800">{idResult.birth_date}</p>
                      </div>
                    )}
                  </div>

                  {idError && (
                    <div className="flex gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{idError}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={resetIdUpload}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                      <RotateCcw className="w-4 h-4" /> Volver a subir
                    </button>
                    <button
                      onClick={handleIdConfirm}
                      disabled={idStatus === 'saving'}
                      className="flex-1 flex items-center justify-center gap-2 bg-forest text-white py-2.5 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors disabled:opacity-60"
                    >
                      {idStatus === 'saving' ? (
                        <><Loader className="w-4 h-4 animate-spin" /> Guardando...</>
                      ) : (
                        <>Confirmar y continuar <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button type="button" onClick={() => setStep(3)}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition py-2">
              Omitir por ahora →
            </button>

            <button type="button" onClick={() => { setStep(1); resetIdUpload(); setError('') }}
              className="w-full text-xs text-gray-300 hover:text-gray-500 transition py-1">
              ← Volver al perfil
            </button>
          </div>
        )}

        {/* ── PASO 3: ELECCIÓN DE PROPIEDAD ── */}
        {step === 3 && (
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

            <button type="button" onClick={() => { setStep(2); setError('') }}
              className="w-full text-sm text-gray-400 hover:text-gray-600 transition py-2">
              ← Volver
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
