'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowRight, X, CheckCircle, Clock, Users, MapPin, BedDouble, Bath, Wifi } from 'lucide-react'

const STEPS = [
  { label: 'Conectando con Airbnb',        seconds: 5  },
  { label: 'Descargando información',      seconds: 15 },
  { label: 'Procesando fotos y amenities', seconds: 12 },
  { label: 'Preparando tus datos',         seconds: 8  },
]
const TOTAL_SECONDS = STEPS.reduce((s, step) => s + step.seconds, 0) // 40 s
const ABORT_TIMEOUT_MS = 45000 // 45 s — abortar antes del timeout de Cloudflare

export default function AirbnbImport({ onImport }) {
  const [url,     setUrl]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [pending, setPending] = useState(null) // datos esperando confirmación
  const [done,    setDone]    = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [step,    setStep]    = useState(0)
  const startRef = useRef(null)

  // Temporizador durante loading
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
        onCancel={() => { setPending(null); setUrl('') }}
      />
    )
  }

  const handleImport = async (e) => {
    e.preventDefault()
    if (!url.trim()) return
    setError('')
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
        const errorType = data?.errorType
        if (errorType === 'TIMEOUT') {
          setError('El servicio de Airbnb está demorando. Por favor, intenta de nuevo o ingresa los datos manualmente.')
        } else if (errorType === 'PROXY_BLOCK') {
          setError('Airbnb bloqueó la conexión. Por favor ingresa los datos manualmente.')
        } else if (errorType === 'INVALID_URL') {
          setError(data.error || 'Ingresa un link válido de Airbnb.')
        } else {
          setError(data.error || 'Error al importar. Intenta de nuevo.')
        }
        return
      }
      setPending(data.propiedad)
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        setError('El servicio de Airbnb está demorando. Por favor, intenta de nuevo o ingresa los datos manualmente.')
      } else {
        setError('Error de conexión. Verifica tu internet e intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const progress  = Math.min((elapsed / TOTAL_SECONDS) * 100, 95)
  const remaining = Math.max(TOTAL_SECONDS - elapsed, 0)

  return (
    <div className="bg-gradient-to-br from-[#ff5a5f]/8 to-[#ff5a5f]/4 border border-[#ff5a5f]/20 rounded-2xl p-5 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-xl">🏠</span>
        <div>
          <p className="font-black text-gray-900 text-base">¿Tu propiedad está en Airbnb?</p>
          <p className="text-gray-500 text-sm">
            Pega el link y llenamos fotos, descripción, capacidad y amenities automáticamente.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingProgress steps={STEPS} currentStep={step} elapsed={elapsed} remaining={remaining} progress={progress} />
      ) : (
        <form onSubmit={handleImport} className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={e => { setUrl(e.target.value); setError('') }}
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

      {error && (
        <p className="text-xs text-red-600 mt-2 flex items-center gap-1.5">
          <X className="w-3 h-3 flex-shrink-0" /> {error}
        </p>
      )}

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

// ── Gestor de progreso ────────────────────────────────────────────────────────
function LoadingProgress({ steps, currentStep, elapsed, remaining, progress }) {
  return (
    <div className="space-y-4">
      {/* Barra de progreso */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-semibold text-gray-800">
            {steps[currentStep]?.label}…
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {remaining > 0 ? `~${remaining}s restantes` : 'Finalizando…'}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#ff5a5f] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Lista de pasos */}
      <div className="space-y-2">
        {steps.map((s, i) => {
          const isDone   = i < currentStep
          const isActive = i === currentStep
          return (
            <div
              key={i}
              className={`flex items-center gap-2.5 text-sm transition-colors ${
                isDone   ? 'text-green-600'
                : isActive ? 'text-gray-900 font-semibold'
                : 'text-gray-300'
              }`}
            >
              {isDone ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : isActive ? (
                <div className="w-4 h-4 border-2 border-[#ff5a5f] border-t-transparent rounded-full animate-spin flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
              )}
              {s.label}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400">
        Esto puede tardar hasta 60 segundos. No cierres la ventana.
      </p>
    </div>
  )
}

// ── Vista previa para confirmar ───────────────────────────────────────────────
function ConfirmPreview({ propiedad, onConfirm, onCancel }) {
  return (
    <div className="bg-white border border-green-200 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        <p className="font-black text-gray-900 text-base">Datos encontrados en Airbnb</p>
      </div>

      <div className="space-y-3 mb-5">
        {/* Fotos */}
        {propiedad.fotos?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Fotos ({propiedad.fotos.length})
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {propiedad.fotos.slice(0, 6).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-20 h-14 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                />
              ))}
              {propiedad.fotos.length > 6 && (
                <div className="w-20 h-14 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs text-gray-400 font-semibold">
                  +{propiedad.fotos.length - 6}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Título */}
        {propiedad.titulo && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Título</p>
            <p className="text-sm text-gray-800 font-semibold leading-snug">{propiedad.titulo}</p>
          </div>
        )}

        {/* Descripción */}
        {propiedad.descripcion && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Descripción</p>
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{propiedad.descripcion}</p>
          </div>
        )}

        {/* Stats */}
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

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 bg-forest text-white py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors"
        >
          ✓ Usar estos datos
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
