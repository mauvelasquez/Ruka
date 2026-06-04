import Script from 'next/script'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft } from 'lucide-react'
import { FresiaAvatar } from '../../components/fresia/ChatInterface'

const ChatInterface = dynamic(
  () => import('../../components/fresia/ChatInterface'),
  { ssr: false, loading: () => null }
)

export const metadata = {
  title: 'Fresia — Asistente de intercambio de hogares | Rukka',
  description:
    'Fresia responde tus preguntas sobre home exchange en Chile. Cómo funciona el intercambio de casas, seguridad, ciudades disponibles y cómo usar Rukka.',
  alternates: {
    canonical: 'https://rukka.cl/FresIA',
  },
  openGraph: {
    title: 'Fresia — Asistente IA de Rukka',
    description:
      'Todo lo que necesitas saber sobre el intercambio de hogares en Chile. Respondido por Fresia, la asistente de Rukka.',
    url: 'https://rukka.cl/FresIA',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cómo funciona el intercambio de hogares?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El intercambio de hogares es simple: dos familias o personas acuerdan hospedarse mutuamente en sus casas durante fechas convenidas, sin ningún pago entre ellas. En Rukka el proceso es bilateral: cuando tú alojas a alguien, ellos te alojan a ti. Lo único que necesitas es publicar tu hogar, activar tu verificación de identidad y empezar a explorar las propuestas disponibles en Chile.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué es Rukka y en qué se diferencia de Airbnb o HomeExchange?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rukka es una plataforma chilena de intercambio de hogares: conectas tu casa con viajeros de distintas regiones de Chile sin pagar nada por el alojamiento. A diferencia de Airbnb no existe dinero de por medio, y a diferencia de plataformas globales, Rukka está diseñada para la realidad local. Crear una cuenta es gratis.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Es seguro dejar mi casa a desconocidos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rukka tiene un sistema de verificación de identidad obligatoria para todos los usuarios. El modelo de intercambio genera una responsabilidad mutua: ellos también te confían su casa, lo que crea un incentivo poderoso para cuidar el hogar del otro. La comunidad global de home exchange lleva décadas funcionando con tasas de incidentes muy bajas.',
      },
    },
    {
      '@type': 'Question',
      name: '¿En qué ciudades de Chile hay más intercambios disponibles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Santiago concentra la mayor parte de los hogares publicados en Rukka, especialmente en Providencia, Ñuñoa, Las Condes y La Florida. Fuera de la capital, Valparaíso y Viña del Mar son muy populares. Puerto Varas y la zona de Lagos del Sur también tienen presencia creciente en la plataforma.',
      },
    },
    {
      '@type': 'Question',
      name: '¿En qué ciudades de Chile funciona Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rukka opera en Chile. Puedes encontrar hogares en Santiago, Valparaíso, Viña del Mar, Puerto Varas, Villarrica, Pichilemu y muchas otras ciudades y regiones del país.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta usar Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Crear una cuenta, publicar tu hogar y explorar las propuestas disponibles es completamente gratuito en Rukka. El modelo de intercambio de hogares elimina por definición el costo de alojamiento: no pagas noche, no cobras noche.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué puede hacer Fresia por mí en Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fresia es la asistente IA de Rukka, desarrollada con tecnología Claude de Anthropic. Puede ayudarte a publicar tu hogar, buscar hogares disponibles en cualquier ciudad de Chile, y responder preguntas sobre el proceso de intercambio. Fresia habla en español chileno natural y conoce la comunidad de Rukka.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo funciona la verificación de identidad en Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Todos los usuarios de Rukka pasan por un proceso de verificación de identidad antes de poder solicitar o confirmar un intercambio. El sistema de valoraciones y reseñas permite además ver el historial de intercambios anteriores de cada persona, añadiendo una capa de confianza basada en la reputación real de la comunidad.',
      },
    },
  ],
}

export default function FresIAPage() {
  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      {/* JSON-LD FAQPage schema */}
      <Script
        id="fresia-faqpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <Link
          href="/"
          className="p-1.5 rounded-lg text-gray-400 hover:text-forest hover:bg-forest/5 transition"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <FresiaAvatar size={36} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-black text-gray-900 text-lg leading-none">Fresia</h1>
            <span className="text-xs bg-forest/10 text-forest font-semibold px-2 py-0.5 rounded-full">IA</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Asistente de hogares · powered by Claude ✦</p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-gray-400">En línea</span>
        </div>
      </div>

      {/* Chat interface */}
      <div className="flex flex-col h-[calc(100vh-57px)]" id="chat-fresia">
        <ChatInterface showHeader={false} />
      </div>
    </div>
  )
}
