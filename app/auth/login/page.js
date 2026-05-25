'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../../lib/store'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { getRandomBanner } from '../../../lib/chile-banners'
import RukkaLogo from '../../../components/RukkaLogo'
import { analytics } from '../../../lib/analytics'

const ERROR_MESSAGES = {
  auth_error:       'Error al iniciar sesión con Google. Intenta de nuevo.',
  session_expired:  'La sesión de Google expiró. Por favor intenta de nuevo.',
  timeout:          'El servidor tardó demasiado. Verifica tu conexión e intenta de nuevo.',
  no_code:          'Acceso inválido. Usa el botón de Google para iniciar sesión.',
  profile_creation: 'Sesión iniciada pero hubo un error al crear tu perfil. Intenta de nuevo.',
}

export default function LoginPage() {
  const router = useRouter()
  const { login, loginWithGoogle } = useApp()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [banner,   setBanner]   = useState(null)

  useEffect(() => { setBanner(getRandomBanner()) }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const errParam = params.get('error')
    if (errParam) setError(ERROR_MESSAGES[errParam] || 'Error al iniciar sesión. Intenta de nuevo.')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    analytics.loginAttempt('email')
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      analytics.loginSuccess('email')
      router.push('/dashboard')
    } else {
      setError(result.error || 'Credenciales incorrectas')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F8F4EE' }}>
      {/* Left panel — banner dinámico */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: banner ? `linear-gradient(135deg, ${banner.color} 0%, ${banner.color}dd 100%)` : '#2A5C45' }}>
        {banner && (
          <>
            <div className="absolute inset-0">
              <img src={banner.image} alt={banner.city}
                className="w-full h-full object-cover opacity-30" />
            </div>
            <div className="relative z-10 flex flex-col justify-between p-12 w-full">
              <Link href="/" className="flex items-center gap-3">
                <RukkaLogo height={56} />
              </Link>

              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-1.5 text-sm font-bold mb-6">
                  {banner.emoji} {banner.tagline}
                </div>
                <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                  Chile te está<br />esperando.<br />Sin pagar hotel.
                </h2>
                <p className="text-white/80 text-lg mb-10">{banner.description}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {banner.tags.map(tag => (
                    <span key={tag} className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {['✓ Sin costo de alojamiento', '✓ Sin comisiones ocultas', '✓ Matches automáticos', '✓ Solo en Chile 🇨🇱'].map((b, i) => (
                    <p key={i} className="text-white/70 text-xs">{b}</p>
                  ))}
                </div>
              </div>

              <p className="text-white/40 text-sm">© 2026 Rukka — Intercambio de hogares en Chile</p>
            </div>
          </>
        )}
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <RukkaLogo height={44} />
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Bienvenido de vuelta</h1>
            <p className="text-gray-500 text-sm">Inicia sesión para ver tus matches en Chile</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <button type="button" disabled={loading} onClick={async () => {
            analytics.loginAttempt('google')
            setLoading(true)
            setError('')
            const result = await loginWithGoogle()
            setLoading(false)
            if (result?.error) setError('No se pudo conectar con Google. Verifica tu conexión e intenta de nuevo.')
          }}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm mb-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>
          <p className="text-center text-xs text-gray-400 mb-5">
            Al continuar, aceptas nuestros{' '}
            <a href="/terminos#terminos" className="text-forest hover:underline">Términos</a> y{' '}
            <a href="/terminos#privacidad" className="text-forest hover:underline">Política de Privacidad</a>
          </p>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">o continúa con email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                autoComplete="email" inputMode="email" enterKeyHint="next"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-forest bg-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  autoComplete="current-password" enterKeyHint="go"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-forest bg-white pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-forest text-white py-3.5 rounded-xl font-bold text-sm hover:bg-forest-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <>Entrar <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-green-800 text-sm font-bold mb-1">🌎 Rukka — Intercambio de hogares en Latinoamérica</p>
            <p className="text-green-700 text-xs">Sin costo de alojamiento, sin comisiones, sin letra chica.</p>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Primera vez en Rukka?{' '}
            <Link href="/auth/register" className="text-forest font-bold hover:text-forest-dark">
              Crea tu cuenta →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
