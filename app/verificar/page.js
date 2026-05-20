'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { Shield, Clock } from 'lucide-react'

const ACTION_CONTEXT = {
  publish: 'Querías publicar tu hogar',
  contact: 'Querías contactar a un usuario',
  match:   'Querías buscar matches',
}

function VerificarContent() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#F8F4EE' }}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-forest/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Shield className="w-8 h-8 text-forest" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">Verificación de identidad</h1>

        {action && ACTION_CONTEXT[action] && (
          <p className="text-xs font-bold text-terra uppercase tracking-wide mb-4">
            {ACTION_CONTEXT[action]}
          </p>
        )}

        <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700 font-medium">Próximamente — Estamos construyendo este proceso</p>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Pronto podrás verificar tu identidad para acceder a todas las funciones de Rukka.
          Te avisaremos cuando esté disponible.
        </p>

        <Link href="/dashboard"
          className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors">
          Volver al dashboard
        </Link>
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
