import './globals.css'
import Providers from './providers'
import FresiaWidget from '../components/fresia/FresiaWidget'
import GoogleAnalytics from '../components/GoogleAnalytics'

export const dynamic = 'force-dynamic'

export const metadata = {
  metadataBase: new URL('https://rukka.cl'),
  title: 'Rukka – Intercambia tu hogar, vive Chile y el mundo',
  description: 'Mi casa es tu casa. Rukka conecta viajeros que intercambian sus hogares. Vive como local en Chile sin gastar en alojamiento. Importa tu propiedad de Airbnb fácilmente e intercámbiala con otros usuarios.',
  keywords: 'rukka, intercambio hogar, home exchange, chile, viajes, mapuche',
  openGraph: {
    title: 'Rukka – Intercambia tu hogar, vive Chile y el mundo',
    description: 'Intercambia tu hogar y vive como local en Chile. Gratis, sin comisiones.',
    url: 'https://rukka.cl',
    siteName: 'Rukka',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rukka – Intercambio de hogares en Chile',
    description: 'Intercambia tu hogar y vive como local en Chile. Gratis, sin comisiones.',
    site: '@rukka_cl',
    images: ['https://rukka.cl/rukka-logo.png'],
  },
  alternates: {
    canonical: 'https://rukka.cl',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/rukka-logo.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/rukka-logo.png" sizes="180x180" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <Providers>
          {children}
          <FresiaWidget />
        </Providers>
      </body>
    </html>
  )
}
