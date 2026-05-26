import { FRESIA_FAQS, FRESIA_FAQS_CATEGORIAS } from '../../lib/fresia-faqs'
import { FresiaAvatar } from './ChatInterface'

// Server Component — HTML estático, indexable por Google y LLMs.
export default function FresiaFaqs() {
  return (
    <section className="bg-[#F8F4EE] py-12 px-4">
      {/* Header presentación */}
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <div className="flex justify-center mb-4">
          <FresiaAvatar size={64} />
        </div>
        <h1 className="text-2xl font-black text-rukka-dark mb-1">Fresia responde tus preguntas</h1>
        <p className="text-gray-500 text-sm">
          Asistente de Rukka · powered by{' '}
          <span className="text-forest font-semibold">Claude ✦</span>
        </p>
      </div>

      {/* FAQs por categoría */}
      <div className="max-w-3xl mx-auto space-y-10">
        {FRESIA_FAQS_CATEGORIAS.map((categoria) => {
          const faqs = FRESIA_FAQS.filter((f) => f.categoria === categoria)
          return (
            <div key={categoria}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-terra mb-4">
                {categoria}
              </h2>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.id}
                    id={faq.id}
                    className="group bg-white border border-sand rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none list-none font-semibold text-rukka-dark text-sm hover:bg-forest/5 transition-colors">
                      <span>{faq.pregunta}</span>
                      {/* Chevron */}
                      <svg
                        className="w-4 h-4 text-forest flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    {/* Respuesta en el HTML inicial — no depende de JS */}
                    <div className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-sand">
                      {faq.respuesta}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA al chat */}
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <p className="text-sm text-gray-500 mb-3">
          ¿Tienes una pregunta que no está aquí? Fresia puede responderte en tiempo real.
        </p>
        <a
          href="#chat-fresia"
          className="inline-flex items-center gap-2 bg-forest text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-forest-dark transition-colors"
        >
          Chatear con Fresia
        </a>
      </div>
    </section>
  )
}
