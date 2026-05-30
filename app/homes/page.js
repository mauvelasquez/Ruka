import HomesClient from './HomesClient'

export const metadata = {
  title: 'Hogares para Intercambio en Chile | Rukka',
  description: 'Explora casas disponibles para intercambio en Chile. Hogares de norte a sur listos para match bilateral o reserva con Yankis. Sin costo de alojamiento.',
  keywords: [
    'casas para intercambio Chile',
    'hogares intercambio Chile',
    'home exchange Chile',
    'casas disponibles Rukka',
    'intercambio casas playa montaña ciudad Chile',
  ],
  openGraph: {
    title: 'Hogares para Intercambio en Chile — Rukka',
    description: 'Casas, departamentos y cabañas disponibles para intercambio en Chile. Match bilateral o Yankis. Alojamiento gratuito.',
    url: 'https://rukka.cl/homes',
  },
  alternates: {
    canonical: 'https://rukka.cl/homes',
  },
}

export default function HomesPage() {
  return <HomesClient />
}
