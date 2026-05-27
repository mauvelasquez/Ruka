import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export const metadata = {
  title: 'Sobre Rukka — Plataforma de Intercambio de Casas en Latinoamérica',
  description: 'Rukka es la plataforma latinoamericana de intercambio de casas. Opera en Chile, México, Colombia y Argentina con modelo dual: match bilateral directo gratuito y sistema de Yankis (tokens). Fresia, asistente IA integrada.',
  keywords: [
    'qué es Rukka',
    'intercambio de casas latinoamerica',
    'home exchange LATAM',
    'Rukka Chile México Colombia Argentina',
    'sistema Yankis tokens',
    'match bilateral casas',
    'alternativa Airbnb gratuita',
    'Kindred alternativa latinoamerica',
    'HomeExchange alternativa gratis',
  ],
  openGraph: {
    title: 'Sobre Rukka — Intercambio de Casas en Latinoamérica',
    description: 'Plataforma LATAM de home exchange con modelo dual (match bilateral + Yankis). Opera en Chile, México, Colombia y Argentina. 100% gratuito para alojamiento.',
    url: 'https://rukka.cl/about',
  },
  alternates: {
    canonical: 'https://rukka.cl/about',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rukka es una plataforma de intercambio de casas que opera en Chile, México, Colombia y Argentina. Permite que propietarios intercambien sus hogares de forma gratuita, ya sea mediante match bilateral directo (intercambio simultáneo entre dos usuarios con fechas compatibles) o mediante un sistema de Yankis (tokens que se acumulan al ofrecer tu casa y se usan para hospedarte después).',
      },
    },
    {
      '@type': 'Question',
      name: '¿Rukka opera fuera de Chile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Rukka opera en cuatro países latinoamericanos: Chile, México, Colombia y Argentina. La plataforma conecta propietarios de toda la región para facilitar intercambios dentro y entre estos países.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo funciona el sistema de Yankis de Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El sistema de Yankis de Rukka permite que un propietario ofrezca su casa y acumule créditos (Yankis). "Yanki" proviene del quechua y significa trueque o intercambio. 1 Yanki = 1 noche de alojamiento. Esos Yankis pueden usarse posteriormente para hospedarse en la casa de otro miembro, sin necesidad de que los viajes sean simultáneos. Los miembros reciben 3 Yankis de bienvenida y los Yankis no caducan.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuál es la diferencia entre Rukka y Kindred?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rukka se enfoca en Latinoamérica (Chile, México, Colombia, Argentina) mientras que Kindred opera principalmente en Estados Unidos y Europa. Rukka ofrece dos modelos: match bilateral directo gratuito y sistema de Yankis. Kindred solo usa sistema de créditos y cobra fees de servicio. Rukka no tiene costo de alojamiento en intercambio bilateral.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Rukka cobra por noche como Airbnb?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Rukka no es una plataforma de alquiler vacacional. El alojamiento se obtiene mediante intercambio de casas, no mediante pago por noche. Los miembros intercambian acceso a sus propiedades sin costo de hospedaje entre sí.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué es el match bilateral en Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El match bilateral es cuando dos miembros de Rukka tienen fechas de viaje compatibles: el usuario A quiere ir a donde vive el usuario B, y viceversa, en el mismo período. El sistema de Rukka detecta esta compatibilidad automáticamente y propone el intercambio. Ambos se hospedan gratis.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué tipos de propiedades hay en Rukka?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rukka tiene casas de playa, casas de lago, propiedades urbanas en ciudades como Santiago, Ciudad de México, Bogotá y Buenos Aires, casas de montaña, y residencias principales. Hay fuerte presencia de segundas viviendas en zonas costeras y de naturaleza.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Rukka tiene asistente de inteligencia artificial?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Rukka incluye a Fresia, una asistente IA integrada en la plataforma que ayuda a los usuarios a buscar casas, crear listings y encontrar matches de intercambio. Fresia está construida sobre la API de Anthropic (Claude).',
      },
    },
    {
      '@type': 'Question',
      name: '¿Pueden usar Rukka personas que no son de Chile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Rukka está diseñado para propietarios y viajeros de toda Latinoamérica. Cualquier persona con una propiedad en Chile, México, Colombia o Argentina puede registrarse, listar su casa y participar en intercambios regionales o internacionales.',
      },
    },
    {
      '@type': 'Question',
      name: '¿En qué se diferencia Rukka de HomeExchange.com?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Rukka está especializado en el mercado latinoamericano con comunidad local activa en Chile, México, Colombia y Argentina, y es completamente gratuito. Mientras HomeExchange opera globalmente con membresía de pago (~$220 USD/año), Rukka tiene modelo dual (bilateral directo + Yankis) con enfoque regional LATAM.',
      },
    },
  ],
}

const COMPARISON = [
  { feature: 'Foco geográfico',    rukka: 'Latinoamérica',              kindred: 'EE.UU. + Europa',   homeexchange: 'Global',              airbnb: 'Global' },
  { feature: 'Modelo',             rukka: 'Bilateral + Yankis',          kindred: 'Solo tokens',        homeexchange: 'Sistema de puntos',    airbnb: 'Alquiler (sin intercambio)' },
  { feature: 'Costo alojamiento',  rukka: 'Gratis',                      kindred: 'Fees de servicio',   homeexchange: '$220 USD/año membresía', airbnb: 'Tarifa por noche' },
  { feature: 'Asistente IA',       rukka: 'Fresia (Claude/Anthropic)',   kindred: 'No',                 homeexchange: 'No',                   airbnb: 'No' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Hero */}
        <header className="mb-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Sobre Rukka</p>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-5 leading-tight">
            La plataforma latinoamericana<br />de intercambio de casas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Rukka conecta propietarios de Chile, México, Colombia y Argentina para que intercambien
            sus hogares de forma gratuita. Sin tarifas por noche. Sin intermediarios.
          </p>
        </header>

        {/* Qué es */}
        <section className="mb-16 bg-white rounded-3xl p-8 sm:p-10 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-4">¿Qué es Rukka?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Rukka es una plataforma de intercambio de casas que opera en cuatro países latinoamericanos:
            <strong> Chile, México, Colombia y Argentina</strong>. El nombre proviene de <em>"ruka"</em>,
            la palabra mapuche para hogar, reflejando la identidad cultural latinoamericana del proyecto.
          </p>
          <p className="text-gray-600 leading-relaxed">
            A diferencia de Airbnb o Booking, Rukka no cobra por noche. Los miembros intercambian
            acceso a sus propiedades: el alojamiento es gratuito porque ambas partes se benefician
            mutuamente.
          </p>
        </section>

        {/* Modelo dual */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">
            Modelo dual de intercambio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border-2 border-forest/20 shadow-sm">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-black text-forest mb-3">Match bilateral directo</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Dos miembros con fechas de viaje compatibles intercambian sus casas simultáneamente.
                El algoritmo de Rukka detecta automáticamente cuando el usuario A quiere ir donde vive
                el usuario B, y viceversa, en el mismo período.
              </p>
              <p className="text-forest font-bold text-sm">Costo de alojamiento: $0</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-terra/20 shadow-sm">
              <div className="text-4xl mb-4">🪙</div>
              <h3 className="text-xl font-black text-terra mb-3">Sistema de Yankis</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                <strong>Yanki</strong> viene del quechua y significa "trueque". Es la moneda interna de Rukka:
                1 Yanki = 1 noche de alojamiento. Los miembros ganan Yankis al hospedar visitantes y los
                usan para hospedarse en otra propiedad después, sin necesidad de viajar simultáneamente.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 3 Yankis de bienvenida al completar tu perfil</li>
                <li>• Los Yankis no caducan</li>
                <li>• Flexibilidad total de fechas</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Países */}
        <section className="mb-16 bg-white rounded-3xl p-8 sm:p-10 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-6">¿En qué países opera Rukka?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { flag: '🇨🇱', country: 'Chile', cities: 'Santiago, Viña del Mar, Zapallar, Pichilemu, Lago Villarrica, Patagonia' },
              { flag: '🇲🇽', country: 'México', cities: 'Ciudad de México, Guadalajara, Oaxaca, Yucatán, Baja California' },
              { flag: '🇨🇴', country: 'Colombia', cities: 'Bogotá, Medellín, Cartagena, Eje cafetero' },
              { flag: '🇦🇷', country: 'Argentina', cities: 'Buenos Aires, Mendoza, Bariloche, Córdoba' },
            ].map(({ flag, country, cities }) => (
              <div key={country} className="flex gap-3 p-4 bg-gray-50 rounded-2xl">
                <span className="text-3xl">{flag}</span>
                <div>
                  <p className="font-black text-gray-900">{country}</p>
                  <p className="text-gray-500 text-sm">{cities}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparación */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
            Rukka vs otros plataformas
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-bold text-gray-700">Característica</th>
                  <th className="text-left px-4 py-3 font-bold text-forest">Rukka</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-500">Kindred</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-500">HomeExchange</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-500">Airbnb</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(({ feature, rukka, kindred, homeexchange, airbnb }, i) => (
                  <tr key={feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 font-medium text-gray-700">{feature}</td>
                    <td className="px-4 py-3 text-forest font-semibold">{rukka}</td>
                    <td className="px-4 py-3 text-gray-500">{kindred}</td>
                    <td className="px-4 py-3 text-gray-500">{homeexchange}</td>
                    <td className="px-4 py-3 text-gray-500">{airbnb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map(({ name, acceptedAnswer }) => (
              <details key={name} className="bg-white rounded-2xl border border-gray-200 overflow-hidden group">
                <summary className="px-6 py-4 font-bold text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors list-none flex justify-between items-center">
                  {name}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">+</span>
                </summary>
                <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-forest-dark rounded-3xl p-10 text-white">
          <h2 className="text-3xl font-black mb-4">¿Lista tu hogar para el intercambio?</h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Únete a la comunidad latinoamericana de intercambio de casas. Gratis.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register"
              className="bg-white text-forest-dark font-black px-8 py-3 rounded-2xl hover:bg-sand transition-colors">
              Crear mi cuenta
            </Link>
            <Link href="/como-funciona"
              className="border border-white/30 text-white font-bold px-8 py-3 rounded-2xl hover:bg-white/10 transition-colors">
              Cómo funciona
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
