'use client'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Loader, AlertCircle, ArrowRight, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../../lib/store'

const ACTION_LABELS = {
  publish: 'Publicar tu hogar',
  contact: 'Contactar usuario',
  match:   'Buscar matches',
}

const ACTION_ROUTES = {
  publish: '/dashboard?tab=hogar',
  contact: '/dashboard',
  match:   '/homes',
}

export default function ResultStep({ ocrResult, faceResult, action, onRetry, attemptsLeft }) {
  const router  = useRouter()
  const { syncSession } = useApp()
  const [status, setStatus] = useState('saving') // saving | verified | failed | pending | error
  const [errorMsg, setErrorMsg] = useState(null)

  const navigate = (path) => { window.location.href = path }

  useEffect(() => {
    if (!faceResult) return
    // OCR-only mode: profile already marked verified by the extract API route
    if (faceResult.ocr_only) {
      syncSession().catch(() => {}).finally(() => setStatus('verified'))
      return
    }
    async function save() {
      try {
        const res = await fetch('/api/verify-id/complete', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rut:            ocrResult.extracted_data.rut,
            match:          faceResult.match,
            distance:       faceResult.distance,
            extracted_data: {
              nombre_completo:  ocrResult.extracted_data.nombre_completo,
              fecha_nacimiento: ocrResult.extracted_data.fecha_nacimiento,
              fecha_vencimiento: ocrResult.extracted_data.fecha_vencimiento,
            },
          }),
        })
        const data = await res.json()
        if (data.success) {
          await syncSession().catch(() => {})
          setStatus('verified')
        } else if (data.status === 'pending') {
          setStatus('pending')
          setErrorMsg(data.error)
        } else {
          setStatus('failed')
          setErrorMsg(data.error)
        }
      } catch {
        setStatus('error')
        setErrorMsg('Error de conexión al guardar el resultado.')
      }
    }
    save()
  }, [faceResult, ocrResult])

  if (status === 'saving') {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <Loader className="w-10 h-10 text-forest animate-spin" />
        <p className="text-sm font-medium text-gray-600">Guardando resultado...</p>
      </div>
    )
  }

  if (status === 'verified') {
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
            {ACTION_LABELS[action] || 'Continuar'}
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

  if (status === 'pending') {
    return (
      <div className="space-y-5 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Revisión manual</h2>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{errorMsg}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          Te contactaremos por email en los próximos días hábiles para completar el proceso.
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-forest text-white py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors"
        >
          Ir al dashboard
        </button>
      </div>
    )
  }

  // failed or error
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-xl font-black text-gray-900">Verificación fallida</h2>
        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">{errorMsg || 'No pudimos verificar tu identidad.'}</p>
      </div>

      {attemptsLeft > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">
            Te quedan <span className="font-bold text-gray-700">{attemptsLeft} {attemptsLeft === 1 ? 'intento' : 'intentos'}</span> disponibles
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {attemptsLeft > 0 && (
          <button
            onClick={onRetry}
            className="w-full bg-forest text-white py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors"
          >
            Reintentar verificación
          </button>
        )}
        <a
          href="mailto:soporte@rukka.cl"
          className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Contactar soporte
        </a>
      </div>
    </div>
  )
}
