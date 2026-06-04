'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { CHILE_BANNERS } from '../../lib/chile-banners'
import { ArrowRight, ArrowLeftRight, ChevronDown, ChevronUp, Shield, CheckCircle, RotateCcw } from 'lucide-react'
import { openPublicarModal } from '../../components/PublicarModal'

const FAQS = [
  {
    q: '¿Qué pasa si no coincido en fechas con nadie?',
    a: 'Para eso están los Yankis. Publica tu casa, hospeda cuando puedas, y acumulas créditos (Yankis) que usas cuando quieras viajar — sin necesidad de que los tiempos cuadren con otra persona. 1 Yanki = 1 noche de alojamiento en cualquier hogar de Rukka.',
  },
  {
    q: '¿Cómo sé que las personas son de confianza?',
    a: 'Todos los miembros tienen verificación de identidad obligatoria: documento oficial más reconocimiento facial. Sin perfil verificado no se puede iniciar ningún intercambio. Además, en Rukka ambas partes ponen su hogar en la mesa — esa responsabilidad mutua crea un incentivo muy distinto al de Airbnb.',
  },
  {
    q: '¿Tengo que dejar mi casa disponible todo el año?',
    a: 'No. Tú eliges cuándo está disponible. Puedes bloquear fechas, aceptar o rechazar cada solicitud, y establecer condiciones antes de confirmar. Tienes control total sobre tu propiedad.',
  },
  {
    q: '¿Qué pasa si me cancelan el intercambio?',
    a: 'Si el intercambio no se concreta, tus Yankis se devuelven íntegros de forma automática. No hay penalidades para ti.',
  },
  {
    q: '¿Cuánto cuesta usar Rukka?',
    a: 'El alojamiento es gratuito — ese es el modelo. Tu hospitalidad se intercambia por hospitalidad. No hay tarifa por noche ni cargo de servicio. La cuenta básica es gratuita.',
  },
  {
    q: '¿En qué países opera Rukka?',
    a: 'Chile. Puedes intercambiar tu hogar con viajeros de distintas regiones del país.',
  },
  {
    q: '¿Tengo que saber de antemano quién va a ser mi match?',
    a: 'No. El sistema de Yankis desacopla completamente el "¿quién me hospeda?" del "¿a quién hospedo yo?". Puedes hospedar a alguien en Santiago en marzo y luego usar esos Yankis para alojarte en Pichilemu en septiembre — sin ninguna relación entre esas dos personas.',
  },
]

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <h3 className="m-0">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors font-bold text-gray-900 text-sm sm:text-base"
          aria-expanded={isOpen}
        >
          <span className="pr-4">{q}</span>
          {isOpen
            ? <ChevronUp className="w-5 h-5 text-forest flex-shrink-0" />
            : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
          }
        </button>
      </h3>
      <div
        className={`px-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 overflow-hidden transition-all duration-200 ${isOpen ? 'pb-5 pt-4 max-h-96' : 'max-h-0 border-t-0'}`}
        aria-hidden={!isOpen}
      >
        {a}
      </div>
    </div>
  )
}

export default function ComoFuncionaClient() {
  const [heroBanner, setHeroBanner] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    setHeroBanner(CHILE_BANNERS[Math.floor(Math.random() * CHILE_BANNERS.length)])
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {heroBanner && (
            <img
              src={heroBanner.image}
              alt={`Destino en ${heroBanner.city}`}
              className="w-full h-full object-cover"
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(26,46,30,0.88) 0%, rgba(42,92,69,0.70) 55%, rgba(248,244,238,1) 100%)' }}
            aria-hidden="true"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white rounded-full px-4 py-2 text-sm font-bold mb-6">
            🇨🇱 Chile
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            Intercambia tu hogar.<br />
            <span className="text-sand">Viaja gratis por Chile.</span>
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Rukka conecta propietarios de Chile.<br className="hidden sm:block" />
            Cada vez que hospedas a alguien, ganas el derecho de alojarte en otra casa — en las fechas que quieras.
          </p>
        </div>
      </section>

      {/* ── EL PRINCIPIO ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white" id="principio" aria-labelledby="principio-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">El principio</p>
          <h2 id="principio-heading" className="text-3xl sm:text-4xl font-black text-gray-900 mb-5">
            La idea es tan simple como suena
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-14">
            Tú cuidas la casa de alguien, ellos cuidan la tuya.<br />
            Sin hoteles. Sin tarifas por noche. Solo personas cuidándose mutuamente.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="bg-forest-50 border-2 border-forest/20 rounded-3xl p-7 text-center flex-1 max-w-xs">
              <div className="text-5xl mb-3">🏠</div>
              <h3 className="font-black text-forest m-0">Tu hogar</h3>
              <p className="text-gray-500 text-sm mt-1">Santiago, Viña, Valparaíso…</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="bg-forest text-white rounded-full p-3 shadow-lg">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-forest bg-forest-50 border border-forest/15 px-3 py-1 rounded-full whitespace-nowrap">
                = sin pagar alojamiento
              </span>
            </div>

            <div className="bg-terra-50 border-2 border-terra/20 rounded-3xl p-7 text-center flex-1 max-w-xs">
              <div className="text-5xl mb-3">🏖️</div>
              <h3 className="font-black text-terra m-0">El hogar de alguien</h3>
              <p className="text-gray-500 text-sm mt-1">Pichilemu, San Pedro, Puerto Varas…</p>
            </div>
          </div>

          <p className="mt-10 text-gray-500 text-sm max-w-lg mx-auto">
            El alojamiento es gratuito porque ambas partes se benefician por igual.
            No hay cargos ocultos, porque no hay dinero de por medio.
          </p>
        </div>
      </section>

      {/* ── EL SISTEMA ───────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#F8F4EE' }} id="sistema" aria-labelledby="sistema-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Cómo funciona</p>
            <h2 id="sistema-heading" className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Tu hospitalidad siempre vale — ahora o después
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              El sistema Rukka convierte cada noche que hospedas en un crédito de viaje llamado <strong>Yanki</strong>.
              Cuando las fechas cuadran con alguien, los Yankis se cancelan solos — y viajan al mismo tiempo gratis.
              Cuando no cuadran, guardas los Yankis y los usas cuando estés listo para viajar.
            </p>
          </div>

          {/* Yankis — the default model */}
          <div className="bg-white border-2 border-terra/20 rounded-3xl p-8 sm:p-10 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-terra text-white rounded-2xl p-3 text-2xl leading-none flex-shrink-0">🪙</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-terra mb-0.5">La base del sistema</p>
                <h3 className="font-black text-gray-900 text-xl sm:text-2xl">Yankis: tu hospitalidad convertida en viaje</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>Yanki</strong> es la moneda interna de Rukka — evoca el trueque, el intercambio directo entre personas.
                  No la compras con plata, la ganas hospedando.
                </p>
                <p className="text-2xl font-black text-terra mb-4">1 Yanki = 1 noche de alojamiento</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2"><span className="text-terra font-bold mt-0.5">✓</span> 3 Yankis de bienvenida al completar tu perfil</li>
                  <li className="flex items-start gap-2"><span className="text-terra font-bold mt-0.5">✓</span> Acumulas 1 Yanki por cada noche que hospedas</li>
                  <li className="flex items-start gap-2"><span className="text-terra font-bold mt-0.5">✓</span> Los Yankis no caducan — usalos cuando quieras</li>
                  <li className="flex items-start gap-2"><span className="text-terra font-bold mt-0.5">✓</span> Si cancela el intercambio, se te devuelven íntegros</li>
                </ul>
              </div>

              <div className="bg-terra-50 rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-terra mb-4">Ejemplo</p>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="bg-terra text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">1</span>
                    <span><strong>Valentina</strong> (Santiago) hospeda a Matías por 5 noches → gana <strong>5 Yankis</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-terra text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">2</span>
                    <span>En septiembre, busca hogares disponibles en Pichilemu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-terra text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">3</span>
                    <span>Usa sus 5 Yankis. Viaja sin pagar una noche de alojamiento.</span>
                  </li>
                </ol>
                <p className="mt-4 text-terra font-bold text-sm">→ Sin necesidad de coincidir en fechas. 🌎</p>
              </div>
            </div>
          </div>

          {/* Match directo — the bonus */}
          <div className="bg-white border-2 border-forest/20 rounded-3xl p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-forest text-white rounded-2xl p-3 text-2xl leading-none flex-shrink-0">⚡</div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-forest mb-0.5">Cuando las fechas cuadran</p>
                <h3 className="font-black text-gray-900 text-xl sm:text-2xl">Match directo: los Yankis se cancelan solos</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Si dos personas quieren visitarse mutuamente en fechas compatibles,
                  Rukka las conecta automáticamente. Ambas viajan al mismo tiempo — sus Yankis
                  se cancelan entre sí, y el costo de alojamiento para ambas es cero.
                </p>
                <p className="text-forest font-bold text-sm">Costo de alojamiento: $0. Sin Yankis necesarios.</p>
              </div>

              <div className="bg-forest-50 rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-forest mb-4">Ejemplo</p>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span>🏔️</span>
                    <span><strong>Camila</strong> (Santiago) quiere ir a Pichilemu en julio</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>🌊</span>
                    <span><strong>Roberto</strong> (Pichilemu) quiere ir a Santiago en julio</span>
                  </div>
                  <div className="border-t border-forest/10 pt-3 mt-1">
                    <p className="text-forest font-bold">→ Rukka los conecta. Ambos viajan en julio, gratis. 🎉</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Unifying statement */}
          <div className="mt-6 bg-forest-dark rounded-3xl p-8 text-white text-center">
            <p className="text-forest-light text-sm font-bold uppercase tracking-widest mb-3">En cualquier caso</p>
            <h3 className="text-2xl font-black mb-3 m-0">Tu hospitalidad siempre tiene valor.</h3>
            <p className="text-white/70 max-w-xl mx-auto">
              Si las fechas cuadran, viajas de inmediato con un match directo.
              Si no, los Yankis guardan ese valor para que lo uses cuando tengas ganas de viajar.
              El sistema resuelve el problema por ti.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3 PASOS ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-rukka-dark" id="pasos" aria-labelledby="pasos-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-forest-light mb-3">Cómo empezar</p>
            <h2 id="pasos-heading" className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              3 pasos para viajar diferente
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm">
              Desde publicar tu hogar hasta tu primera noche de intercambio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                n: '01',
                icon: '🏔️',
                title: 'Publica tu hogar',
                desc: 'Crea tu perfil y registra tu propiedad en 2 minutos. ¿Ya estás en Airbnb? Sube los pantallazos y Fresia, nuestra IA, importa fotos y descripción automáticamente.',
                tag: 'Recibes 3 Yankis de bienvenida al completar tu perfil.',
              },
              {
                n: '02',
                icon: '🗺️',
                title: 'Explora destinos',
                desc: 'Busca hogares disponibles en Chile. Filtra por fechas, tipo de propiedad y ciudad.',
                tag: null,
              },
              {
                n: '03',
                icon: '🤝',
                title: 'Intercambia y viaja',
                desc: 'Si hay match directo viajas al mismo tiempo. Si no, usas tus Yankis. Confirmas dentro de Rukka y viajas sin pagar alojamiento.',
                tag: null,
              },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
                  <div className="text-3xl mb-4">{s.icon}</div>
                  <p className="text-forest-light text-xs font-bold mb-2">Paso {s.n}</p>
                  <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                  {s.tag && (
                    <p className="mt-3 text-xs font-bold text-terra bg-terra/10 rounded-lg px-3 py-2">{s.tag}</p>
                  )}
                </div>
                {i < 2 && (
                  <div className="hidden sm:block absolute -right-3 top-12 z-10">
                    <ArrowRight className="w-6 h-6 text-forest/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONFIANZA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white" id="confianza" aria-labelledby="confianza-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Tu hogar, tus reglas</p>
            <h2 id="confianza-heading" className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Intercambia con tranquilidad
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              La diferencia con Airbnb: en Rukka <strong>ambas partes</strong> ponen su hogar en la mesa.
              Esa responsabilidad mutua cambia la dinámica completamente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              {
                Icon: Shield,
                colorBg: 'bg-forest-50 border-forest/15',
                colorIcon: 'text-forest',
                title: 'Identidad verificada',
                desc: 'Verificación de documento oficial + reconocimiento facial. Sin perfil verificado, nadie puede iniciar un intercambio.',
              },
              {
                Icon: CheckCircle,
                colorBg: 'bg-terra-50 border-terra/15',
                colorIcon: 'text-terra',
                title: 'Tú eliges quién entra',
                desc: 'Aceptas o rechazas cada solicitud. Puedes chatear con la otra persona antes de confirmar. Control total, siempre.',
              },
              {
                Icon: RotateCcw,
                colorBg: 'bg-andean-50 border-andean/15',
                colorIcon: 'text-andean',
                title: 'Si cancela, vuelves al inicio',
                desc: 'Tus Yankis se devuelven íntegros de forma automática si el intercambio no se concreta. Sin penalidades.',
              },
            ].map(({ Icon, colorBg, colorIcon, title, desc }, i) => (
              <div key={i} className={`border-2 rounded-3xl p-7 ${colorBg}`}>
                <Icon className={`w-6 h-6 mb-4 ${colorIcon}`} />
                <h3 className="font-black text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Mutual hostage framing */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-7 py-6 text-center">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              <strong>La diferencia clave:</strong> en Rukka, la otra persona también está confiando en ti con su hogar.
              Los dos tienen algo que cuidar — eso crea una responsabilidad recíproca que ningún hotel puede ofrecer.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#F8F4EE' }} id="faq" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Preguntas frecuentes</p>
            <h2 id="faq-heading" className="text-3xl sm:text-4xl font-black text-gray-900">¿Tienes dudas?</h2>
          </div>
          <div className="space-y-3" role="list">
            {FAQS.map((faq, i) => (
              <FaqItem
                key={i}
                q={faq.q}
                a={faq.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-forest-dark rounded-3xl p-12 sm:p-16">
            <p className="text-forest-light font-bold text-sm uppercase tracking-widest mb-4">Chile te espera</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
              ¿Lista tu hogar para<br />el intercambio?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Publica tu casa en 2 minutos. Recibes 3 Yankis de bienvenida.<br className="hidden sm:block" />
              Empieza a conectar con viajeros de Chile.
            </p>
            <button
              onClick={openPublicarModal}
              className="inline-flex items-center gap-2 bg-white text-forest-dark font-black px-10 py-4 rounded-2xl text-lg hover:bg-sand transition-colors shadow-lg"
            >
              Publicar mi hogar <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-white/40 text-sm mt-5">Sin tarjeta de crédito. Tarda 2 minutos.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
