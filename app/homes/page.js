import HomesClient from './HomesClient'

export const metadata = {
  title: 'Hogares para Intercambio en Chile, México, Colombia y Argentina | Rukka',
  description: 'Explora casas disponibles para intercambio en toda Latinoamérica. Hogares en Chile, México, Colombia y Argentina listos para match bilateral o reserva con Yankis. Sin costo de alojamiento.',
  keywords: [
    'casas para intercambio LATAM',
    'hogares intercambio Chile',
    'hogares intercambio México',
    'hogares intercambio Colombia',
    'hogares intercambio Argentina',
    'home exchange latinoamerica',
    'casas disponibles Rukka',
    'intercambio casas playa montaña ciudad',
  ],
  openGraph: {
    title: 'Hogares para Intercambio en Latinoamérica — Rukka',
    description: 'Casas, departamentos y cabañas disponibles para intercambio en Chile, México, Colombia y Argentina. Match bilateral o Yankis. Alojamiento gratuito.',
    url: 'https://rukka.cl/homes',
  },
  alternates: {
    canonical: 'https://rukka.cl/homes',
  },
}

export default function HomesPage() {
  return <HomesClient />
}
