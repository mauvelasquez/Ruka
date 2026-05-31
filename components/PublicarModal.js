'use client'
import { useState, useEffect, useRef } from 'react'
import { X, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '../lib/store'

export const PUBLICAR_EVENT = 'rukka:publicar'

export function openPublicarModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PUBLICAR_EVENT))
  }
}

export default function PublicarModal() {
  const router = useRouter()
  const { user } = useApp()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [leadLoading, setLeadLoading] = useState(false)
  const firstFocusRef = useRef(null)

  useEffect(() => {
    const handler = () => {
      if (user?.id) {
        router.push('/dashboard/property/new')
        return
      }
      setOpen(true)
    }
    window.addEventListener(PUBLICAR_EVENT, handler)
    return () => window.removeEventListener(PUBLICAR_EVENT, handler)
  }, [user, router])

  useEffect(() => {
    if (!open) return
    firstFocusRef.current?.focus()
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const handleLeadSubmit = async (e) => {
    e.preventDefault()
    setLeadLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'publicar_modal' }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    }
    setLeadLoading(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publicar-modal-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-forest px-7 pt-8 pb-7 text-white relative">
          <button
            ref={firstFocusRef}
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
          <p className="text-forest-light text-xs font-bold uppercase tracking-widest mb-2">🏠 Publicar mi hogar</p>
          <h2 id="publicar-modal-title" className="text-2xl font-black leading-tight mb-2">
            3 pasos para empezar a viajar gratis
          </h2>
          <p className="text-white/75 text-sm">Sin tarjeta de crédito. Sin costos ocultos.</p>
        </div>

        {/* Steps */}
        <div className="px-7 py-5 space-y-4 border-b border-gray-100">
          {[
            { n: '01', label: 'Publica tu hogar', desc: 'Crea tu cuenta y registra tu propiedad en 2 minutos.' },
            { n: '02', label: 'Te verificamos', desc: 'Verificación de identidad con documento oficial. Tu privacidad protegida.' },
            { n: '03', label: 'Recibe solicitudes', desc: 'Empieza a conectar con viajeros de todo Chile.' },
          ].map(s => (
            <div key={s.n} className="flex items-start gap-3">
              <span className="bg-forest text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">{s.n}</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">{s.label}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Yankis callout */}
        <div className="mx-7 mt-4 bg-terra/10 border border-terra/20 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0" aria-hidden="true">🪙</span>
          <p className="text-terra text-sm font-semibold">
            <span className="font-black">3 Yankis de bienvenida</span> al completar tu perfil = 3 noches de alojamiento gratis
          </p>
        </div>

        {/* CTA principal */}
        <div className="px-7 pt-5 pb-6 space-y-4">
          <Link
            href="/auth/register"
            onClick={() => setOpen(false)}
            className="w-full flex items-center justify-center gap-2 bg-forest text-white font-black py-4 rounded-xl text-base hover:bg-forest-dark transition-colors shadow-md"
          >
            Crear cuenta gratis <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Lead capture */}
          {!submitted ? (
            <div>
              <p className="text-center text-xs text-gray-400 mb-2.5">
                ¿No estás listo aún? Deja tu email y te avisamos
              </p>
              <form onSubmit={handleLeadSubmit} className="flex gap-2">
                <label htmlFor="lead-modal-email" className="sr-only">Tu email</label>
                <input
                  id="lead-modal-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  inputMode="email"
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                />
                <button
                  type="submit"
                  disabled={leadLoading}
                  className="bg-terra text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-terra-dark transition-colors disabled:opacity-60 flex-shrink-0 whitespace-nowrap"
                >
                  {leadLoading ? '...' : 'Avisar'}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium py-2">
              <CheckCircle className="w-4 h-4" aria-hidden="true" /> ¡Anotado! Te avisamos pronto.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
