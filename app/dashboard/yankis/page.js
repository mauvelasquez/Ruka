'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import { useApp } from '../../../lib/store'
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Clock, CheckCircle, Share2 } from 'lucide-react'

const TYPE_LABELS = {
  earned:    { label: 'Ganado',      color: 'text-forest',  bg: 'bg-forest-50',  icon: TrendingUp },
  bonus:     { label: 'Bienvenida',  color: 'text-andean',  bg: 'bg-andean-50',  icon: '🎁' },
  spent:     { label: 'Gastado',     color: 'text-red-500', bg: 'bg-red-50',     icon: TrendingDown },
  refunded:  { label: 'Reembolso',   color: 'text-terra',   bg: 'bg-terra-50',   icon: '↩' },
  purchased: { label: 'Comprado',    color: 'text-andean',  bg: 'bg-andean-50',  icon: '💳' },
}

function TxRow({ tx }) {
  const meta = TYPE_LABELS[tx.type] || { label: tx.type, color: 'text-gray-500', bg: 'bg-gray-50', icon: Clock }
  const isPositive = tx.type !== 'spent'
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
          {typeof meta.icon === 'string'
            ? <span className="text-lg">{meta.icon}</span>
            : <meta.icon className={`w-5 h-5 ${meta.color}`} />
          }
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{tx.description || meta.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(tx.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`font-black text-base ${isPositive ? 'text-forest' : 'text-red-500'}`}>
          {isPositive ? '+' : '−'}{tx.amount} 🪙
        </p>
        <p className="text-xs text-gray-400">Saldo: {tx.balance_after}</p>
      </div>
    </div>
  )
}

export default function YankisDashboard() {
  const router = useRouter()
  const { currentUser, ready, homes } = useApp()
  const [balance, setBalance]           = useState(null)
  const [stats, setStats]               = useState({ total_earned: 0, total_spent: 0 })
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [showShareTooltip, setShowShareTooltip] = useState(false)

  useEffect(() => {
    if (!ready) return
    if (!currentUser) { router.push('/auth/login'); return }

    Promise.all([
      fetch('/api/yankis/balance').then(r => r.json()),
      fetch('/api/yankis/transactions').then(r => r.json()),
    ]).then(([bal, txs]) => {
      setBalance(bal.balance ?? 0)
      setStats({ total_earned: bal.total_earned ?? 0, total_spent: bal.total_spent ?? 0 })
      setTransactions(Array.isArray(txs) ? txs : [])
    }).finally(() => setLoading(false))
  }, [ready, currentUser])

  if (!ready || loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F4EE' }}>
      <div className="w-8 h-8 border-4 border-terra border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al panel
        </Link>

        {/* ── ¿Qué son los Yankis? — hero con imagen de fondo ──────────────── */}
        <div className="relative rounded-3xl overflow-hidden mb-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1526749837599-b4eba9fd855e?w=1200&q=80)' }}
          />
          {/* Double-layer overlay: first darken, then add forest tint */}
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.72)' }} />
          <div className="absolute inset-0" style={{ background: 'rgba(26,46,30,0.55)' }} />

          <div className="relative p-8 sm:p-10 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-green-300 mb-2">Sistema de tokens</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">¿Qué son los Yankis?</h2>
            <p className="text-white/90 text-sm leading-relaxed max-w-xl mb-2">
              <strong className="text-white">Yanki</strong> es una palabra en quechua que significa <em>trueque o intercambio</em>.
              Es la moneda interna de Rukka: cada noche de hospitalidad se convierte en una noche de viaje.
            </p>
            <p className="text-lg font-black text-sand mb-8">1 Yanki = 1 noche de alojamiento en cualquier hogar de Rukka.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <div className="text-2xl mb-2">🪙</div>
                <h3 className="font-black text-white text-sm mb-2">¿Qué son?</h3>
                <p className="text-white/85 text-xs leading-relaxed">
                  La moneda del intercambio. Cada vez que prestas tu hogar, ganas Yankis. Los usas para alojarte en otros hogares de la comunidad.
                </p>
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <div className="text-2xl mb-2">📈</div>
                <h3 className="font-black text-white text-sm mb-2">¿Cómo ganas Yankis?</h3>
                <ul className="text-white/85 text-xs space-y-1.5">
                  <li>• 1 noche hospedada = 1 Yanki</li>
                  <li>• 3 Yankis al completar tu perfil</li>
                  <li>• No caducan nunca</li>
                </ul>
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <div className="text-2xl mb-2">✈️</div>
                <h3 className="font-black text-white text-sm mb-2">¿Cómo usas tus Yankis?</h3>
                <ul className="text-white/85 text-xs space-y-1.5">
                  <li>• 1 Yanki = 1 noche en cualquier hogar</li>
                  <li>• Se descuentan al confirmar</li>
                  <li>• Reembolso íntegro si cancelas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Header balance */}
        <div className="bg-gradient-to-br from-terra to-[#9B4A1E] rounded-3xl p-8 text-white mb-6">
          <p className="text-sm font-bold text-white/70 uppercase tracking-widest mb-2">Tu saldo</p>
          <div className="flex items-end gap-3 mb-1">
            <span className="text-6xl font-black">{balance}</span>
            <span className="text-3xl mb-2">🪙</span>
          </div>
          <p className="text-white/80 text-base font-semibold">
            {balance === 1 ? '1 Yanki' : `${balance} Yankis`} disponibles
          </p>
          <p className="text-white/50 text-xs mt-1">1 Yanki = 1 noche de alojamiento en cualquier hogar de Rukka</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Disponibles', value: balance,            color: 'bg-terra-50 border-terra/20',  text: 'text-terra',    icon: '🪙' },
            { label: 'Ganados',     value: stats.total_earned, color: 'bg-forest-50 border-forest/20', text: 'text-forest',   icon: '📈' },
            { label: 'Gastados',    value: stats.total_spent,  color: 'bg-gray-50 border-gray-200',    text: 'text-gray-600', icon: '📤' },
          ].map((s, i) => (
            <div key={i} className={`${s.color} border-2 rounded-2xl p-4 text-center`}>
              <p className="text-xl mb-1">{s.icon}</p>
              <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── ¿Cómo ganar más Yankis? ── */}
        {(() => {
          const myHomes = homes.filter(h => h.userId === currentUser?.id)
          const hasHome = myHomes.length > 0

          const handleShare = async () => {
            const shareText = '¡Únete a Rukka y viaja gratis intercambiando tu hogar!'
            const shareUrl  = 'https://rukka.cl'
            if (navigator.share) {
              try { await navigator.share({ title: 'Rukka', text: shareText, url: shareUrl }) } catch {}
            } else {
              await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
              setShowShareTooltip(true)
              setTimeout(() => setShowShareTooltip(false), 2500)
            }
          }

          return (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-black text-gray-900 text-lg mb-4 flex items-center gap-2">
                🪙 ¿Cómo ganar más Yankis?
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                {hasHome ? (
                  <div className="flex items-center gap-2 bg-forest/5 border border-forest/20 rounded-2xl px-4 py-3 flex-1">
                    <CheckCircle className="w-5 h-5 text-forest flex-shrink-0" />
                    <p className="text-forest font-bold text-sm">Tu hogar está generando Yankis activamente ✓</p>
                  </div>
                ) : (
                  <Link href="/onboarding"
                    className="flex items-center justify-center gap-2 bg-forest text-white font-black px-5 py-3 rounded-2xl text-sm hover:bg-forest-dark transition-colors flex-1 text-center">
                    Agrega tu hogar →
                  </Link>
                )}
                <div className="relative flex-1">
                  <button onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 bg-terra/10 text-terra border border-terra/20 font-black px-5 py-3 rounded-2xl text-sm hover:bg-terra/20 transition-colors">
                    <Share2 className="w-4 h-4" /> Invita amigos →
                  </button>
                  {showShareTooltip && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                      ¡Enlace copiado!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })()}

        {/* Historial */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-black text-gray-900 text-lg mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-terra" /> Historial de Yankis
          </h2>
          {transactions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">🪙</p>
              <p className="text-gray-500 font-medium">Aún no tienes transacciones</p>
              <p className="text-gray-400 text-sm mt-1">Presta tu hogar para ganar Yankis</p>
            </div>
          ) : (
            <div>
              {transactions.map(tx => <TxRow key={tx.id} tx={tx} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
