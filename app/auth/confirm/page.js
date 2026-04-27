'use client'
import Link from 'next/link'
import { Mountain, Mail, ArrowRight } from 'lucide-react'

export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F8F4EE' }}>
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-8">
          <div className="w-12 h-12 landscape-gradient rounded-2xl flex items-center justify-center shadow-lg">
            <Mountain className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-forest-dark">Rukka</span>
        </Link>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
          <div className="w-20 h-20 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-forest" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">¡Revisa tu email!</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Te enviamos un enlace de confirmación. Haz clic en él para activar tu cuenta y completar tu perfil.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6">
            <p className="text-amber-800 text-xs font-bold mb-1">📬 ¿No encuentras el email?</p>
            <p className="text-amber-700 text-xs">Revisa tu carpeta de spam o correo no deseado.</p>
          </div>
          <Link href="/auth/login"
            className="w-full bg-forest text-white py-3.5 rounded-xl font-bold hover:bg-forest-dark transition-colors flex items-center justify-center gap-2 text-sm">
            Ir a iniciar sesión <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
