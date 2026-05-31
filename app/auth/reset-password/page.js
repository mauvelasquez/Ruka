'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import RukkaLogo from '../../../components/RukkaLogo'
import { supabase } from '../../../lib/supabase'

export default function ResetPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_APP_URL + '/auth/update-password',
    })
    setLoading(false)
    if (err) {
      setError(err.message || 'No pudimos enviar el email. Intenta de nuevo.')
    } else {
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F8F4EE' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-4">
            <RukkaLogo height={56} />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Recuperar contraseña</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Ingresa tu email y te enviaremos un link para restablecer tu contraseña.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-black text-gray-900 mb-2">¡Revisa tu email!</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Revisa tu email — enviamos un link para restablecer tu contraseña.
              </p>
              <p className="text-gray-400 text-xs mt-3">
                El email puede tardar hasta 2 minutos. Revisa también tu carpeta de spam.
              </p>
              <Link href="/auth/login"
                className="mt-6 inline-flex items-center gap-2 text-forest font-bold text-sm hover:text-forest-dark">
                <ArrowLeft className="w-4 h-4" /> Volver a iniciar sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                  inputMode="email"
                  enterKeyHint="send"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-forest transition-all bg-white"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-forest text-white py-3.5 rounded-xl font-bold text-sm hover:bg-forest-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <>Enviar link de recuperación <ArrowRight className="w-4 h-4" /></>
                }
              </button>

              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Volver a iniciar sesión
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
