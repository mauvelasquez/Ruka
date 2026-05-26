export const metadata = {
  title: 'Hogares disponibles para intercambio en Chile — Rukka',
  description: 'Explora casas, departamentos y cabañas disponibles para intercambio en Latinoamérica. Chile, México, Colombia, Argentina y más.',
  keywords: ['hogares intercambio latinoamerica', 'casas intercambio', 'home exchange Chile México Colombia Argentina', 'cabañas intercambio', 'alojamiento intercambio latam'],
  openGraph: {
    title: 'Hogares para intercambio en Latinoamérica — Rukka',
    description: 'Encuentra tu hogar ideal para intercambiar. Casas, cabañas y departamentos en toda Latinoamérica.',
    url: 'https://rukka.cl/homes',
    siteName: 'Rukka',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hogares para intercambio en Latinoamérica — Rukka',
    description: 'Encuentra tu hogar ideal para intercambiar. Casas, cabañas y departamentos en toda Latinoamérica.',
    site: '@rukka_cl',
    images: ['https://rukka.cl/rukka-logo.png'],
  },
  alternates: {
    canonical: 'https://rukka.cl/homes',
    languages: { 'es-CL': 'https://rukka.cl/homes' },
  },
}

export default function HomesLayout({ children }) {
  return children
}
