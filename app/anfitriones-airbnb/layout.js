export const metadata = {
  title: 'Anfitriones de Airbnb — Usa tu propiedad también en Rukka',
  description: 'Importa tu Airbnb a Rukka en segundos. Viaja por Chile intercambiando tu propiedad. Cuenta gratuita con verificación de identidad. Sin comisiones.',
  keywords: ['airbnb chile intercambio', 'anfitriones airbnb rukka', 'importar airbnb', 'home exchange airbnb', 'propiedad airbnb intercambio'],
  openGraph: {
    title: 'Anfitriones de Airbnb — Usa tu propiedad también en Rukka',
    description: 'Importa tu Airbnb a Rukka en segundos. Comunidad chilena de anfitriones que intercambian sus propiedades. Gratuito, con verificación de identidad.',
    url: 'https://rukka.cl/anfitriones-airbnb',
    siteName: 'Rukka',
    locale: 'es_419',
    type: 'website',
    images: [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
  },
  alternates: {
    canonical: 'https://rukka.cl/anfitriones-airbnb',
    languages: { 'es-419': 'https://rukka.cl/anfitriones-airbnb' },
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': '¿Tengo que dejar de usar Airbnb?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Para nada. Rukka y Airbnb conviven perfectamente. Puedes seguir recibiendo huéspedes en Airbnb con normalidad. Rukka es una capa adicional: usas tu propiedad también para intercambios cuando tú quieras viajar.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿Qué pasa con mis reservas activas en Airbnb?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Tú controlas las fechas disponibles para intercambio en Rukka. Solo ofreces los períodos que tienes libres. Si tienes reservas en Airbnb para julio, simplemente no ofreces julio en Rukka.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿El import de Airbnb trae todas mis fotos?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Sí. El import trae título, descripción, fotos, capacidad, número de habitaciones, baños y amenities directamente desde tu listing. Luego puedes editar lo que quieras antes de publicar.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿Tengo que pagar algo en Rukka?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Rukka no cobra comisión por intercambio, ni suscripción mensual, ni ningún costo oculto. Tu hogar es tu única moneda de cambio.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿Puedo importar más de una propiedad de Airbnb?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Sí. Si tienes varios Airbnbs puedes importar cada uno por separado y publicarlos todos en Rukka. Más propiedades equivale a más opciones de intercambio.',
      },
    },
    {
      '@type': 'Question',
      'name': '¿Cómo sé que la persona que viene a mi casa es confiable?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Todos los miembros de Rukka tienen perfil verificado con email confirmado. Además puedes ver el historial de intercambios y valoraciones antes de aceptar cualquier solicitud.',
      },
    },
  ],
}

export default function AnfitrionesLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
