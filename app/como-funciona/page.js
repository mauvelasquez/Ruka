import ComoFuncionaClient from './ComoFuncionaClient'

export const metadata = {
  title: 'Cómo funciona Rukka — Intercambia tu hogar y viaja gratis por Chile',
  description: 'Publica tu hogar y, cuando las fechas cuadran con otro miembro, el intercambio es directo y gratis al instante. Si no coinciden, nuestro equipo te ayuda a coordinar una alternativa para que igual viajes sin pagar alojamiento.',
  keywords: [
    'cómo funciona Rukka',
    'intercambio de casas Chile',
    'home exchange gratis Chile',
    'intercambio de hogares Chile',
    'viajar gratis sin hotel Chile',
    'match bilateral casas',
  ],
  openGraph: {
    title: 'Cómo funciona Rukka — Intercambia tu hogar y viaja gratis por Chile',
    description: 'Publica tu hogar y conecta con viajeros de todo Chile. Cuando las fechas cuadran, match directo y gratuito al instante. Conoce Chile intercambiando tu hogar.',
    url: 'https://rukka.cl/como-funciona',
  },
  alternates: {
    canonical: 'https://rukka.cl/como-funciona',
  },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo funciona Rukka: intercambiar tu hogar y viajar gratis por Chile',
  description: 'Rukka conecta a propietarios de hogares en Chile para intercambiar alojamiento de forma gratuita. Publica tu hogar y, si encuentras a alguien con fechas compatibles, el match es directo y gratis al instante. Si no, nuestro equipo te ayuda a coordinar una alternativa.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Publica tu hogar',
      text: 'Crea tu perfil y registra tu propiedad. Si ya tienes listing en Airbnb, impórtalo automáticamente con un link. Al completar tu perfil recibes 3 noches de alojamiento gratis de bienvenida.',
      url: 'https://rukka.cl/auth/register',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Explora destinos y encuentra tu match',
      text: 'Busca hogares disponibles en Chile. El sistema detecta automáticamente si hay alguien con fechas compatibles para un match directo.',
      url: 'https://rukka.cl/homes',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Intercambia y viaja sin pagar alojamiento',
      text: 'Confirma el intercambio dentro de Rukka. Si hay match directo, ambos viajan al mismo tiempo y el alojamiento es gratuito para los dos. Si las fechas no calzan exactamente, nuestro equipo te ayuda a coordinar una alternativa.',
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué pasa si no coincido en fechas con nadie?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nuestro equipo te ayuda a coordinar una alternativa para que igual puedas viajar y alojarte sin costo, sin necesidad de que las fechas calcen exactamente con otra persona.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué es el match bilateral en Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El match bilateral ocurre cuando dos miembros tienen fechas compatibles: el usuario A quiere ir a donde vive el usuario B, y viceversa, en el mismo período. El sistema los conecta automáticamente. Ambos viajan al mismo tiempo y el alojamiento es gratuito para los dos.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta usar Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El alojamiento es gratuito — ese es el modelo. Tu hospitalidad se intercambia por hospitalidad. No hay tarifa por noche ni cargo de servicio por el intercambio. La cuenta básica es gratuita.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo sé que las personas son de confianza?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Todos los miembros tienen verificación de identidad obligatoria: documento oficial más reconocimiento facial. Sin perfil verificado no se puede iniciar ningún intercambio. Además, en Rukka ambas partes ponen su hogar en la mesa — esa responsabilidad mutua crea un incentivo muy distinto al de otras plataformas.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Tengo que dejar mi casa disponible todo el año?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Tú eliges cuándo está disponible tu casa. Puedes bloquear fechas, aceptar o rechazar cada solicitud, y chatear con la otra persona antes de confirmar. Tienes control total sobre tu propiedad.',
      },
    },
    {
      '@type': 'Question',
      name: '¿En qué países opera Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rukka opera en Chile. Puedes intercambiar tu hogar con viajeros de distintas regiones del país.',
      },
    },
  ],
}

export default function ComoFuncionaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ComoFuncionaClient />
    </>
  )
}
