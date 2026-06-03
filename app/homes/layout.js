export const metadata = {
  title: 'Hogares disponibles para intercambio en Chile — Rukka',
  description: 'Explora casas, departamentos y cabañas disponibles para intercambio en Chile. Viaja por Chile intercambiando tu hogar.',
  keywords: ['hogares intercambio Chile', 'casas intercambio Chile', 'home exchange Chile', 'cabañas intercambio Chile', 'alojamiento intercambio Chile'],
  openGraph: {
    title: 'Hogares para intercambio en Chile — Rukka',
    description: 'Encuentra tu hogar ideal para intercambiar en Chile. Casas, cabañas y departamentos de norte a sur.',
    url: 'https://rukka.cl/homes',
    siteName: 'Rukka',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hogares para intercambio en Chile — Rukka',
    description: 'Encuentra tu hogar ideal para intercambiar. Casas, cabañas y departamentos en todo Chile.',
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
