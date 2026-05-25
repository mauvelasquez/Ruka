export const metadata = {
  title: 'Mis matches — Rukka',
  description: 'Revisa tus matches de intercambio de hogares en Rukka. El sistema detecta automáticamente cuándo dos viajeros quieren visitarse en fechas compatibles.',
  openGraph: {
    title: 'Mis matches de intercambio — Rukka',
    description: 'Tu sistema de matching automático de intercambio de hogares en Chile.',
    url: 'https://rukka.cl/matches',
    siteName: 'Rukka',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: {
    canonical: 'https://rukka.cl/matches',
  },
}

export default function MatchesLayout({ children }) {
  return children
}
