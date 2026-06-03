'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../lib/store'

const STORAGE_KEY = 'rukka_welcome_dismissed'

const EXCLUDED_PATHS = ['/auth', '/onboarding', '/FresIA']

const steps = [
  {
    icon: '🏠',
    title: 'Crea tu cuenta gratuita',
    desc: 'Regístrate en minutos, sin costo.',
    highlight: false,
  },
  {
    icon: '🛡️',
    title: 'Verifica tu identidad',
    desc: 'Nos tomamos la seguridad en serio. Verificamos a cada miembro para que solo compartas hogar con personas de confianza.',
    highlight: true,
  },
  {
    icon: '📋',
    title: 'Publica tu casa',
    desc: 'Agrega tu hogar y empieza a recibir solicitudes de intercambio.',
    highlight: false,
  },
]

export default function WelcomePopup() {
  const { user, ready } = useApp()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (user) return
    if (EXCLUDED_PATHS.some(p => pathname.startsWith(p))) return
    if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) return

    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [ready, user, pathname])

  const dismiss = () => {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(26,46,30,0.72)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-welcome"
        style={{ backgroundColor: '#F8F4EE' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-forest px-6 pt-6 pb-5 text-white relative">
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white text-lg font-bold leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🏡</span>
            <span className="text-sm font-semibold tracking-widest uppercase text-forest-100 opacity-80">Rukka</span>
          </div>
          <h2 className="text-xl font-bold leading-snug pr-8">
            La primera plataforma de intercambio de casas en Chile
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-2">
          <p className="text-sm font-semibold text-rukka-dark mb-4">Únete en 3 simples pasos:</p>

          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i}>
                {step.highlight ? (
                  <div className="flex gap-3 rounded-xl border border-andean/30 bg-andean-50 px-4 py-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-andean/15 flex items-center justify-center text-lg">
                      {step.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-rukka-dark">{step.title}</span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-andean bg-andean/10 border border-andean/25 rounded-full px-2 py-0.5">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 1.5l2.47 5.01L18 7.27l-4 3.9.94 5.5L10 14.1l-4.94 2.57.94-5.5-4-3.9 5.53-.76L10 1.5z" clipRule="evenodd"/>
                          </svg>
                          Verificado
                        </span>
                      </div>
                      <p className="text-xs text-stone mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 items-start">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center text-lg">
                      {step.icon}
                    </div>
                    <div className="min-w-0 pt-1">
                      <span className="text-sm font-bold text-rukka-dark block">{step.title}</span>
                      <p className="text-xs text-stone mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>

          <p className="text-sm font-semibold text-forest mt-4 text-center">
            ¡Listo, ya puedes comenzar a compartir hogar!
          </p>
        </div>

        {/* CTAs */}
        <div className="px-6 pt-3 pb-6 flex flex-col gap-3">
          <Link
            href="/auth/register"
            className="w-full text-center rounded-xl bg-terra text-white font-bold py-3 text-sm hover:bg-terra-dark transition-colors shadow-sm"
          >
            Crear cuenta gratis
          </Link>
          <Link
            href="/auth/login"
            className="w-full text-center text-sm text-stone hover:text-rukka-dark transition-colors"
          >
            Ya tengo cuenta → Iniciar sesión
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes welcome-in {
          from { opacity: 0; transform: scale(0.93) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-welcome {
          animation: welcome-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
      `}</style>
    </div>
  )
}
