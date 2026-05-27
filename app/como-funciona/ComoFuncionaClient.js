'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { CHILE_BANNERS } from '../../lib/chile-banners'
import { ArrowRight, ArrowLeftRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

const STEPS = [
  { n: '01', icon: '🏔️', title: 'Publica tu rukka', desc: 'Crea tu perfil y registra tu hogar. ¿Ya estás en Airbnb? Impórtalo en segundos y empieza a recibir solicitudes de intercambio.' },
  { n: '02', icon: '🗺️', title: 'Elige tu destino', desc: 'Busca hogares en Chile, México, Colombia o Argentina.' },
  { n: '03', icon: '✦',  title: 'El algoritmo trabaja', desc: 'Rukka detecta matches perfectos entre viajeros con fechas compatibles.' },
  { n: '04', icon: '🤝', title: 'Intercambia y viaja', desc: 'Confirmen el intercambio y vivan como locales en la ciudad del otro.' },
]

const BENEFITS = [
  { icon: '🌎', title: 'Latinoamérica completa', desc: 'Operamos en Chile, México, Colombia y Argentina. Cruza fronteras usando el intercambio de hogares.' },
  { icon: '🔁', title: 'Match bilateral', desc: 'El sistema detecta cuándo dos viajeros quieren visitarse en fechas compatibles.' },
  { icon: '🔒', title: 'Comunidad verificada', desc: 'Verificación de email obligatoria y perfil completo para todos los miembros.' },
  { icon: '✈️', title: 'Importa tu Airbnb al instante', desc: 'Si ya tienes tu propiedad en Airbnb, pega el link y traemos fotos, descripción y características automáticamente.' },
]

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
    q: '¿En qué países funciona Rukka?',
    a: 'Actualmente operamos en Chile, México, Colombia y Argentina. Estamos construyendo una comunidad sólida en toda Latinoamérica y seguimos expandiéndonos.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-bold text-gray-900 pr-4">{q}</span>
        {open
          ? <ChevronUp className="w-5 h-5 text-forest flex-shrink-0" />
          : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        }
      </button>
      <div
        className={`px-5 text-gray-600 text-sm leading-relaxed bg-white border-t border-gray-100 overflow-hidden transition-all duration-200 ${open ? 'pb-5 max-h-96' : 'max-h-0 border-t-0'}`}
        aria-hidden={!open}
      >
        {a}
      </div>
    </div>
  )
}

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
            🌎 La plataforma LATAM de intercambio de hogares
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            Viaja por Latinoamérica sin<br />
            <span className="text-sand">pagar hotel. En serio.</span>
          </h1>
          <p className="text-base text-sand/90 font-bold italic mb-3">Mi casa es tu casa.</p>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Rukka es la plataforma de intercambio de hogares de Latinoamérica.
            Tú cuidas el hogar de alguien, ellos cuidan el tuyo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register"
              className="bg-white text-forest-dark font-black px-8 py-4 rounded-2xl text-base hover:bg-sand transition-colors flex items-center justify-center gap-2">
              Crear mi cuenta <ArrowRight className="w-5 h-5" />
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
              { emoji: '🏠', title: 'Tienes un hogar', desc: 'Puede ser casa, depto, cabaña. Da igual dónde en Latinoamérica.' },
              { emoji: '🗺️', title: 'Alguien más tiene otro', desc: 'En Pichilemu, Cancún, Cartagena, Bariloche, donde quieras ir.' },
              { emoji: '🤝', title: 'Se ponen de acuerdo', desc: 'Fechas, personas, detalles. Todo dentro de Rukka.' },
              { emoji: '🏖️', title: 'Ambos alojan sin pagar', desc: 'Sin hoteles, sin Airbnb, sin pagar alojamiento.' },
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

      {/* ── SECCIÓN 3: 4 PASOS ─────────────────────────────────────────────── */}
      <section className="py-20 bg-rukka-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-forest-light mb-3">Cómo funciona</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">4 pasos para viajar diferente</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Sin hoteles, sin Airbnb, sin pagar alojamiento. Solo intercambio real.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
                  <div className="text-3xl mb-4">{s.icon}</div>
                  <p className="text-forest-light text-xs font-bold mb-2">Paso {s.n}</p>
                  <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-forest/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 4: POR QUÉ CONFIAR ─────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#F8F4EE' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Por qué confiar</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Diseñado para viajeros de verdad</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              {
                emoji: '🌎',
                title: 'Comunidad LATAM',
                desc: 'Chile, México, Colombia y Argentina. Personas reales, cultura compartida. No somos una plataforma global genérica.',
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

      {/* ── SECCIÓN 5: MATCH REAL ──────────────────────────────────────────── */}
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
              <div style={{ position:'relative', borderRadius:16, overflow:'hidden', height:160, width:'100%', maxWidth:280, flexShrink:0 }}>
                <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600"
                  alt="Hogar Camila"
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.05))' }} />
                <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face"
                  alt="Camila"
                  style={{ position:'absolute', top:12, left:12, width:48, height:48, borderRadius:'50%', border:'2.5px solid white', objectFit:'cover' }} />
                <div style={{ position:'absolute', bottom:12, left:12 }}>
                  <p style={{ color:'white', fontWeight:600, fontSize:14, margin:0 }}>Camila</p>
                  <p style={{ color:'#a8dfc0', fontSize:12, margin:0 }}>San José de Maipo → Pichilemu · Jul 10–25</p>
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

              <div style={{ position:'relative', borderRadius:16, overflow:'hidden', height:160, width:'100%', maxWidth:280, flexShrink:0 }}>
                <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600"
                  alt="Hogar Roberto"
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.05))' }} />
                <img src="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face"
                  alt="Roberto"
                  style={{ position:'absolute', top:12, left:12, width:48, height:48, borderRadius:'50%', border:'2.5px solid white', objectFit:'cover' }} />
                <div style={{ position:'absolute', bottom:12, left:12 }}>
                  <p style={{ color:'white', fontWeight:600, fontSize:14, margin:0 }}>Roberto</p>
                  <p style={{ color:'#a8dfc0', fontSize:12, margin:0 }}>Pichilemu → San José de Maipo · Jul 10–25</p>
                </div>
              </div>
            </div>

            <div className="text-center border-t border-forest-100 pt-8">
              <p className="text-gray-700 mb-2">
                <strong>Resultado:</strong> Camila disfruta el surf en Pichilemu mientras Roberto camina los cajones del Maipo.
              </p>
              <p className="text-forest font-bold">Ambos sin pagar alojamiento. 🎉</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 6: YANKIS ─────────────────────────────────────────────── */}
      <section id="yankis" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Sistema de tokens</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">¿Qué son los Yankis?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <strong>Yanki</strong> es una palabra en quechua que significa <em>trueque o intercambio</em>.
              Es la moneda interna de Rukka: un sistema simple y justo donde cada noche de hospitalidad
              se convierte en una noche de viaje.
            </p>
            <p className="mt-4 text-xl font-black text-terra">1 Yanki = 1 noche de alojamiento en cualquier hogar de Rukka.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-terra-50 border-2 border-terra/20 rounded-3xl p-8">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="font-black text-terra text-xl mb-3">¿Cómo ganas Yankis?</h3>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
                <li className="flex items-start gap-2"><span className="text-terra font-bold mt-0.5">•</span> 1 noche hospedada = 1 Yanki acreditado automáticamente</li>
                <li className="flex items-start gap-2"><span className="text-terra font-bold mt-0.5">•</span> 3 Yankis de bienvenida al completar tu perfil</li>
                <li className="flex items-start gap-2"><span className="text-terra font-bold mt-0.5">•</span> Los Yankis no caducan</li>
              </ul>
            </div>

            <div className="bg-forest-50 border-2 border-forest/20 rounded-3xl p-8">
              <div className="text-4xl mb-4">✈️</div>
              <h3 className="font-black text-forest text-xl mb-3">¿Cómo usas tus Yankis?</h3>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
                <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">•</span> 1 Yanki = 1 noche en el hogar que elijas</li>
                <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">•</span> Los Yankis se descuentan automáticamente al confirmar</li>
                <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">•</span> Si cancelas, tus Yankis se devuelven íntegros</li>
              </ul>
            </div>

            <div className="bg-andean-50 border-2 border-andean/20 rounded-3xl p-8">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="font-black text-andean text-xl mb-3">¿Puedo comprar Yankis?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Próximamente podrás adquirir Yankis directamente con tu tarjeta de crédito
                o débito, a través de Mercado Pago. Esto te permite viajar incluso si aún
                no has podido prestar tu hogar.
              </p>
              <span className="mt-3 inline-block text-xs font-bold bg-andean/10 text-andean px-3 py-1 rounded-full">Próximamente</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-forest-dark to-forest rounded-3xl p-8 sm:p-10 text-white text-center">
            <div className="text-3xl mb-4">🔄</div>
            <h3 className="font-black text-2xl mb-3">Intercambia sin coincidir en el tiempo</h3>
            <p className="text-white/80 max-w-xl mx-auto leading-relaxed">
              Los Yankis rompen la restricción del intercambio simultáneo. No necesitas
              viajar al mismo tiempo que tu anfitrión. Presta tu casa cuando puedas,
              acumula Yankis y úsalos cuando quieras viajar.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 7: POR QUÉ RUKKA ──────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#F8F4EE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Por qué Rukka</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Viajar diferente, en Latinoamérica</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) => (
              <div key={i} className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow ${i === 3 ? 'border-[#ff5a5f]/20 bg-[#ff5a5f]/3' : 'border-stone-200/60'}`}>
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECCIÓN 8: FAQ ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
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

      {/* ── SECCIÓN 9: CTA FINAL ───────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#F8F4EE' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-forest-dark rounded-3xl p-12 sm:p-16">
            <Sparkles className="w-10 h-10 text-forest-light mx-auto mb-5" />
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
              ¿Lista tu rukka para<br />el intercambio?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Únete y empieza a intercambiar hogares por Latinoamérica.
            </p>
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-forest-dark font-black px-10 py-4 rounded-2xl text-lg hover:bg-sand transition-colors shadow-lg">
              Crear mi cuenta <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-white/40 text-sm mt-5">Tarda 2 minutos. Sin tarjeta de crédito.</p>
          </div>
        </div>
      </section>

      <div className="text-center pb-4">
        <p className="text-xs text-gray-400">
          Última actualización:{' '}
          {new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <Footer />
    </div>
  )
}
