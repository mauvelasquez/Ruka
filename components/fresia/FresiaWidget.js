'use client'
import { useState, useEffect } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ChatInterface, { FresiaAvatar } from './ChatInterface'

export default function FresiaWidget() {
  const pathname   = usePathname()
  const [open,     setOpen]     = useState(false)
  const [mounted,  setMounted]  = useState(false)
  const [bounced,  setBounced]  = useState(false)

  useEffect(() => {
    setMounted(true)
    // Gentle bounce on first load after 1.5s
    const t = setTimeout(() => setBounced(true), 1500)
    const t2 = setTimeout(() => setBounced(false), 2500)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  // Don't render on /FresIA or server
  if (!mounted || pathname?.startsWith('/FresIA') || pathname?.startsWith('/fresia')) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
      {/* Chat popup */}
      {open && (
        <div
          className="pointer-events-auto w-[360px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 fresia-popup"
          style={{ height: 520 }}
        >
          {/* Widget header */}
          <div className="flex items-center justify-between px-4 py-3 bg-forest text-white flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <FresiaAvatar size={30} />
              <div>
                <p className="font-bold text-sm leading-tight">Fresia</p>
                <p className="text-[11px] opacity-70 leading-tight">powered by Claude ✦</p>
              </div>
              <div className="flex items-center gap-1 ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                <span className="text-[11px] opacity-70">En línea</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Link
                href="/FresIA"
                className="p-1.5 rounded-lg hover:bg-white/20 transition"
                title="Abrir chat completo"
                onClick={() => setOpen(false)}
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition"
                aria-label="Cerrar Fresia"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat content */}
          <div className="flex-1 overflow-hidden">
            <ChatInterface compact={true} />
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Cerrar Fresia' : 'Abrir Fresia, asistente IA'}
        className={`pointer-events-auto w-14 h-14 bg-forest text-white rounded-full shadow-xl
          flex items-center justify-center
          hover:bg-forest-dark hover:scale-105
          transition-all duration-200 ease-out
          ${bounced && !open ? 'animate-bounce' : ''}`}
      >
        {open
          ? <X className="w-6 h-6" />
          : <FresiaAvatar size={32} />
        }
      </button>
    </div>
  )
}
