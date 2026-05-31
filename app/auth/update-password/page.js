'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import RukkaLogo from '../../../components/RukkaLogo'
import { supabase } from '../../../lib/supabase'

export default function UpdatePasswordPage() {
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw,          setShowPw]          = useState(false)
  const [showConfirmPw,   setShowConfirmPw]   = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [success,         setSuccess]         = useState(false)
  const [error,           setError]           = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (err) {
      setError(err.message || 'No pudimos actualizar tu contraseña. Intenta de nuevo.')
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
          <h1 className="text-2xl font-extrabold text-gray-900">Nueva contraseña</h1>
          <p className="text-gray-500 mt-1 text-sm">Elige una contraseña segura para tu cuenta.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-black text-gray-900 mb-2">Contraseña actualizada</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tu contraseña fue actualizada. Ahora puedes iniciar sesión.
              </p>
              <Link href="/auth/login"
                className="mt-6 w-full bg-forest text-white py-3.5 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors flex items-center justify-center gap-2">
                Ir a iniciar sesión <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="new-password" className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Nueva contraseña</label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    autoComplete="new-password"
                    enterKeyHint="next"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-forest transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Confirmar contraseña</label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    required
                    autoComplete="new-password"
                    enterKeyHint="go"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-forest transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    aria-label={showConfirmPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-gray-600">
                    {showConfirmPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
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
                  : <>Actualizar contraseña <ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
