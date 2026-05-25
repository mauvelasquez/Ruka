import './globals.css'
import Providers from './providers'
import FresiaWidget from '../components/fresia/FresiaWidget'
import GoogleAnalytics from '../components/GoogleAnalytics'

export const metadata = {
  metadataBase: new URL('https://rukka.cl'),
  title: 'Rukka — Intercambio de casas en Latinoamérica, 100% gratis',
  description: 'La primera plataforma latinoamericana de home exchange gratuito. Intercambia tu hogar con viajeros de Chile, México, Colombia y Argentina. Matching automático y bilateral.',
  keywords: ['intercambio de casas', 'home exchange gratis', 'intercambio hogar Chile', 'intercambio hogar México', 'intercambio hogar Colombia', 'intercambio hogar Argentina', 'rukka', 'viajes gratis latinoamérica'],
  openGraph: {
    title: 'Rukka — Intercambio de casas en Latinoamérica',
    description: 'Viaja intercambiando tu hogar. Chile · México · Colombia · Argentina. 100% gratis.',
    url: 'https://rukka.cl',
    siteName: 'Rukka',
    locale: 'es_419',
    type: 'website',
    images: [{ url: 'https://rukka.cl/rukka-logo.png', width: 1080, height: 1080, alt: 'Rukka' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rukka — Intercambio de casas en Latinoamérica',
    description: 'Viaja intercambiando tu hogar. Chile · México · Colombia · Argentina. 100% gratis.',
    site: '@rukka_cl',
    images: ['https://rukka.cl/rukka-logo.png'],
  },
  alternates: {
    canonical: 'https://rukka.cl',
    languages: {
      'es-419': 'https://rukka.cl',
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
                  'description': 'Plataforma latinoamericana de intercambio de casas 100% gratuita. Opera en Chile, México, Colombia y Argentina con matching bilateral automático.',
                  'areaServed': ['CL', 'MX', 'CO', 'AR'],
                  'foundingLocation': {
                    '@type': 'Place',
                    'addressCountry': 'CL',
                    'name': 'Chile',
                  },
                  'inLanguage': 'es',
                  'sameAs': [],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://rukka.cl/#website',
                  'url': 'https://rukka.cl',
                  'name': 'Rukka — Intercambio de casas en Latinoamérica',
                  'description': 'La primera plataforma latinoamericana de home exchange gratuito. Viaja intercambiando tu hogar en Chile, México, Colombia y Argentina.',
                  'publisher': { '@id': 'https://rukka.cl/#organization' },
                  'inLanguage': 'es',
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
