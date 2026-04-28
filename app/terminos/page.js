'use client'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function TerminosPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Legal</p>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Términos y Condiciones</h1>
          <p className="text-gray-500 text-sm">Última actualización: abril 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 space-y-8 text-gray-700">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">1. Qué es Rukka</h2>
            <p className="text-sm leading-relaxed">
              Rukka es exclusivamente una plataforma digital de contacto entre personas que desean intercambiar el uso temporal de sus hogares. Rukka facilita el encuentro entre usuarios pero <strong>no forma parte del intercambio</strong> ni actúa como intermediario, agencia de viajes, empresa de arrendamiento ni servicio de hospitalidad.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. Responsabilidad de los usuarios</h2>
            <p className="text-sm leading-relaxed mb-3">
              La responsabilidad del intercambio es <strong>100% de los usuarios participantes</strong>. Al usar Rukka, cada usuario reconoce y acepta que:
            </p>
            <ul className="text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>El acuerdo de intercambio es un contrato directo entre las partes, sin participación de Rukka.</li>
              <li>Cada usuario es responsable de verificar la identidad, referencias y condiciones del hogar antes de confirmar cualquier intercambio.</li>
              <li>Los usuarios deben acordar explícitamente las condiciones del intercambio (fechas, número de personas, mascotas, normas del hogar, etc.) antes de realizarlo.</li>
              <li>Se recomienda confirmar los acuerdos por escrito dentro de la plataforma y conservar los registros de comunicación.</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. Limitación de responsabilidad de Rukka</h2>
            <p className="text-sm leading-relaxed mb-3">
              Rukka <strong>no se hace responsable</strong> por ningún daño, perjuicio o situación derivada del uso de la plataforma o de los intercambios realizados, incluyendo pero no limitado a:
            </p>
            <ul className="text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Daños materiales, robos, hurtos o pérdidas ocurridas dentro de los hogares.</li>
              <li>Accidentes, lesiones o situaciones de salud ocurridas durante el intercambio.</li>
              <li>Conflictos, desacuerdos o incumplimientos entre usuarios.</li>
              <li>Cancelaciones unilaterales de un intercambio confirmado.</li>
              <li>Información incorrecta o engañosa publicada por un usuario en su perfil o descripción del hogar.</li>
              <li>Pérdida de datos, interrupciones del servicio o errores técnicos de la plataforma.</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. No intervención de Rukka</h2>
            <p className="text-sm leading-relaxed">
              Rukka no interviene en los acuerdos entre usuarios ni garantiza el cumplimiento de ningún intercambio. Ante cualquier conflicto entre usuarios, Rukka puede, a su discreción, suspender cuentas que violen estos términos, pero no tiene obligación de mediar ni resolver disputas entre las partes.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">5. Condiciones de uso</h2>
            <ul className="text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Rukka es una plataforma exclusiva para Chile. Solo pueden registrarse personas mayores de 18 años.</li>
              <li>Cada usuario debe proporcionar información veraz y actualizada en su perfil.</li>
              <li>Está prohibido publicar hogares que no sean de propiedad o uso legal del usuario.</li>
              <li>El uso comercial de la plataforma (subarrendar con fines de lucro) queda expresamente prohibido.</li>
              <li>Rukka se reserva el derecho de eliminar perfiles, hogares o contenido que viole estos términos, sin previo aviso.</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">6. Privacidad y datos</h2>
            <p className="text-sm leading-relaxed">
              Los datos personales de los usuarios son tratados conforme a las disposiciones de la Ley 19.628 sobre Protección de la Vida Privada (Chile). Rukka solo comparte información de contacto entre usuarios que hayan acordado realizar un intercambio. Rukka no vende ni cede datos personales a terceros con fines comerciales.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">7. Modificaciones</h2>
            <p className="text-sm leading-relaxed">
              Rukka puede modificar estos términos en cualquier momento. Los cambios serán publicados en esta página con la fecha de actualización. El uso continuado de la plataforma tras la publicación de cambios implica la aceptación de los nuevos términos.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">8. Contacto</h2>
            <p className="text-sm leading-relaxed">
              Para consultas sobre estos términos, escríbenos a{' '}
              <a href="mailto:hola@rukka.cl" className="text-forest font-semibold hover:underline">hola@rukka.cl</a>.
            </p>
          </section>

        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-forest transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
