'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowRight, X, CheckCircle, Clock, Users, MapPin, BedDouble, Bath, Wifi, AlertTriangle, RefreshCw } from 'lucide-react'

// Fases mapeadas al flujo real del backend:
// 0-5s   → validación de URL y auth
// 5-15s  → Apify arranca el actor y conecta a Airbnb
// 15-28s → Airbnb responde y descarga listing + metadata
// 28-38s → descarga y procesamiento de fotos (la parte más lenta)
// 38-45s → mapeo de datos al formato Rukka y cierre
const STEPS = [
  {
    seconds: 5,
    label:   'Iniciando importación',
    detail:  'Verificando el link y enviando al servicio de importación…',
    tip:     null,
  },
  {
    seconds: 10,
    label:   'Conectando con Airbnb',
    detail:  'El servicio está sorteando las protecciones de Airbnb. Esto es lo que más tarda.',
    tip:     'Airbnb bloquea el acceso automático. Nuestro servicio usa técnicas especiales — puede tomar un momento.',
  },
  {
    seconds: 13,
    label:   'Leyendo tu propiedad',
    detail:  'Obteniendo título, descripción, habitaciones, baños y capacidad…',
    tip:     '¡Ya accedimos! Ahora descargamos los datos del listing.',
  },
  {
    seconds: 10,
    label:   'Descargando fotos',
    detail:  'Las imágenes son lo más pesado. Cuantas más fotos tenga tu listing, más tarda.',
    tip:     'Cada foto se descarga y verifica individualmente. Listings con 20+ fotos pueden tardar más.',
  },
  {
    seconds: 7,
    label:   'Organizando tus datos',
    detail:  'Mapeando amenities, ubicación y datos finales al formato Rukka…',
    tip:     '¡Casi listo! En segundos verás un resumen para confirmar.',
  },
]

const TOTAL_SECONDS = STEPS.reduce((s, st) => s + st.seconds, 0) // 45 s
const ABORT_TIMEOUT_MS = 48000 // 48 s — margen sobre el timeout de Vercel (60 s)

// Tips rotativos para mantener al usuario tranquilo durante la espera
const ROTATING_TIPS = [
  'No cierres ni recargues esta ventana. El proceso continúa aunque la barra no avance.',
  'Si falla al primer intento, espera 10 segundos e intenta de nuevo — suele funcionar.',
  'Una vez importado, puedes editar o completar cualquier campo manualmente.',
  'Los listings con muchas reseñas o fotos pueden tardar un poco más.',
  'Si Airbnb cambió recientemente el layout de tu propiedad, puede fallar. Es normal.',
]

export default function AirbnbImport({ onImport }) {
  const [url,     setUrl]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [errorType, setErrorType] = useState(null)
  const [pending, setPending] = useState(null)
  const [done,    setDone]    = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [step,    setStep]    = useState(0)
  const startRef = useRef(null)

  // Temporizador de progreso durante la carga
  useEffect(() => {
    if (!loading) return
    startRef.current = Date.now()
    setElapsed(0)
    setStep(0)

    const iv = setInterval(() => {
      const secs = Math.floor((Date.now() - startRef.current) / 1000)
      setElapsed(secs)
      let cum = 0
      for (let i = 0; i < STEPS.length; i++) {
        cum += STEPS[i].seconds
        if (secs < cum) { setStep(i); break }
        if (i === STEPS.length - 1) setStep(i)
      }
    }, 400)

    return () => clearInterval(iv)
  }, [loading])

  if (done) return null

  if (pending) {
    return (
      <ConfirmPreview
        propiedad={pending}
        onConfirm={() => { onImport(pending); setDone(true) }}
        onCancel={() => { setPending(null); setUrl(''); setError(''); setErrorType(null) }}
      />
    )
  }

  const handleImport = async (e) => {
    e.preventDefault()
    if (!url.trim()) return
    setError('')
    setErrorType(null)
    setLoading(true)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), ABORT_TIMEOUT_MS)

    try {
      const res = await fetch('/api/airbnb-import', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ url: url.trim() }),
        signal:  controller.signal,
      })
      clearTimeout(timeoutId)
      const data = await res.json()

      if (!res.ok) {
        setErrorType(data?.errorType ?? 'UNKNOWN')
        setError(data.error || 'Error al importar. Intenta de nuevo.')
        return
      }
      setPending(data.propiedad)
    } catch (err) {
      clearTimeout(timeoutId)
      setErrorType(err.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK')
      setError(
        err.name === 'AbortError'
          ? 'La importación tardó demasiado. Espera unos segundos e intenta de nuevo.'
          : 'Error de conexión. Verifica tu internet e intenta de nuevo.'
      )
    } finally {
      setLoading(false)
    }
  }

  const progress = Math.min((elapsed / TOTAL_SECONDS) * 100, 96)

  return (
    <div className="bg-gradient-to-br from-[#ff5a5f]/8 to-[#ff5a5f]/4 border border-[#ff5a5f]/20 rounded-2xl p-5 mb-6">

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl">🏠</span>
        <div>
          <p className="font-black text-gray-900 text-base">¿Tu propiedad está en Airbnb?</p>
          <p className="text-gray-500 text-sm">
            Pega el link y llenamos fotos, descripción, capacidad y amenities automáticamente.
          </p>
        </div>
      </div>

      {/* Aviso de beta — siempre visible */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-3">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-bold">Función en fase de prueba.</span>{' '}
          Puede fallar ocasionalmente por las protecciones de Airbnb.
          Si no funciona al primer intento, espera unos segundos y vuelve a intentarlo.
          El proceso puede tomar entre <span className="font-bold">1 y 3 minutos</span> en total.
        </p>
      </div>

      {/* Loading o formulario */}
      {loading ? (
        <LoadingProgress step={step} elapsed={elapsed} progress={progress} />
      ) : (
        <form onSubmit={handleImport} className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={e => { setUrl(e.target.value); setError(''); setErrorType(null) }}
            placeholder="https://www.airbnb.cl/rooms/12345..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]/40 bg-white min-w-0"
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className="flex items-center gap-2 bg-[#ff5a5f] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#e0484d] disabled:opacity-50 transition-colors whitespace-nowrap flex-shrink-0"
          >
            <ArrowRight className="w-4 h-4" /> Importar
          </button>
        </form>
      )}

      {/* Error con contexto según tipo */}
      {error && !loading && (
        <ErrorFeedback type={errorType} message={error} onRetry={() => { setError(''); setErrorType(null) }} />
      )}

      {/* Campos que se importan (solo cuando no hay error ni carga) */}
      {!error && !loading && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {['Fotos', 'Descripción', 'Capacidad', 'Habitaciones', 'Amenities', 'Ubicación'].map(f => (
            <span key={f} className="text-xs text-gray-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" /> {f}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Gestor de progreso con comunicación por fases ─────────────────────────────
function LoadingProgress({ step: currentStep, elapsed, progress }) {
  const [tipIdx, setTipIdx] = useState(0)
  const phase = STEPS[currentStep] ?? STEPS[STEPS.length - 1]
  const isSlowZone = elapsed > 30 // después de 30s, entramos en zona crítica

  // Rota tips cada 8 segundos
  useEffect(() => {
    const iv = setInterval(() => setTipIdx(i => (i + 1) % ROTATING_TIPS.length), 8000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="space-y-3.5">

      {/* Barra de progreso */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Importando…
          </span>
          <span className={`text-xs flex items-center gap-1 ${isSlowZone ? 'text-amber-500 font-semibold' : 'text-gray-400'}`}>
            <Clock className="w-3 h-3" />
            {elapsed}s {isSlowZone ? '— casi termina, aguanta' : 'transcurridos'}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${isSlowZone ? 'bg-amber-400' : 'bg-[#ff5a5f]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Fase activa con spinner + descripción */}
      <div className="flex items-start gap-3 bg-white/60 rounded-xl px-3 py-2.5">
        <div className="w-4 h-4 border-2 border-[#ff5a5f] border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 leading-tight">{phase.label}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{phase.detail}</p>
          {phase.tip && (
            <p className="text-xs text-[#ff5a5f]/80 mt-1 italic">{phase.tip}</p>
          )}
        </div>
      </div>

      {/* Lista de pasos completados + activo */}
      <div className="space-y-1.5">
        {STEPS.map((s, i) => {
          const done   = i < currentStep
          const active = i === currentStep
          return (
            <div key={i} className={`flex items-center gap-2 text-xs transition-all ${
              done   ? 'text-green-600'
              : active ? 'text-gray-800 font-semibold'
              : 'text-gray-300'
            }`}>
              {done ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              ) : active ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#ff5a5f] bg-[#ff5a5f]/10 flex-shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 flex-shrink-0" />
              )}
              {s.label}
            </div>
          )
        })}
      </div>

      {/* Tip rotativo — principal fuente de calma */}
      <div className="flex items-start gap-2 bg-white/70 border border-gray-100 rounded-xl px-3 py-2.5">
        <span className="text-base leading-none flex-shrink-0">💡</span>
        <p className="text-xs text-gray-500 leading-relaxed transition-all">
          {ROTATING_TIPS[tipIdx]}
        </p>
      </div>

      <p className="text-center text-xs text-gray-400">
        No cierres esta ventana · máx. 48 segundos por intento
      </p>
    </div>
  )
}

// ── Feedback de error contextualizado por tipo ────────────────────────────────
function ErrorFeedback({ type, message, onRetry }) {
  const isRetryable = type === 'TIMEOUT' || type === 'PROXY_BLOCK' || type === 'UNKNOWN' || type === 'NETWORK'

  const context = {
    TIMEOUT:     'Airbnb tardó demasiado en responder. Suele resolverse al reintentar.',
    PROXY_BLOCK: 'Airbnb bloqueó temporalmente la conexión. Espera 30 segundos e intenta de nuevo.',
    INVALID_URL: 'Verifica que el link sea de un listing individual (airbnb.cl/rooms/12345).',
    NOT_FOUND:   'No encontramos datos para ese listing. Puede estar inactivo o ser privado.',
    NETWORK:     'Problema de conexión a internet. Verifica tu red.',
    UNKNOWN:     'Error inesperado. Intenta de nuevo en unos segundos.',
  }[type] ?? 'Intenta de nuevo o ingresa los datos manualmente.'

  return (
    <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 space-y-2">
      <div className="flex items-start gap-2">
        <X className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-red-700">{message}</p>
          <p className="text-xs text-red-500 mt-0.5">{context}</p>
        </div>
      </div>
      {isRetryable && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
        >
          <RefreshCw className="w-3 h-3" /> Intentar de nuevo
        </button>
      )}
    </div>
  )
}

// ── Vista previa para confirmar datos importados ──────────────────────────────
function ConfirmPreview({ propiedad, onConfirm, onCancel }) {
  return (
    <div className="bg-white border border-green-200 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        <p className="font-black text-gray-900 text-base">Datos encontrados en Airbnb</p>
      </div>

      <div className="space-y-3 mb-5">
        {propiedad.fotos?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Fotos ({propiedad.fotos.length})
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {propiedad.fotos.slice(0, 6).map((src, i) => (
                <img key={i} src={src} alt=""
                  className="w-20 h-14 object-cover rounded-lg flex-shrink-0 bg-gray-100" />
              ))}
              {propiedad.fotos.length > 6 && (
                <div className="w-20 h-14 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs text-gray-400 font-semibold">
                  +{propiedad.fotos.length - 6}
                </div>
              )}
            </div>
          </div>
        )}

        {propiedad.titulo && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Título</p>
            <p className="text-sm text-gray-800 font-semibold leading-snug">{propiedad.titulo}</p>
          </div>
        )}

        {propiedad.descripcion && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Descripción</p>
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{propiedad.descripcion}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {propiedad.capacidad && (
            <span className="flex items-center gap-1.5 text-sm text-gray-700">
              <Users className="w-4 h-4 text-gray-400" /> {propiedad.capacidad} huéspedes
            </span>
          )}
          {propiedad.habitaciones && (
            <span className="flex items-center gap-1.5 text-sm text-gray-700">
              <BedDouble className="w-4 h-4 text-gray-400" /> {propiedad.habitaciones} dormitorios
            </span>
          )}
          {propiedad.banos && (
            <span className="flex items-center gap-1.5 text-sm text-gray-700">
              <Bath className="w-4 h-4 text-gray-400" /> {propiedad.banos} baños
            </span>
          )}
          {propiedad.amenities?.length > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-gray-700">
              <Wifi className="w-4 h-4 text-gray-400" /> {propiedad.amenities.length} amenities
            </span>
          )}
          {propiedad.ubicacion && (
            <span className="flex items-center gap-1.5 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400" /> {propiedad.ubicacion}
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-3">
        Revisa que los datos se vean bien. Puedes editarlos en el formulario después de confirmar.
      </p>

      <div className="flex gap-2">
        <button type="button" onClick={onConfirm}
          className="flex-1 bg-forest text-white py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
          ✓ Usar estos datos
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  )
}
