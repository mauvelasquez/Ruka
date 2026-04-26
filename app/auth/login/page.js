'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../../lib/store'
import { Mountain, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Credenciales incorrectas')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F8F4EE' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A3C2C 0%, #2A5C45 50%, #3D7A5E 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-3">
            <Mountain className="w-8 h-8 text-white" />
            <span className="text-2xl font-black text-white tracking-tight">Ruka</span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-1.5 text-sm font-bold mb-6">
              🎉 100% gratuito para siempre
            </div>

            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Chile te está<br />esperando.<br />Sin pagar hotel.
            </h2>
            <p className="text-green-200 text-lg mb-10">
              Intercambia tu hogar y vive como local en cualquier ciudad de Chile. Completamente gratis.
            </p>

            <div className="flex flex-col gap-3">
              {[
                { city: 'Santiago', dest: 'Pucón', emoji: '🏙️' },
                { city: 'Valparaíso', dest: 'San Pedro de Atacama', emoji: '🎨' },
                { city: 'Temuco', dest: 'Viña del Mar', emoji: '🌲' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.city}</p>
                    <p className="text-green-300 text-xs">quiere visitar {item.dest}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                '✓ Sin costo de alojamiento',
                '✓ Sin comisiones ocultas',
                '✓ Matches automáticos',
                '✓ Solo en Chile 🇨🇱',
              ].map((b, i) => (
                <p key={i} className="text-green-200 text-xs">{b}</p>
              ))}
            </div>
          </div>

          <p className="text-green-300 text-sm">© 2025 Ruka — Intercambio de hogares en Chile</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <Mountain className="w-6 h-6 text-forest" />
            <span className="text-xl font-black text-forest">Ruka</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Bienvenido de vuelta</h1>
            <p className="text-gray-500">Inicia sesión para ver tus matches en Chile</p>
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-white pr-11" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
            <p className="text-green-800 text-sm font-bold mb-1">🎉 Ruka es 100% gratis</p>
            <p className="text-green-700 text-xs">Sin costo de alojamiento, sin comisiones, sin letra chica.</p>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Primera vez en Ruka?{' '}
            <Link href="/auth/register" className="text-forest font-bold hover:text-forest-dark">
              Crea tu cuenta gratis →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
