export const metadata = {
  title: 'Hogares disponibles para intercambio en Chile — Rukka',
  description: 'Explora casas, departamentos y cabañas disponibles para intercambio en todo Chile. Zapallar, Pichilemu, Puerto Varas, Frutillar y más. 100% gratis.',
  keywords: ['hogares intercambio Chile', 'casas intercambio', 'home exchange Chile', 'cabañas intercambio', 'alojamiento gratis Chile'],
  openGraph: {
    title: 'Hogares para intercambio en Chile — Rukka',
    description: 'Encuentra tu hogar ideal para intercambiar. Casas, cabañas y departamentos en todo Chile, 100% gratis.',
    url: 'https://rukka.cl/homes',
    siteName: 'Rukka',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
  },
  alternates: {
    canonical: 'https://rukka.cl/homes',
    languages: { 'es-CL': 'https://rukka.cl/homes' },
  },
}

export default function HomesLayout({ children }) {
  return children
}
