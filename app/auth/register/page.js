'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '../../../lib/store'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import RukkaLogo from '../../../components/RukkaLogo'

export default function RegisterPage() {
  const { register, loginWithGoogle } = useApp()
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
    // Si Supabase no requiere confirmación de email, la sesión ya existe → ir directo al onboarding
    router.push(res.confirmRequired ? '/auth/confirm' : '/dashboard')
  }

  return (
    <div className="min-h-screen flex items-start justify-center p-4 py-8 overflow-y-auto" style={{ background: '#F8F4EE' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-4">
            <RukkaLogo height={56} />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Crea tu cuenta</h1>
          <p className="text-gray-500 mt-1 text-sm">Intercambia tu hogar en Chile, México, Colombia y Argentina</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <button type="button" onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm mb-5">
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">o continúa con email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Nombre completo</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Tu nombre" required
                autoComplete="name" enterKeyHint="next"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-forest transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com" required
                autoComplete="email" inputMode="email" enterKeyHint="next"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-forest transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Contraseña</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres" required
                  autoComplete="new-password" enterKeyHint="go"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-forest" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400">
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

          <p className="mt-4 text-center text-sm text-terra font-medium">
            🪙 Al completar tu perfil recibes <span className="font-bold">3 Yankis de bienvenida</span>.
          </p>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Al registrarte aceptas nuestros{' '}
              <a href="/terminos" className="text-forest hover:underline">Términos</a> y{' '}
              <a href="/terminos#privacidad" className="text-forest hover:underline">Política de privacidad</a>
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
