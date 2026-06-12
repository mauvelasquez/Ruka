'use client'
import { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { useApp } from '../../lib/store'
import Navbar from '../../components/Navbar'
import ConsentStep  from './components/ConsentStep'
import IdCaptureStep from './components/IdCaptureStep'
import FaceMatchStep from './components/FaceMatchStep'
import ResultStep   from './components/ResultStep'
import DatosBasicosStep from './components/DatosBasicosStep'
import { isValidChileanPhone } from '../../lib/phone'
import { detectUserCountry, SUPPORTED_COUNTRIES, COUNTRY_NAMES, COUNTRY_FLAGS } from '../../lib/country-detection'
import { Shield, FileText, Camera, CheckCircle, Loader, ArrowRight, ChevronDown } from 'lucide-react'

const FACIAL_ENABLED = process.env.NEXT_PUBLIC_FACIAL_VERIFICATION_ENABLED !== 'false'

// Piloto enfocado en Chile: el selector de país del documento queda oculto y
// fijo en 'CL'. Reversible — basta con poner esta env var en 'true' para
// volver a habilitar el selector multi-país (CL/CO/AR/MX).
const COUNTRY_SELECTOR_ENABLED = process.env.NEXT_PUBLIC_VERIFICAR_COUNTRY_SELECTOR_ENABLED === 'true'

const STEPS = FACIAL_ENABLED
  ? [
      { id: 1, label: 'Consentimiento', icon: Shield },
      { id: 2, label: 'Documento',       icon: FileText },
      { id: 3, label: 'Selfie',         icon: Camera },
      { id: 4, label: 'Resultado',      icon: CheckCircle },
    ]
  : [
      { id: 1, label: 'Consentimiento', icon: Shield },
      { id: 2, label: 'Documento',       icon: FileText },
      { id: 3, label: 'Resultado',      icon: CheckCircle },
    ]

const RESULT_STEP = FACIAL_ENABLED ? 4 : 3

function Stepper({ current }) {
  return (
    <div className="flex items-center justify-between w-full max-w-sm mx-auto mb-8">
      {STEPS.map((step, i) => {
        const Icon      = step.icon
        const done      = current > step.id
        const active    = current === step.id
        const isLast    = i === STEPS.length - 1
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                done    ? 'bg-forest text-white' :
                active  ? 'bg-terra text-white' :
                          'bg-sand/60 text-gray-400'
              }`}>
                {done
                  ? <CheckCircle className="w-4 h-4" />
                  : <Icon className="w-4 h-4" />
                }
              </div>
              <span className={`text-xs font-medium sm:block ${
                active ? 'text-terra block' : done ? 'text-forest hidden sm:block' : 'text-gray-400 hidden sm:block'
              }`}>{step.label}</span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-1 rounded-full transition-colors ${
                current > step.id ? 'bg-forest' : 'bg-gray-200'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function CountrySelector({ country, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div ref={ref} className="relative flex justify-center mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:border-forest/40 transition-colors shadow-sm"
      >
        <span>{COUNTRY_FLAGS[country]}</span>
        <span>{COUNTRY_NAMES[country]}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>
      {open && (
        <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 min-w-[140px]">
          {SUPPORTED_COUNTRIES.map(c => (
            <button
              key={c}
              onClick={() => { onChange(c); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors text-left ${c === country ? 'text-forest font-bold' : 'text-gray-700'}`}
            >
              <span>{COUNTRY_FLAGS[c]}</span>
              <span>{COUNTRY_NAMES[c]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ACTION_ROUTES = {
  publish: '/dashboard?tab=hogar',
  contact: '/dashboard',
  match:   '/homes',
}

function ExistingProfileStep({ profile, action, onSkip, onVerified }) {
  const router = useRouter()
  const [status, setStatus] = useState('idle') // idle | saving | done | error

  const handleConfirm = async () => {
    setStatus('saving')
    try {
      const res = await fetch('/api/verify-id/confirm-existing', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        await onVerified()
        setStatus('done')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const navigate = (path) => { window.location.href = path }

  if (status === 'done') {
    return (
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-forest" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">¡Identidad verificada!</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Tu cuenta ahora está verificada. Ya puedes acceder a todas las funciones de Rukka.
          </p>
        </div>
        {action && ACTION_ROUTES[action] && (
          <button
            onClick={() => navigate(ACTION_ROUTES[action])}
            className="w-full flex items-center justify-center gap-2 bg-forest text-white py-3.5 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors py-1"
        >
          Ir al dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-black text-gray-900 mb-1">Datos ya registrados</h2>
        <p className="text-sm text-gray-500">Ya tenemos tu información del documento guardada</p>
      </div>

      <div className="bg-forest/5 border border-forest/20 rounded-xl p-4 space-y-2">
        <p className="text-xs font-bold text-forest uppercase tracking-wide mb-3">Datos del documento</p>
        {profile.id_full_name && (
          <div>
            <p className="text-xs text-gray-400">Nombre</p>
            <p className="text-sm font-semibold text-gray-800">{profile.id_full_name}</p>
          </div>
        )}
        {profile.identification_number && (
          <div>
            <p className="text-xs text-gray-400">Número de documento</p>
            <p className="text-sm font-semibold text-gray-800">{profile.identification_number}</p>
          </div>
        )}
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600 text-center">Error al confirmar. Intenta nuevamente.</p>
      )}

      <button
        onClick={handleConfirm}
        disabled={status === 'saving'}
        className="w-full flex items-center justify-center gap-2 bg-forest text-white py-3.5 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors disabled:opacity-60"
      >
        {status === 'saving' ? (
          <><Loader className="w-4 h-4 animate-spin" />Verificando...</>
        ) : (
          <>Confirmar identidad<ArrowRight className="w-4 h-4" /></>
        )}
      </button>

      <button
        onClick={onSkip}
        className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
      >
        Subir documento nuevamente
      </button>
    </div>
  )
}

function VerificarContent() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const { syncSession } = useApp()

  const [step, setStep]             = useState(1)
  const [country, setCountry]       = useState('CL')
  const [ocrResult, setOcrResult]   = useState(null)   // { extracted_data, idImageBase64 }
  const [faceResult, setFaceResult] = useState(null)   // { match, distance, confidence }
  const [attemptsLeft, setAttemptsLeft] = useState(3)
  const [idImageBase64, setIdImageBase64] = useState(null)
  const [existingProfile, setExistingProfile] = useState(null)
  const [forceUpload, setForceUpload] = useState(false)
  const [basicData, setBasicData] = useState(null) // { phone, country_user } | null mientras carga

  // Detect country by IP on mount (solo si el selector multi-país está habilitado)
  useEffect(() => {
    if (!COUNTRY_SELECTOR_ENABLED) return
    detectUserCountry().then(setCountry)
  }, [])

  useEffect(() => {
    async function checkProfile() {
      try {
        if (!supabase) { setBasicData({ phone: null, country_user: null }); return }
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setBasicData({ phone: null, country_user: null }); return }
        const { data: profile } = await supabase
          .from('profiles')
          .select('id_full_name, identification_number, birth_date, phone, country_user')
          .eq('id', user.id)
          .single()
        if (profile?.identification_number && profile?.id_full_name) {
          setExistingProfile(profile)
        }
        setBasicData({ phone: profile?.phone ?? null, country_user: profile?.country_user ?? null })
      } catch {
        setBasicData({ phone: null, country_user: null })
      }
    }
    checkProfile()
  }, [])

  const handleConsent = () => setStep(2)

  const handleOcrSuccess = (data) => {
    setOcrResult(data)
    setIdImageBase64(data.idImageBase64 ?? null)
    if (!FACIAL_ENABLED) {
      setFaceResult({ match: true, distance: 0, ocr_only: true })
      setStep(RESULT_STEP)
    } else {
      setStep(3)
    }
  }

  const handleFaceSuccess = (result) => {
    setFaceResult(result)
    setStep(4)
  }

  const handleRetry = () => {
    setAttemptsLeft(prev => prev - 1)
    setFaceResult(null)
    setStep(3)
  }

  const showExistingProfile = step === 2 && existingProfile && !forceUpload

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F4EE' }}>
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-10">
        <div className="w-full max-w-md">
          <Stepper current={step} />

          {/* Country selector — visible only on consent step */}
          {step === 1 && COUNTRY_SELECTOR_ENABLED && (
            <CountrySelector country={country} onChange={setCountry} />
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {step === 1 && !basicData && (
              <div className="flex items-center justify-center py-10">
                <Loader className="w-6 h-6 text-forest animate-spin" />
              </div>
            )}

            {step === 1 && basicData && !isValidChileanPhone(basicData.phone) && (
              <DatosBasicosStep
                initialPhone={basicData.phone}
                needsCountryUser={!basicData.country_user}
                onComplete={(phone) => setBasicData(prev => ({ ...prev, phone }))}
              />
            )}

            {step === 1 && basicData && isValidChileanPhone(basicData.phone) && (
              <ConsentStep onAccept={handleConsent} country={country} />
            )}

            {step === 2 && showExistingProfile && (
              <ExistingProfileStep
                profile={existingProfile}
                action={action}
                onSkip={() => setForceUpload(true)}
                onVerified={syncSession}
              />
            )}

            {step === 2 && !showExistingProfile && (
              <IdCaptureStep
                onSuccess={handleOcrSuccess}
                country={country}
              />
            )}

            {FACIAL_ENABLED && step === 3 && ocrResult && (
              <FaceMatchStep
                ocrResult={{ ...ocrResult, idImageBase64 }}
                onSuccess={handleFaceSuccess}
              />
            )}

            {step === RESULT_STEP && ocrResult && faceResult && (
              <ResultStep
                ocrResult={ocrResult}
                faceResult={faceResult}
                action={action}
                attemptsLeft={attemptsLeft}
                onRetry={handleRetry}
              />
            )}
          </div>

          {step < RESULT_STEP && (
            <div className="text-center mt-3">
              <button
                onClick={() => { window.location.href = '/dashboard' }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Omitir por ahora →
              </button>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-4">
            Tu documento se procesa de forma segura en nuestros servidores. No almacenamos imágenes de tu documento.
          </p>
          <p className="text-center text-xs text-gray-400 mt-1">
            La verificación de rostro ocurre en tu dispositivo y no se almacena.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function VerificarPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
          <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <VerificarContent />
      </Suspense>
    </>
  )
}
