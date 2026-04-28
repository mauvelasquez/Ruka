'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { CHILE_BANNERS } from '../../lib/chile-banners'
import { ArrowRight, ArrowLeftRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

// ── FAQ Acordeón ──────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: '¿Tengo que intercambiar al mismo tiempo?',
    a: 'No necesariamente. Puedes acordar fechas distintas con la otra persona. Lo importante es que ambos puedan viajar en algún momento del año.',
  },
  {
    q: '¿Qué pasa si me cancelan el intercambio?',
    a: 'Todos los perfiles están verificados y tienen valoraciones visibles. Puedes hablar con el otro usuario antes de confirmar y siempre quedan registros dentro de la plataforma.',
  },
  {
    q: '¿Es realmente gratis?',
    a: 'Sí, 100%. Rukka no cobra comisión, no tiene suscripción mensual ni tarifa por intercambio. El modelo es simple: tu hogar es tu moneda de cambio.',
  },
  {
    q: '¿Solo funciona en Chile?',
    a: 'Por ahora sí. Estamos enfocados en construir una comunidad chilena sólida y de confianza. En el futuro podría expandirse.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-900 pr-4">{q}</span>
        {open
          ? <ChevronUp className="w-5 h-5 text-forest flex-shrink-0" />
          : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed bg-white border-t border-gray-100">
          {a}
        </div>
      )}
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function ComoFuncionaPage() {
  const [heroBanner, setHeroBanner] = useState(null)

  useEffect(() => {
    setHeroBanner(CHILE_BANNERS[Math.floor(Math.random() * CHILE_BANNERS.length)])
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      {/* ── SECCIÓN 1: HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {heroBanner && (
            <img src={heroBanner.image} alt={heroBanner.city} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(26,46,30,0.82) 0%, rgba(42,92,69,0.65) 60%, rgba(248,244,238,1) 100%)'
          }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white rounded-full px-4 py-2 text-sm font-bold mb-6">
            🇨🇱 La primera plataforma chilena de intercambio de hogares
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            Viaja por Chile sin<br />
            <span className="text-sand">pagar hotel. En serio.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Rukka es la primera plataforma chilena de intercambio de hogares.
            Tú cuidas el hogar de alguien, ellos cuidan el tuyo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register"
              className="bg-white text-forest-dark font-black px-8 py-4 rounded-2xl text-base hover:bg-sand transition-colors flex items-center justify-center gap-2">
              Crear mi cuenta gratis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/homes"
              className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-white/10 transition-colors flex items-center justify-center">
              Explorar hogares
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 2: EL CONCEPTO ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">El concepto</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Así de simple funciona</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { emoji: '🏠', title: 'Tienes un hogar', desc: 'Puede ser casa, depto, cabaña. Da igual dónde en Chile.' },
              { emoji: '🗺️', title: 'Alguien más tiene otro', desc: 'En Pucón, Valparaíso, Atacama, donde quieras ir.' },
              { emoji: '🤝', title: 'Se ponen de acuerdo', desc: 'Fechas, personas, detalles. Todo dentro de Rukka.' },
              { emoji: '✈️', title: 'Ambos viajan gratis', desc: 'Sin hoteles, sin Airbnb, sin pagar alojamiento.' },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 h-full hover:border-forest/30 hover:shadow-md transition-all text-center">
                  <div className="text-5xl mb-4">{s.emoji}</div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-forest rounded-full items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 3: POR QUÉ CONFIAR ─────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#F8F4EE' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Por qué confiar</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Diseñado para Chile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '🇨🇱',
                title: 'Solo Chile',
                desc: 'Comunidad local, personas reales, cultura compartida. No somos una plataforma global genérica.',
                color: 'bg-terra-50 border-terra/20',
                titleColor: 'text-terra',
              },
              {
                emoji: '🔒',
                title: 'Perfiles verificados',
                desc: 'Email verificado y perfil completo obligatorio para todos los miembros. Sin perfiles anónimos.',
                color: 'bg-forest-50 border-forest/20',
                titleColor: 'text-forest',
              },
              {
                emoji: '💸',
                title: '100% gratis',
                desc: 'Sin comisiones, sin suscripción, sin letra chica. Tu hogar es tu única moneda de cambio.',
                color: 'bg-andean-50 border-andean/20',
                titleColor: 'text-andean',
              },
            ].map((c, i) => (
              <div key={i} className={`${c.color} border-2 rounded-3xl p-8`}>
                <div className="text-4xl mb-4">{c.emoji}</div>
                <h3 className={`font-black text-xl mb-3 ${c.titleColor}`}>{c.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 4: MATCH REAL ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Ejemplo real</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">El match perfecto</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              El algoritmo de Rukka detecta automáticamente cuando dos personas quieren visitarse mutuamente en fechas compatibles.
            </p>
          </div>

          <div className="bg-forest-50 border border-forest-100 rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-8">
              {/* Card Camila */}
              <div className="w-64 flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden" style={{ height: 140 }}>
                  <img src="https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=320&h=140&fit=crop"
                    alt="Hogar Camila" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)' }} />
                  <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face"
                    alt="Camila" className="absolute top-3 left-3 w-11 h-11 rounded-full object-cover border-2 border-white shadow-md" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-black text-sm leading-tight">Camila</p>
                    <p className="text-xs text-white/80">Santiago → Pucón · Jul 10–25</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="bg-forest text-white rounded-full p-4 shadow-lg">
                  <ArrowLeftRight className="w-7 h-7" />
                </div>
                <span className="text-xs font-black text-forest bg-forest-100 px-4 py-1.5 rounded-full">
                  ✦ Match perfecto
                </span>
              </div>

              {/* Card Roberto */}
              <div className="w-64 flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden" style={{ height: 140 }}>
                  <img src="https://images.unsplash.com/photo-1601059381817-9ad55a5a6dc3?w=320&h=140&fit=crop"
                    alt="Hogar Roberto" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 55%)' }} />
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face"
                    alt="Roberto" className="absolute top-3 left-3 w-11 h-11 rounded-full object-cover border-2 border-white shadow-md" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-black text-sm leading-tight">Roberto</p>
                    <p className="text-xs text-white/80">Pucón → Santiago · Jul 10–25</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center border-t border-forest-100 pt-8">
              <p className="text-gray-700 mb-2">
                <strong>Resultado:</strong> Camila disfruta la naturaleza en Pucón mientras Roberto explora Providencia.
              </p>
              <p className="text-forest font-bold">Ambos sin pagar alojamiento. 🎉</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 5: FAQ ─────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#F8F4EE' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Preguntas frecuentes</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">¿Tienes dudas?</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 6: CTA FINAL ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-forest-dark rounded-3xl p-12 sm:p-16">
            <Sparkles className="w-10 h-10 text-forest-light mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
              ¿Lista tu rukka para<br />el intercambio?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Únete gratis y empieza a intercambiar hogares por todo Chile.
            </p>
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-forest-dark font-black px-10 py-4 rounded-2xl text-lg hover:bg-sand transition-colors shadow-lg">
              Crear mi cuenta gratis <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-white/40 text-sm mt-5">Tarda 2 minutos. Sin tarjeta de crédito.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
