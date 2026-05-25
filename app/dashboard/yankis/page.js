'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import { useApp } from '../../../lib/store'
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Clock } from 'lucide-react'

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
  const { currentUser, ready } = useApp()
  const [balance, setBalance]         = useState(null)
  const [stats, setStats]             = useState({ total_earned: 0, total_spent: 0 })
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]         = useState(true)

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

        {/* Header */}
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
            { label: 'Disponibles', value: balance, color: 'bg-terra-50 border-terra/20', text: 'text-terra', icon: '🪙' },
            { label: 'Ganados',     value: stats.total_earned, color: 'bg-forest-50 border-forest/20', text: 'text-forest', icon: '📈' },
            { label: 'Gastados',    value: stats.total_spent,  color: 'bg-gray-50 border-gray-200',    text: 'text-gray-600', icon: '📤' },
          ].map((s, i) => (
            <div key={i} className={`${s.color} border-2 rounded-2xl p-4 text-center`}>
              <p className="text-xl mb-1">{s.icon}</p>
              <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Historial */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
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

        {/* Próximamente: compra de Yankis */}
        <div className="bg-white rounded-3xl shadow-sm border border-dashed border-andean/40 p-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💳</span>
            <div className="flex-1">
              <h3 className="font-black text-gray-900 text-base mb-1">Próximamente: Compra Yankis</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">
                Podrás adquirir Yankis directamente con tu tarjeta de crédito o débito
                a través de Mercado Pago. Esto te permitirá viajar aunque aún no hayas
                prestado tu hogar.
              </p>
              <span className="inline-flex items-center gap-1.5 bg-andean-50 text-andean text-xs font-bold px-3 py-1.5 rounded-full border border-andean/20">
                En desarrollo
              </span>
            </div>
          </div>
        </div>

        {/* Explicación del sistema */}
        <div className="prose prose-sm max-w-none text-gray-600">
          <h2 className="text-gray-900 font-black text-xl">¿Qué son los Yankis?</h2>
          <p>
            <strong>Yanki</strong> es una palabra en quechua que significa <em>trueque o intercambio</em>.
            Es la moneda interna de Rukka: un sistema simple y justo donde cada noche de hospitalidad
            se convierte en una noche de viaje.
          </p>
          <p className="font-bold text-terra">1 Yanki = 1 noche de alojamiento en cualquier hogar de Rukka.</p>

          <h3 className="font-black text-gray-900">¿Cómo ganas Yankis?</h3>
          <ul>
            <li>1 noche hospedada = 1 Yanki acreditado automáticamente</li>
            <li>3 Yankis de bienvenida al completar tu perfil</li>
            <li>Los Yankis no caducan nunca</li>
          </ul>

          <h3 className="font-black text-gray-900">¿Cómo usas tus Yankis?</h3>
          <ul>
            <li>1 Yanki = 1 noche en el hogar que elijas</li>
            <li>Los Yankis se descuentan automáticamente al confirmar tu estadía</li>
            <li>Si cancelas, tus Yankis se devuelven íntegros</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
