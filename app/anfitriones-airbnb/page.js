'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { CHILE_BANNERS } from '../../lib/chile-banners'
import {
  ArrowRight, CheckCircle, ChevronDown, ChevronUp,
  Home, Users, MapPin, Zap, Shield, Gift, Star,
  ArrowLeftRight, Clock, Upload, Sparkles,
} from 'lucide-react'

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: '¿Tengo que dejar de usar Airbnb?',
    a: 'Para nada. Rukka y Airbnb conviven perfectamente. Puedes seguir recibiendo huéspedes en Airbnb con normalidad. Rukka es una capa adicional: usas tu propiedad también para intercambios cuando tú quieras viajar.',
  },
  {
    q: '¿Qué pasa con mis reservas activas en Airbnb?',
    a: 'Tú controlas las fechas disponibles para intercambio en Rukka. Solo ofreces los períodos que tienes libres. Si tienes reservas en Airbnb para julio, simplemente no ofreces julio en Rukka.',
  },
  {
    q: '¿El import de Airbnb trae todas mis fotos?',
    a: 'Sí. El import trae título, descripción, fotos, capacidad, número de habitaciones, baños y amenities directamente desde tu listing. Luego puedes editar lo que quieras antes de publicar.',
  },
  {
    q: '¿Tengo que pagar algo?',
    a: 'Rukka no cobra comisión por intercambio, ni suscripción mensual, ni ningún costo oculto. Tu hogar es tu única moneda de cambio.',
  },
  {
    q: '¿Puedo importar más de una propiedad?',
    a: 'Sí. Si tienes varios Airbnbs puedes importar cada uno por separado y publicarlos todos en Rukka. Más propiedades = más opciones de intercambio.',
  },
  {
    q: '¿Cómo sé que la persona que viene es confiable?',
    a: 'Todos los miembros de Rukka tienen perfil verificado con email confirmado. Además puedes ver el historial de intercambios y valoraciones antes de aceptar cualquier solicitud.',
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
          : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed bg-white border-t border-gray-100">
          {a}
        </div>
      )}
    </div>
  )
}

// ── Testimonio ────────────────────────────────────────────────────────────────
function Testimonial({ name, city, airbnbs, text, avatar }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed flex-1">"{text}"</p>
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover bg-gray-100" />
        <div>
          <p className="font-bold text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-400">{city} · {airbnbs} en Airbnb</p>
        </div>
      </div>
    </div>
  )
}

// ── Import step visual ────────────────────────────────────────────────────────
function ImportStep({ n, label, sublabel, active }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl transition-all ${
      active ? 'bg-[#ff5a5f]/8 border border-[#ff5a5f]/25' : 'opacity-40'
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black ${
        active ? 'bg-[#ff5a5f] text-white' : 'bg-gray-200 text-gray-400'
      }`}>
        {n}
      </div>
      <div>
        <p className={`font-bold text-sm ${active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function AnfitrionesAirbnbPage() {
  const [heroBanner, setHeroBanner] = useState(null)
  const [importStep, setImportStep] = useState(0)

  useEffect(() => {
    setHeroBanner(CHILE_BANNERS[Math.floor(Math.random() * CHILE_BANNERS.length)])
  }, [])

  // Animar los pasos del import
  useEffect(() => {
    const iv = setInterval(() => {
      setImportStep(s => (s + 1) % 4)
    }, 1800)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {heroBanner && (
            <img src={heroBanner.image} alt={heroBanner.city} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(26,46,30,0.90) 0%, rgba(42,92,69,0.70) 60%, rgba(248,244,238,1) 100%)'
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            {/* Badge doble */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[#ff5a5f]/90 text-white rounded-full px-4 py-1.5 text-sm font-black">
                <span className="text-base">🏠</span> Para anfitriones de Airbnb
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white rounded-full px-4 py-1.5 text-sm font-bold">
                🌎 Chile · Colombia · Argentina · México
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-6">
              Tu Airbnb ya existe.<br />
              <span style={{ color: '#E8D5B0' }}>Ahora úsalo para<br />viajar por intercambio.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-xl">
              Rukka es la comunidad latinoamericana de anfitriones de Chile, Colombia, Argentina y México que intercambian sus propiedades entre sí.
              Cuenta gratuita, verificación de identidad, sin comisiones.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register"
                className="inline-flex items-center justify-center gap-2 bg-white text-forest-dark font-black px-8 py-4 rounded-2xl text-base hover:bg-sand transition-colors shadow-lg">
                Importar mi Airbnb <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/homes"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-white/10 transition-colors">
                Ver hogares disponibles
              </Link>
            </div>

            <p className="text-white/40 text-sm mt-4">Sin tarjeta de crédito · Tarda 2 minutos · Sin comisiones</p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <section className="bg-forest-dark py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { n: '$0',    label: 'Costo por usar Rukka' },
              { n: '4',     label: 'Países de Latinoamérica' },
              { n: '1 clic', label: 'Para importar tu Airbnb' },
              { n: '100%',  label: 'Anfitriones verificados' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-black text-white mb-1">{s.n}</p>
                <p className="text-white/50 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAIN POINT ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#ff5a5f] mb-3">La paradoja del anfitrión</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">
                Recibes viajeros todos los fines de semana.
                <span className="text-gray-400"> Pero cuando tú viajas, ¿cuánto pagas?</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Tienes una propiedad que le da alojamiento a cientos de personas al año. Sin embargo, cuando tú quieres explorar otro destino, terminas pagando hotel o buscando en el mismo Airbnb que usas para trabajar.
              </p>
              <p className="text-gray-600 leading-relaxed">
                <strong className="text-gray-900">Hay otra forma.</strong> Otros anfitriones en Chile, Colombia, Argentina y México tienen exactamente el mismo problema, y tienen exactamente lo que tú necesitas: una propiedad en el destino donde quieres ir.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: '😤', label: 'Pagas $90.000/noche en Airbnb cuando viajas', bad: true },
                { icon: '😤', label: 'No aprovechas tu propiedad cuando no está arrendada', bad: true },
                { icon: '😤', label: 'No tienes red de anfitriones de confianza', bad: true },
                { icon: '✅', label: 'Con Rukka: usas tu propiedad como moneda de cambio', bad: false },
                { icon: '✅', label: 'Intercambias con anfitriones verificados como tú', bad: false },
                { icon: '✅', label: 'Con Rukka: tu Airbnb ya está listo para importar y usarlo en intercambios', bad: false },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl border ${
                  item.bad
                    ? 'bg-red-50 border-red-100'
                    : 'bg-green-50 border-green-200'
                }`}>
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className={`text-sm font-medium ${item.bad ? 'text-red-700' : 'text-green-800'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPORTAR ─────────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#F8F4EE' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-[#ff5a5f] mb-3">Import 1 clic</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Tu propiedad ya está lista.<br />Solo pega el link.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              No tienes que volver a escribir la descripción, subir las fotos ni ingresar las características. Lo hacemos por ti en segundos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Visual del import */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 bg-gray-100 rounded-full h-5 flex items-center px-3">
                  <span className="text-xs text-gray-400 truncate">airbnb.cl/rooms/12345</span>
                </div>
              </div>

              {/* Pasos animados */}
              <div className="space-y-2 mb-6">
                <ImportStep n="1" label="Pegaste el link de tu Airbnb" sublabel="airbnb.cl/rooms/12345..." active={importStep >= 0} />
                <ImportStep n="2" label="Descargando información" sublabel="Fotos, título, capacidad, amenities..." active={importStep >= 1} />
                <ImportStep n="3" label="Confirmas los datos" sublabel="Vista previa antes de publicar" active={importStep >= 2} />
                <ImportStep n="4" label="¡Listo para intercambiar!" sublabel="Tu hogar ya está en la comunidad Rukka" active={importStep >= 3} />
              </div>

              {/* Preview card */}
              <div className={`rounded-2xl overflow-hidden border border-gray-100 transition-all duration-700 ${
                importStep === 3 ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2'
              }`}>
                <div className="h-28 bg-gradient-to-br from-forest/30 to-andean/30 flex items-center justify-center">
                  <span className="text-4xl">🏠</span>
                </div>
                <div className="p-3">
                  <p className="font-bold text-xs text-gray-900 truncate">Departamento luminoso en Providencia</p>
                  <p className="text-xs text-gray-400 mt-0.5">Santiago · 2 hab · 1 baño · 4 huéspedes</p>
                  <div className="flex gap-1.5 mt-2">
                    {['WiFi','Cocina','Estac.'].map(a => (
                      <span key={a} className="text-xs bg-forest/10 text-forest px-2 py-0.5 rounded-full font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Texto */}
            <div className="space-y-6">
              {[
                {
                  icon: Upload,
                  color: 'text-[#ff5a5f]',
                  bg: 'bg-[#ff5a5f]/8',
                  title: 'Copia y pega el link',
                  desc: 'Solo necesitas la URL de tu listing de Airbnb (ej: airbnb.cl/rooms/12345). Nada más.',
                },
                {
                  icon: Zap,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                  title: 'Importamos todo automáticamente',
                  desc: 'Fotos, título, descripción, habitaciones, baños, capacidad y todos tus amenities. En segundos.',
                },
                {
                  icon: CheckCircle,
                  color: 'text-forest',
                  bg: 'bg-forest/8',
                  title: 'Tú confirmas antes de publicar',
                  desc: 'Ves una vista previa completa con todo lo que se importó. Puedes editar lo que quieras antes de publicar.',
                },
                {
                  icon: Users,
                  color: 'text-andean',
                  bg: 'bg-andean/10',
                  title: 'Ya eres parte de la comunidad',
                  desc: 'Tu propiedad aparece disponible para anfitriones de toda Latinoamérica que buscan intercambio.',
                },
              ].map(({ icon: Icon, color, bg, title, desc }, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`${bg} rounded-2xl p-3 flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{title}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-terra mb-3">El proceso</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Tres pasos para tu primer intercambio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Línea conectora */}
            <div className="hidden md:block absolute top-14 left-[33%] right-[33%] h-0.5 bg-gradient-to-r from-forest/30 via-forest to-forest/30 z-0" />

            {[
              {
                n: '01',
                emoji: '📲',
                title: 'Importa tu Airbnb',
                desc: 'Pega el link de tu propiedad en Airbnb. Traemos fotos, descripción y características automáticamente. Confirmas y listo.',
                color: 'border-[#ff5a5f]/30 bg-[#ff5a5f]/5',
              },
              {
                n: '02',
                emoji: '🗺️',
                title: 'Publica tu deseo de viaje',
                desc: 'Dinos a qué ciudad quieres ir y en qué fechas. El sistema busca anfitriones en ese destino que también quieran venir a tu ciudad.',
                color: 'border-forest/30 bg-forest/5',
              },
              {
                n: '03',
                emoji: '🤝',
                title: 'Intercambia y viaja',
                desc: 'Cuando hay un match, te notificamos. Acuerdan los detalles y cada uno se aloja en la propiedad del otro.',
                color: 'border-andean/30 bg-andean/5',
              },
            ].map((step, i) => (
              <div key={i} className={`relative z-10 border-2 ${step.color} rounded-3xl p-7 text-center`}>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-900 text-white text-xs font-black mb-4">
                  {step.n}
                </div>
                <div className="text-5xl mb-4">{step.emoji}</div>
                <h3 className="font-black text-gray-900 text-lg mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUIÉN ───────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#F8F4EE' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-terra mb-3">La comunidad</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Hecho para anfitriones como tú
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Rukka conecta a personas que ya tienen experiencia en hospitalidad y saben lo que significa cuidar un espacio ajeno.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                emoji: '🏙️',
                title: 'Anfitriones urbanos',
                desc: 'Tienes depto en Santiago, Bogotá, Buenos Aires o Ciudad de México y quieres explorar otros destinos.',
                tag: 'El más común',
                tagColor: 'bg-forest/10 text-forest',
              },
              {
                emoji: '🌊',
                title: 'Anfitriones de costa',
                desc: 'Tu propiedad está en una zona de playa o naturaleza y quieres visitar capitales o ciudades de Latinoamérica.',
                tag: 'Muy solicitado',
                tagColor: 'bg-[#ff5a5f]/10 text-[#ff5a5f]',
              },
              {
                emoji: '⛰️',
                title: 'Anfitriones de zona',
                desc: 'Tienes cabaña o casa en zona rural o de montaña. Los intercambios son los más valorados.',
                tag: 'Alta demanda',
                tagColor: 'bg-amber-100 text-amber-700',
              },
              {
                emoji: '🏡',
                title: 'Varios Airbnbs',
                desc: 'Tienes más de una propiedad. Puedes importarlas todas y tener más flexibilidad para intercambiar.',
                tag: 'Multi-propiedad',
                tagColor: 'bg-andean/10 text-andean',
              },
              {
                emoji: '🧳',
                title: 'Anfitriones viajeros',
                desc: 'Te encanta viajar pero odias pagar alojamiento. Rukka es literalmente para ti.',
                tag: 'La razón #1',
                tagColor: 'bg-purple-100 text-purple-700',
              },
              {
                emoji: '🔑',
                title: 'Primera vez en Rukka',
                desc: 'No importa si llevas un mes o cinco años en Airbnb. El onboarding es simple y el import es instantáneo.',
                tag: 'Bienvenido',
                tagColor: 'bg-gray-100 text-gray-600',
              },
            ].map((card, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-forest/20 transition-all">
                <div className="text-4xl mb-3">{card.emoji}</div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-black text-gray-900">{card.title}</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${card.tagColor}`}>
                    {card.tag}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARACIÓN ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-terra mb-3">Comparación</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Rukka vs. las alternativas</h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left p-5 font-bold text-gray-500 w-48">Característica</th>
                  <th className="p-5 font-black text-forest bg-forest/5 border-x border-forest/10">
                    <span className="flex flex-col items-center gap-1">
                      <span className="text-lg">🏕️</span> Rukka
                    </span>
                  </th>
                  <th className="p-5 font-bold text-gray-600">
                    <span className="flex flex-col items-center gap-1">
                      <span className="text-lg">🏨</span> Hotel
                    </span>
                  </th>
                  <th className="p-5 font-bold text-gray-600">
                    <span className="flex flex-col items-center gap-1">
                      <span className="text-lg">🟠</span> Airbnb (como turista)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Costo por noche',      '🔄 Intercambio',   '$80k-300k',       '$50k-200k'],
                  ['Import de propiedad',  '✓ 1 clic',         '—',               '—'],
                  ['Comunidad verificada', '✓ LATAM',          '—',               'Parcial'],
                  ['Match automático',     '✓ Bilateral',      '—',               '—'],
                  ['Comisión',             '✓ 0%',             'Fija',            '3–15%'],
                  ['Experiencia local',    '✓ Casa real',      'No',              'Parcial'],
                  ['Confianza mutua',      '✓ Anfitriones',    'Anónimo',         'Mixto'],
                ].map(([feat, rukka, hotel, airbnb], i) => (
                  <tr key={i} className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                    <td className="p-5 font-medium text-gray-700">{feat}</td>
                    <td className="p-5 text-center font-semibold text-forest bg-forest/5 border-x border-forest/10">{rukka}</td>
                    <td className="p-5 text-center text-gray-400">{hotel}</td>
                    <td className="p-5 text-center text-gray-400">{airbnb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ──────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#F8F4EE' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-widest text-terra mb-3">La comunidad habla</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Anfitriones que ya intercambian</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Testimonial
              name="Valentina R."
              city="Santiago"
              airbnbs="2 propiedades"
              text="Tengo dos deptos en Providencia. Los importé en menos de 2 minutos y ya cerré mi primer intercambio con alguien de Puerto Varas. Nunca pensé que usar mi propiedad para viajar sería tan fácil."
              avatar="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face"
            />
            <Testimonial
              name="Rodrigo M."
              city="Valparaíso"
              airbnbs="1 propiedad"
              text="Llevo 3 años siendo anfitrión en Airbnb y siempre pago hotel cuando viajo yo. Rukka es exactamente lo que le faltaba al ecosistema. El import funcionó a la primera con todas mis fotos."
              avatar="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face"
            />
            <Testimonial
              name="Camila F."
              city="Concepción"
              airbnbs="1 propiedad"
              text="La idea de intercambiar con otros anfitriones me parece genial porque hay una confianza base que con un desconocido no existe. Ya tenemos acordado un intercambio con una familia de La Serena para el verano."
              avatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face"
            />
          </div>
        </div>
      </section>

      {/* ── SEGURIDAD ────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-terra mb-3">Comunidad segura</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">
                Intercambias con personas que ya cuidan propiedades ajenas
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Lo que hace especial a Rukka es que todos sus miembros son <strong>anfitriones activos o ex-anfitriones</strong>. No son turistas aleatorios: son personas que saben lo que significa recibir huéspedes y cuidar un espacio.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Esa experiencia compartida genera una confianza base que no existe en otras plataformas.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Shield, color: 'text-forest', bg: 'bg-forest/8', title: 'Identidad verificada', desc: 'Verificación de identidad obligatoria y perfil completo para todos los miembros.' },
                { icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', title: 'Historial de intercambios', desc: 'Puedes ver el historial y valoraciones de cada anfitrión antes de aceptar.' },
                { icon: Users, color: 'text-andean', bg: 'bg-andean/10', title: 'Solo anfitriones', desc: 'Para publicar debes tener una propiedad real. No hay perfiles sin hogar.' },
                { icon: Gift, color: 'text-[#ff5a5f]', bg: 'bg-[#ff5a5f]/8', title: 'Sin presión económica', desc: 'El intercambio crea simetría: ambos tienen algo que perder si el trato sale mal.' },
              ].map(({ icon: Icon, color, bg, title, desc }, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <div className={`${bg} rounded-xl p-2.5 flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-0.5">{title}</p>
                    <p className="text-gray-500 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#F8F4EE' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-terra mb-3">Preguntas frecuentes</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Dudas de anfitriones</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-forest-dark rounded-3xl p-12 sm:p-16 relative overflow-hidden">
            {/* Decoración fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#ff5a5f]/80 text-white rounded-full px-4 py-2 text-sm font-black mb-6">
                🏠 Para anfitriones de Airbnb
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                Tu Airbnb ya está listo.<br />
                <span style={{ color: '#E8D5B0' }}>Solo falta importarlo.</span>
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
                Únete a la comunidad de anfitriones que usan sus propiedades para viajar por intercambio.
              </p>

              <Link href="/auth/register"
                className="inline-flex items-center gap-2 bg-white text-forest-dark font-black px-10 py-4 rounded-2xl text-lg hover:bg-sand transition-colors shadow-lg">
                Importar mi Airbnb <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {[
                  '✓ Sin tarjeta de crédito',
                  '✓ Tarda 2 minutos',
                  '✓ Sin comisiones',
                ].map((t, i) => (
                  <span key={i} className="text-white/50 text-sm">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
