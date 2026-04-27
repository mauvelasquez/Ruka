import Link from 'next/link'
import { Mountain, Heart, Mail } from 'lucide-react'
import { getRandomBanners } from '../lib/chile-banners'

export default function Footer() {
  const destinations = getRandomBanners(5)

  return (
    <footer className="bg-ruka-dark text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 landscape-gradient rounded-xl flex items-center justify-center">
                <Mountain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">Ruka</span>
            </div>
            <p className="text-sm leading-relaxed mb-4 text-gray-400">
              <em>Ruka</em> significa "hogar" en Mapudungun, la lengua del pueblo Mapuche. Conectamos viajeros que creen que la mejor forma de conocer Chile es desde adentro.
            </p>
            <p className="text-xs text-gray-600 italic">Hecho con ❤️ en Chile</p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Destinos</h3>
            <ul className="space-y-2.5 text-sm">
              {destinations.map(b => (
                <li key={b.id}>
                  <Link href={`/homes?search=${encodeURIComponent(b.city)}`}
                    className="hover:text-forest-light transition-colors flex items-center gap-1.5">
                    <span>{b.emoji}</span> {b.city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Comunidad</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Cómo funciona', '/homes'],
                ['Registrarse gratis', '/auth/register'],
                ['Buscar match', '/matches'],
                ['Explorar hogares', '/homes'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-forest-light transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Soporte</h3>
            <ul className="space-y-2.5 text-sm">
              {[['Centro de ayuda', '#'], ['Seguridad', '#'], ['Términos', '#'], ['Privacidad', '#']].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:text-forest-light transition-colors">{label}</a>
                </li>
              ))}
            </ul>
            <a href="mailto:hola@ruka.cl" className="flex items-center gap-2 text-forest-light hover:text-white mt-5 text-sm">
              <Mail className="w-4 h-4" /> hola@ruka.cl
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2026 Ruka. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            Construido con <Heart className="w-3 h-3 text-terra fill-current" /> para la comunidad viajera de Chile
          </p>
        </div>
      </div>
    </footer>
  )
}
