import './globals.css'
import Providers from './providers'
import FresiaWidget from '../components/fresia/FresiaWidget'
import GoogleAnalytics from '../components/GoogleAnalytics'

export const metadata = {
  metadataBase: new URL('https://rukka.cl'),
  title: 'Rukka — Intercambio de casas en Chile, 100% gratis',
  description: 'La primera plataforma chilena de home exchange gratuito. Intercambia tu hogar con otros viajeros y viaja sin pagar alojamiento. Matching automático y bilateral.',
  keywords: ['intercambio de casas Chile', 'home exchange gratis', 'intercambio hogar', 'viajes económicos Chile', 'rukka', 'intercambio hogar Chile'],
  openGraph: {
    title: 'Rukka — Intercambio de casas en Chile',
    description: 'Viaja intercambiando tu hogar. 100% gratis, con matching automático.',
    url: 'https://rukka.cl',
    siteName: 'Rukka',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rukka — Intercambio de casas en Chile',
    description: 'Viaja intercambiando tu hogar. 100% gratis, con matching automático.',
    site: '@rukka_cl',
    images: ['https://rukka.cl/rukka-logo.png'],
  },
  alternates: {
    canonical: 'https://rukka.cl',
    languages: {
      'es-CL': 'https://rukka.cl',
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://rukka.cl/#organization',
                  'name': 'Rukka',
                  'url': 'https://rukka.cl',
                  'logo': 'https://rukka.cl/rukka-logo.png',
                  'description': 'Plataforma chilena de intercambio de casas 100% gratuita con matching bilateral automático entre viajeros.',
                  'foundingLocation': {
                    '@type': 'Place',
                    'addressCountry': 'CL',
                    'name': 'Chile',
                  },
                  'inLanguage': 'es-CL',
                  'sameAs': [],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://rukka.cl/#website',
                  'url': 'https://rukka.cl',
                  'name': 'Rukka — Intercambio de casas en Chile',
                  'description': 'La primera plataforma chilena de home exchange gratuito. Viaja intercambiando tu hogar con otros viajeros.',
                  'publisher': { '@id': 'https://rukka.cl/#organization' },
                  'inLanguage': 'es-CL',
                  'potentialAction': {
                    '@type': 'SearchAction',
                    'target': 'https://rukka.cl/homes?search={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
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
