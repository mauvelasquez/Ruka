'use client'
import { useRouter } from 'next/navigation'
import { Shield, X } from 'lucide-react'

const ACTION_LABELS = {
  publish: 'publicar tu hogar',
  contact: 'contactar a este usuario',
  match:   'buscar matches',
}

export default function VerificationRequiredModal({ action, onClose }) {
  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <button onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-forest/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-forest" />
        </div>

        <h2 className="text-lg font-black text-gray-900 text-center mb-2">
          Verificación requerida
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Para {ACTION_LABELS[action] || 'realizar esta acción'} necesitamos verificar tu identidad.
          Nos tomamos en serio la seguridad de nuestra comunidad.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => { onClose(); router.push(`/verificar?action=${action}`) }}
            className="w-full bg-forest text-white py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
            Verificar ahora
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
            Más tarde
          </button>
        </div>
      </div>
    </div>
  )
}
