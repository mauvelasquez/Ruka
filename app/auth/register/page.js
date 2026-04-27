'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '../../../lib/store'
import { Mountain, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useApp()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Ingresa tu nombre'); return }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    const res = await register(form)
    setLoading(false)
    if (!res.success) { setError(res.error || 'Error al crear la cuenta'); return }
    router.push('/auth/confirm')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{ background: '#F8F4EE' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-4">
            <div className="w-12 h-12 landscape-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <Mountain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-forest-dark">Rukka</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Crea tu cuenta</h1>
          <p className="text-gray-500 mt-1 text-sm">Gratis, sin letra chica, solo para Chile 🇨🇱</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Nombre completo</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Tu nombre" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Contraseña</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-forest" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-forest text-white py-3.5 rounded-xl font-bold hover:bg-forest-dark disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <>Crear cuenta <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Al registrarte aceptas nuestros{' '}
              <a href="#" className="text-forest hover:underline">Términos</a> y{' '}
              <a href="#" className="text-forest hover:underline">Política de privacidad</a>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-forest font-bold hover:text-forest-dark">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}
