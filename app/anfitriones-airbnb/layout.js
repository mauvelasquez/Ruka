export const metadata = {
  title: 'Anfitriones de Airbnb — Usa tu propiedad también en Rukka',
  description: 'Si ya tienes tu propiedad en Airbnb, impórtala a Rukka en segundos y empieza a intercambiarla cuando viajas. 100% gratis, sin dejar Airbnb.',
  keywords: ['airbnb chile intercambio', 'anfitriones airbnb rukka', 'importar airbnb', 'home exchange airbnb', 'propiedad airbnb intercambio'],
  openGraph: {
    title: 'Anfitriones de Airbnb — Usa tu propiedad también en Rukka',
    description: 'Importa tu propiedad de Airbnb a Rukka en segundos. Viaja intercambiando tu hogar sin pagar alojamiento.',
    url: 'https://rukka.cl/anfitriones-airbnb',
    siteName: 'Rukka',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
  },
  alternates: {
    canonical: 'https://rukka.cl/anfitriones-airbnb',
    languages: { 'es-CL': 'https://rukka.cl/anfitriones-airbnb' },
  },
}

export default function AnfitrionesLayout({ children }) {
  return children
}
