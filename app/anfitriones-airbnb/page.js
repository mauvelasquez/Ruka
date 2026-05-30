import AnfitrioneClient from './AnfitrioneClient'

export const metadata = {
  title: 'Anfitriones Airbnb en Rukka — Intercambia sin dejar de rentar',
  description: 'Si ya eres anfitrión en Airbnb, Rukka te permite también intercambiar tu propiedad y viajar gratis por Chile. Importa tu listing de Airbnb en segundos. Sin comisiones, sin suscripción.',
  keywords: [
    'anfitriones Airbnb intercambio casas',
    'importar Airbnb Rukka',
    'home exchange anfitriones latinoamerica',
    'alternativa Airbnb intercambio',
    'viaje gratis anfitrión LATAM',
    'complemento Airbnb intercambio hogares',
  ],
  openGraph: {
    title: 'Anfitriones Airbnb — Intercambia tu casa y viaja gratis con Rukka',
    description: 'Importa tu listing de Airbnb automáticamente. Usa tu propiedad para intercambios cuando quieras viajar. Sin comisiones ni suscripción mensual.',
    url: 'https://rukka.cl/anfitriones-airbnb',
  },
  alternates: {
    canonical: 'https://rukka.cl/anfitriones-airbnb',
  },
}

export default function AnfitrioneAirbnbPage() {
  return <AnfitrioneClient />
}
