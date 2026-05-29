'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Mail } from 'lucide-react'
import { getDestinations } from '../lib/geo/destinations'
import { useCountry } from '../hooks/useCountry'
import RukkaLogo from './RukkaLogo'

export default function Footer() {
  const { country: userCountry } = useCountry()
  const [destinations, setDestinations] = useState([])

  useEffect(() => {
    const country = userCountry || 'CL'
    const dataset = getDestinations(country).cities
    const shuffled = [...dataset].sort(() => 0.5 - Math.random()).slice(0, 5)
    setDestinations(shuffled)
  }, [userCountry])

  return (
    <footer className="bg-rukka-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <RukkaLogo height={44} />
            </div>
            <p className="text-sm leading-relaxed mb-4 text-gray-300">
              <em>Rukka</em> significa "hogar" en Mapudungun, la lengua del pueblo Mapuche. Conectamos viajeros de Latinoamérica que creen en la hospitalidad como forma de conocer el mundo desde adentro.
            </p>
            <p className="text-xs text-gray-400 italic">Con cariño, desde Chile para el mundo</p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Destinos</h3>
            <ul className="space-y-2.5 text-sm">
              {destinations.map(b => (
                <li key={b.id}>
                  <Link href={`/homes?search=${encodeURIComponent(b.city)}`}
                    className="text-gray-300 hover:text-forest-light transition-colors flex items-center gap-1.5">
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
                ['Cómo funciona', '/como-funciona'],
                ['Registrarse', '/auth/register'],
                ['Explorar hogares', '/homes'],
                ['Blog', '/blog'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-300 hover:text-forest-light transition-colors">{label}</Link>
                </li>
              ))}
              <li>
                <Link href="/anfitriones-airbnb" className="hover:text-[#ff5a5f] transition-colors text-[#ff5a5f]/80 font-semibold">
                  🏠 Para anfitriones Airbnb
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Soporte</h3>
            <ul className="space-y-2.5 text-sm">
              {[['Centro de ayuda', '#'], ['Seguridad', '#'], ['Términos', '/terminos'], ['Privacidad', '/terminos#privacidad']].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-gray-300 hover:text-forest-light transition-colors">{label}</a>
                </li>
              ))}
            </ul>
            <a href="mailto:hola@rukka.cl" className="flex items-center gap-2 text-forest-light hover:text-white mt-5 text-sm">
              <Mail className="w-4 h-4" /> hola@rukka.cl
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 Rukka. Todos los derechos reservados.</p>
          <p className="text-gray-300 italic text-sm">"Mi casa es tu casa."</p>
          <p className="flex items-center gap-1.5">
            Construido con <Heart className="w-3 h-3 text-terra fill-current" /> para la comunidad viajera de Latinoamérica
          </p>
        </div>
      </div>
    </footer>
  )
}
