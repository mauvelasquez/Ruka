import './globals.css'
import Providers from './providers'

export const metadata = {
  metadataBase: new URL('https://rukka.cl'),
  title: 'Rukka – Intercambia tu hogar, vive Chile y el mundo',
  description: 'Rukka conecta viajeros que quieren intercambiar sus hogares. Vive como local en Chile y el mundo sin gastar en alojamiento.',
  keywords: 'rukka, intercambio hogar, home exchange, chile, viajes, mapuche',
  openGraph: {
    title: 'Rukka – Intercambia tu hogar, vive Chile y el mundo',
    description: 'Intercambia tu hogar y vive como local en Chile. Gratis, sin comisiones.',
    url: 'https://rukka.cl',
    siteName: 'Rukka',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rukka – Intercambio de hogares en Chile',
    description: 'Intercambia tu hogar y vive como local en Chile. Gratis, sin comisiones.',
    site: '@rukka_cl',
  },
  alternates: {
    canonical: 'https://rukka.cl',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏔️</text></svg>" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
