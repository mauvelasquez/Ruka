import ComoFuncionaClient from './ComoFuncionaClient'

export const metadata = {
  title: 'Cómo funciona Rukka — Intercambia tu hogar y viaja gratis por LATAM',
  description: 'Publica tu hogar, ganas Yankis cada vez que hospedas, y úsalos para alojarte en Chile, México, Colombia o Argentina cuando quieras. Si las fechas cuadran con alguien, el intercambio es directo y gratis al instante.',
  keywords: [
    'cómo funciona Rukka',
    'intercambio de casas latinoamerica',
    'home exchange gratis LATAM',
    'qué son los Yankis Rukka',
    'intercambio de hogares Chile México Colombia Argentina',
    'viajar gratis sin hotel LATAM',
    'match bilateral casas',
    'sistema Yankis tokens intercambio',
  ],
  openGraph: {
    title: 'Cómo funciona Rukka — Intercambia tu hogar y viaja gratis por LATAM',
    description: 'Tu hospitalidad siempre vale. Cada noche que hospedas se convierte en un Yanki (1 Yanki = 1 noche). Cuando las fechas cuadran, match directo gratuito. Opera en Chile, México, Colombia y Argentina.',
    url: 'https://rukka.cl/como-funciona',
  },
  alternates: {
    canonical: 'https://rukka.cl/como-funciona',
  },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo funciona Rukka: intercambiar tu hogar y viajar gratis por Latinoamérica',
  description: 'Rukka convierte tu hospitalidad en créditos de viaje llamados Yankis (1 Yanki = 1 noche). Publica tu hogar, acumula Yankis al hospedar, y úsalos para alojarte en Chile, México, Colombia o Argentina cuando quieras. Si encuentras a alguien con fechas compatibles, el match es directo y gratis — los Yankis se cancelan entre sí.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Publica tu hogar',
      text: 'Creá tu perfil y registrá tu propiedad. Si ya tenés listing en Airbnb, importalo automáticamente con un link. Al completar tu perfil recibís 3 Yankis de bienvenida.',
      url: 'https://rukka.cl/auth/register',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Explora destinos y encuentra tu match',
      text: 'Busca hogares disponibles en Chile, México, Colombia o Argentina. El sistema detecta automáticamente si hay alguien con fechas compatibles (match directo) o te muestra cuántos Yankis necesitas para reservar.',
      url: 'https://rukka.cl/homes',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Intercambia y viaja sin pagar alojamiento',
      text: 'Confirma el intercambio dentro de Rukka. Si hay match directo, ambos viajan al mismo tiempo y los Yankis se cancelan entre sí. Si no, tus Yankis se descuentan automáticamente al confirmar. En ambos casos, el alojamiento es gratuito.',
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué son los Yankis de Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yanki es una palabra quechua que significa trueque. Es la moneda interna de Rukka: 1 Yanki = 1 noche de alojamiento. Los miembros ganan Yankis al hospedar a visitantes y los usan para alojarse en cualquier hogar de Rukka cuando quieran viajar. Los Yankis no caducan y no se compran — solo se ganan hospedando.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pasa si no coincido en fechas con nadie?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para eso están los Yankis. Publica tu casa, hospeda cuando puedas y acumula Yankis que usas cuando quieras viajar — sin necesidad de que los tiempos cuadren con otra persona. 1 Yanki = 1 noche en cualquier hogar de Rukka.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué es el match bilateral en Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El match bilateral ocurre cuando dos miembros tienen fechas compatibles: el usuario A quiere ir a donde vive el usuario B, y viceversa, en el mismo período. El sistema los conecta automáticamente. Ambos viajan al mismo tiempo y los Yankis se cancelan entre sí — el alojamiento es gratuito para los dos.',
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
        text: 'Rukka opera en Chile, México, Colombia y Argentina. Puedes intercambiar entre cualquiera de estos cuatro países latinoamericanos.',
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
