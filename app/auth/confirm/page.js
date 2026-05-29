'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'
import RukkaLogo from '../../../components/RukkaLogo'
import { supabase } from '../../../lib/supabase'

const COOLDOWN_SECONDS = 60

function ConfirmContent() {
  const searchParams = useSearchParams()

  const [email,         setEmail]         = useState('')
  const [resendStatus,  setResendStatus]  = useState('idle') // 'idle' | 'loading' | 'sent' | 'error'
  const [resendError,   setResendError]   = useState('')
  const [countdown,     setCountdown]     = useState(0)
  const [alreadyDone,   setAlreadyDone]   = useState(false)
  const intervalRef = useRef(null)

  // Resolve email: URL param → session
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      return
    }
    supabase?.auth.getSession().then(({ data }) => {
      const sessionEmail = data?.session?.user?.email
      if (sessionEmail) setEmail(sessionEmail)
    })
  }, [searchParams])

  // Check if email is already confirmed
  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => {
      const user = data?.session?.user
      if (user?.email_confirmed_at) setAlreadyDone(true)
    })
  }, [])

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [countdown])

  const handleResend = async () => {
    if (!email || countdown > 0 || resendStatus === 'loading') return
    setResendStatus('loading')
    setResendError('')
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    if (error) {
      setResendStatus('error')
      setResendError(error.message || 'No pudimos reenviar el email. Intenta de nuevo.')
    } else {
      setResendStatus('sent')
      setCountdown(COOLDOWN_SECONDS)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F8F4EE' }}>
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-8">
          <RukkaLogo height={56} />
        </Link>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
          <div className="w-20 h-20 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-forest" />
          </div>

          {alreadyDone ? (
            <>
              <h1 className="text-2xl font-black text-gray-900 mb-3">Email ya confirmado</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Este email ya fue confirmado. Puedes iniciar sesión.
              </p>
              <Link href="/auth/login"
                className="w-full bg-forest text-white py-3.5 rounded-xl font-bold hover:bg-forest-dark transition-colors flex items-center justify-center gap-2 text-sm">
                Ir a iniciar sesión <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-gray-900 mb-3">¡Revisa tu email!</h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-2">
                Te enviamos un enlace de confirmación. Haz clic en él para activar tu cuenta y completar tu perfil.
              </p>
              <p className="text-gray-400 text-xs mb-6">
                El email puede tardar hasta 2 minutos. Revisa también tu carpeta de spam.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6">
                <p className="text-amber-800 text-xs font-bold mb-1">📬 ¿No encuentras el email?</p>
                <p className="text-amber-700 text-xs">Revisa tu carpeta de spam o correo no deseado.</p>
              </div>

              {/* Resend feedback */}
              {resendStatus === 'sent' && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-medium">
                  Email reenviado. Revisa tu bandeja de entrada.
                </div>
              )}
              {resendStatus === 'error' && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium">
                  {resendError}
                </div>
              )}

              {/* Resend button */}
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resendStatus === 'loading' || !email}
                className="w-full mb-3 border border-forest text-forest py-3 rounded-xl font-bold text-sm hover:bg-forest hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {resendStatus === 'loading'
                  ? <div className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                  : countdown > 0
                    ? `Reenviar en ${countdown}s`
                    : 'Reenviar email de confirmación'
                }
              </button>

              <Link href="/auth/login"
                className="w-full bg-forest text-white py-3.5 rounded-xl font-bold hover:bg-forest-dark transition-colors flex items-center justify-center gap-2 text-sm">
                Ir a iniciar sesión <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }} />}>
      <ConfirmContent />
    </Suspense>
  )
}
