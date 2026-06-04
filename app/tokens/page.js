import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export const metadata = {
  title: 'Yankis — Intercambia tu Casa sin Coincidir en Fechas | Rukka',
  description: 'El sistema de Yankis de Rukka te permite ofrecer tu casa, acumular tokens y hospedarte en otra propiedad cuando quieras. Sin necesidad de match simultáneo. Viaja por Chile.',
  keywords: [
    'sistema de tokens intercambio casas',
    'Yankis Rukka',
    'intercambio casas sin fechas simultáneas',
    'tokens home exchange Chile',
    'acumular créditos viaje gratis',
    'hospedar sin pagar Chile',
  ],
  openGraph: {
    title: 'Yankis Rukka — Intercambia sin Coincidir en Fechas',
    description: 'Gana Yankis hospedando visitantes y úsalos para viajar por Chile cuando quieras. 1 Yanki = 1 noche en cualquier hogar de Rukka.',
    url: 'https://rukka.cl/tokens',
  },
  alternates: {
    canonical: 'https://rukka.cl/tokens',
  },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo usar el sistema de Yankis de Rukka',
  description: 'El sistema de Yankis de Rukka te permite ofrecer tu casa, acumular créditos y hospedarte en otra propiedad cuando quieras, sin necesidad de coincidir en fechas con otro usuario.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Publica tu hogar en Rukka',
      text: 'Registra tu propiedad en Rukka. Puedes importarla desde Airbnb automáticamente. Al completar tu perfil recibes 3 Yankis de bienvenida.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Hospeda visitantes y gana Yankis',
      text: 'Cada noche que hospedan a alguien en tu casa, recibes 1 Yanki automáticamente. Los Yankis se acreditan en tu cuenta al completar la estadía.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Elige tu destino',
      text: 'Busca hogares disponibles en Chile. Filtra por fechas, tipo de propiedad y ciudad.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Reserva usando tus Yankis',
      text: '1 Yanki = 1 noche de alojamiento. Los Yankis se descuentan automáticamente al confirmar tu reserva. Si cancelas, los Yankis se devuelven íntegros.',
    },
  ],
}

const STEPS = [
  {
    n: '01',
    emoji: '🏠',
    title: 'Publica tu hogar',
    desc: 'Registra tu propiedad en Rukka. Puedes importarla automáticamente desde Airbnb. Recibes 3 Yankis de bienvenida al completar tu perfil.',
  },
  {
    n: '02',
    emoji: '🤝',
    title: 'Hospeda visitantes',
    desc: 'Acepta solicitudes de otros miembros. Por cada noche hospedada, recibes 1 Yanki automáticamente en tu cuenta.',
  },
  {
    n: '03',
    emoji: '🗺️',
    title: 'Elige dónde ir',
    desc: 'Busca hogares disponibles en Chile en las fechas que tú quieras.',
  },
  {
    n: '04',
    emoji: '✈️',
    title: 'Viaja con tus Yankis',
    desc: '1 Yanki = 1 noche. Se descuentan al confirmar. Si cancelas, los Yankis se devuelven íntegros.',
  },
]

const COMPARISON_ROWS = [
  { feature: 'Requiere fechas simultáneas',   bilateral: 'Sí', yankis: 'No' },
  { feature: 'Flexibilidad horaria',           bilateral: 'Baja', yankis: 'Total' },
  { feature: 'Costo de alojamiento',           bilateral: '$0', yankis: '$0 (con Yankis)' },
  { feature: 'Ideal para',                     bilateral: 'Fechas perfectamente compatibles', yankis: 'Viajeros con agenda variable' },
  { feature: 'Créditos que se acumulan',       bilateral: 'No aplica', yankis: 'Sí — nunca caducan' },
]

export default function TokensPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Hero */}
        <header className="mb-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Sistema de tokens</p>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-5 leading-tight">
            Yankis — Intercambia sin<br />coincidir en fechas
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Los Yankis son la moneda interna de Rukka. Ofrece tu casa, acumula créditos y úsalos
            para hospedarte en cualquier hogar de la red cuando quieras. Sin necesidad de match simultáneo.
          </p>
          <p className="mt-6 text-2xl font-black text-terra">1 Yanki = 1 noche de alojamiento</p>
        </header>

        {/* Qué son los Yankis */}
        <section className="mb-16 bg-white rounded-3xl p-8 sm:p-10 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-4">¿Qué son los Yankis?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>Yanki</strong> es una palabra en quechua que significa <em>trueque o intercambio</em>.
            Es el token interno de Rukka: un sistema simple y justo donde cada noche de hospitalidad
            se convierte en una noche de viaje para ti.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            El sistema de Yankis resuelve el principal obstáculo del intercambio de casas tradicional:
            encontrar dos personas que quieran visitarse <em>exactamente</em> en las mismas fechas.
            Con Yankis, puedes hospedar hoy y viajar en tres meses. O acumular Yankis durante el año
            y usarlos todos en un viaje largo.
          </p>
          <div className="bg-terra-50 rounded-2xl p-6 border border-terra/20">
            <p className="font-bold text-terra text-lg mb-2">Los Yankis no caducan</p>
            <p className="text-gray-600 text-sm">
              A diferencia de millas o puntos de programas de viajero, los Yankis son tuyos para siempre.
              Hospeda durante temporadas de alta demanda y viaja cuando tú quieras.
            </p>
          </div>
        </section>

        {/* Cómo funciona paso a paso */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">
            ¿Cómo funciona paso a paso?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{s.emoji}</div>
                <p className="text-terra text-xs font-bold mb-1">Paso {s.n}</p>
                <h3 className="font-black text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ganar y usar Yankis */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border-2 border-terra/20 shadow-sm">
              <h3 className="text-xl font-black text-terra mb-4">¿Cómo ganas Yankis?</h3>
              <ul className="text-gray-600 text-sm space-y-3">
                <li className="flex gap-3">
                  <span className="text-terra font-bold">1.</span>
                  <span>1 noche hospedada = 1 Yanki acreditado automáticamente</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-terra font-bold">2.</span>
                  <span>3 Yankis de bienvenida al completar tu perfil</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-terra font-bold">3.</span>
                  <span>Los Yankis no caducan nunca</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-forest/20 shadow-sm">
              <h3 className="text-xl font-black text-forest mb-4">¿Cómo usas tus Yankis?</h3>
              <ul className="text-gray-600 text-sm space-y-3">
                <li className="flex gap-3">
                  <span className="text-forest font-bold">1.</span>
                  <span>Busca el hogar donde quieres ir y las fechas disponibles</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-forest font-bold">2.</span>
                  <span>Confirma la reserva: se descuentan automáticamente 1 Yanki por noche</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-forest font-bold">3.</span>
                  <span>Si cancelas con anticipación, los Yankis se devuelven íntegros</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tabla comparativa */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
            Yankis vs Match Bilateral — ¿Cuál elegir?
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-bold text-gray-700">Característica</th>
                  <th className="text-left px-4 py-3 font-bold text-forest">Match Bilateral</th>
                  <th className="text-left px-4 py-3 font-bold text-terra">Yankis</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(({ feature, bilateral, yankis }, i) => (
                  <tr key={feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 font-medium text-gray-700">{feature}</td>
                    <td className="px-4 py-3 text-forest">{bilateral}</td>
                    <td className="px-4 py-3 text-terra">{yankis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            Rukka usa ambos modelos automáticamente. Cuando hay match bilateral, se prioriza. Si no, el sistema usa Yankis.
          </p>
        </section>

        {/* Disponibilidad por país */}
        <section className="mb-16 bg-white rounded-3xl p-8 sm:p-10 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-4">¿Dónde puedo usar mis Yankis?</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Los Yankis son válidos en todos los hogares activos de la red Rukka, a lo largo de todo Chile:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { flag: '🇨🇱', name: 'Norte' },
              { flag: '🇨🇱', name: 'Zona Central' },
              { flag: '🇨🇱', name: 'Sur' },
              { flag: '🇨🇱', name: 'Patagonia' },
            ].map(({ flag, name }) => (
              <div key={name} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl text-center">
                <span className="text-3xl">{flag}</span>
                <span className="font-bold text-gray-900 text-sm">{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-forest-dark rounded-3xl p-10 text-white">
          <div className="text-4xl mb-4">🪙</div>
          <h2 className="text-3xl font-black mb-4">Empieza a acumular Yankis hoy</h2>
          <p className="text-white/70 mb-2 max-w-md mx-auto">
            Registra tu hogar, completa tu perfil y recibe 3 Yankis de bienvenida.
          </p>
          <p className="text-white/50 text-sm mb-8">Sin tarjeta de crédito. Sin contrato.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register"
              className="bg-white text-forest-dark font-black px-8 py-3 rounded-2xl hover:bg-sand transition-colors">
              Crear mi cuenta gratis
            </Link>
            <Link href="/como-funciona"
              className="border border-white/30 text-white font-bold px-8 py-3 rounded-2xl hover:bg-white/10 transition-colors">
              Ver cómo funciona
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
