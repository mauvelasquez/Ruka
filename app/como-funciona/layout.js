export const metadata = {
  title: 'Cómo funciona Rukka — Intercambio de casas en Latinoamérica',
  description: 'Descubre cómo funciona el intercambio de hogares en Rukka: publica tu casa, encuentra tu match automático y viaja por Latinoamérica sin pagar alojamiento.',
  keywords: ['cómo funciona intercambio casas', 'home exchange latinoamerica', 'intercambio hogar Chile México Colombia Argentina', 'matching automático hogares'],
  openGraph: {
    title: 'Cómo funciona Rukka — Intercambio de casas en Latinoamérica',
    description: 'Publica tu hogar, encuentra tu match y viaja. 4 pasos simples para intercambiar casas en Latinoamérica.',
    url: 'https://rukka.cl/como-funciona',
    siteName: 'Rukka',
    locale: 'es_419',
    type: 'website',
    images: [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
  },
  alternates: {
    canonical: 'https://rukka.cl/como-funciona',
    languages: { 'es-419': 'https://rukka.cl/como-funciona' },
  },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  'name': 'Cómo funciona el intercambio de casas en Rukka',
  'description': 'Rukka conecta a viajeros de Latinoamérica para intercambiar sus hogares de forma automática.',
  'step': [
    {
      '@type': 'HowToStep',
      'position': 1,
      'name': 'Registra tu hogar',
      'text': 'Crea tu perfil y publica tu hogar con fotos, descripción y las fechas en que está disponible para intercambio. ¿Ya estás en Airbnb? Impórtalo en segundos.',
    },
    {
      '@type': 'HowToStep',
      'position': 2,
      'name': 'Elige tu destino',
      'text': 'Busca hogares en Chile, México, Colombia o Argentina. Explora el catálogo de casas, cabañas y departamentos disponibles para intercambio.',
    },
    {
      '@type': 'HowToStep',
      'position': 3,
      'name': 'El sistema encuentra tu match automático',
      'text': 'Rukka analiza las fechas disponibles de todos los hogares y genera automáticamente los intercambios más compatibles entre viajeros.',
    },
    {
      '@type': 'HowToStep',
      'position': 4,
      'name': 'Confirma y viaja sin pagar alojamiento',
      'text': 'Recibes una notificación con tu match, revisas el hogar de la otra persona y confirmas el intercambio bilateral. Durante las fechas acordadas, tú te quedas en su hogar y ellos en el tuyo.',
    },
  ],
  'totalTime': 'PT5M',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': '¿Tengo que intercambiar al mismo tiempo?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'No necesariamente. Puedes acordar fechas distintas con la otra persona. Lo importante es que ambos puedan viajar en algún momento del año.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿Qué pasa si me cancelan el intercambio?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Todos los perfiles están verificados y tienen valoraciones visibles. Puedes hablar con el otro usuario antes de confirmar y siempre quedan registros dentro de la plataforma.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿En qué países funciona Rukka?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Actualmente operamos en Chile, México, Colombia y Argentina. Estamos construyendo una comunidad sólida en toda Latinoamérica y seguimos expandiéndonos.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿Cómo funciona el matching automático?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Rukka compara las fechas en que cada hogar está disponible para intercambio. Cuando dos usuarios tienen fechas compatibles y sus destinos se cruzan, el sistema genera automáticamente una propuesta de intercambio bilateral.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿Es seguro intercambiar mi casa con desconocidos?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Rukka verifica la identidad de sus usuarios y permite ver el perfil completo de cada persona antes de confirmar un intercambio. La comunidad se basa en la confianza mutua y la reciprocidad.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿Puedo intercambiar mi casa si también la arriendo en Airbnb?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Sí. Puedes definir fechas específicas para intercambio en Rukka y mantener tu propiedad disponible en Airbnb el resto del tiempo. Son modelos compatibles.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿Qué son los Yankis de Rukka?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Los Yankis son la moneda interna de Rukka. La palabra "Yanki" viene del quechua y significa trueque. 1 Yanki equivale a 1 noche de alojamiento. Puedes ganar Yankis prestando tu casa y usarlos para alojarte en cualquier otro hogar de Rukka.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿Cómo gano Yankis en Rukka?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Por cada noche que prestas tu hogar a otro usuario de Rukka, recibes 1 Yanki automáticamente. También recibes 3 Yankis de bienvenida al completar tu perfil.',
      },
    },
  ],
}

export default function ComoFuncionaLayout({ children }) {
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
      {children}
    </>
  )
}
