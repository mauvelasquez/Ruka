import Link from 'next/link'
import { Shield, Monitor, Search, ChevronRight, ExternalLink, CheckCircle, AlertTriangle, AlertCircle, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Auditorías — Rukka',
  robots: { index: false, follow: false },
}

// ── Scorecard de la auditoría UX ────────────────────────────────────────────
const UX_SCORECARD = [
  { n: 1, dim: 'Primera impresión y propuesta de valor', peso: '10%', score: 7.0, aporte: 0.70, estado: 'aceptable' },
  { n: 2, dim: 'Arquitectura de información y navegación', peso: '10%', score: 8.0, aporte: 0.80, estado: 'bueno' },
  { n: 3, dim: 'Diseño visual y consistencia de marca', peso: '12%', score: 8.5, aporte: 1.02, estado: 'bueno' },
  { n: 4, dim: 'Contenido, copy y señales de confianza', peso: '12%', score: 7.5, aporte: 0.90, estado: 'bueno' },
  { n: 5, dim: 'Conversión y embudo de onboarding', peso: '15%', score: 7.0, aporte: 1.05, estado: 'aceptable' },
  { n: 6, dim: 'Formularios y UX de inputs', peso: '10%', score: 7.5, aporte: 0.75, estado: 'bueno' },
  { n: 7, dim: 'Accesibilidad (WCAG 2.2 AA)', peso: '15%', score: 6.5, aporte: 0.98, estado: 'aceptable' },
  { n: 8, dim: 'UX mobile / responsive', peso: '8%', score: 8.0, aporte: 0.64, estado: 'bueno' },
  { n: 9, dim: 'Performance y velocidad percibida', peso: '8%', score: 7.0, aporte: 0.56, estado: 'aceptable' },
]

const UX_P0 = [
  'Suavizar el popup de bienvenida: mostrarlo tras scroll/interacción, no superpuesto al cargar.',
  'Asociar etiquetas y campos (id + htmlFor) en login y registro.',
  'Baseline global de foco (:focus-visible en globals.css) + @media (prefers-reduced-motion: reduce).',
]
const UX_P1 = [
  'Previsualizar el valor del onboarding antes del muro de registro.',
  'Subir la prueba social a la home (testimonios, rostros verificados, casas reales).',
  'Mitigar el cold-start con expectativas claras mientras crece el inventario.',
  'Bajar el peso de JS con code-splitting y lazy-load (~811 KB en 19 chunks).',
]

const ESTADO_COLORS = {
  bueno:     { bg: 'bg-forest-50',  text: 'text-forest-dark',  border: 'border-forest/20',  dot: 'bg-forest'  },
  aceptable: { bg: 'bg-yellow-50',  text: 'text-yellow-700',   border: 'border-yellow-200', dot: 'bg-yellow-400' },
  trabajo:   { bg: 'bg-orange-50',  text: 'text-orange-700',   border: 'border-orange-200', dot: 'bg-orange-400' },
}

function ScoreBar({ score }) {
  const pct = (score / 10) * 100
  const color = score >= 8 ? 'bg-forest' : score >= 7 ? 'bg-yellow-400' : 'bg-orange-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-6 text-right">{score}</span>
    </div>
  )
}

// ── Hub cards ────────────────────────────────────────────────────────────────
const AUDITS = [
  {
    id: 'ux',
    icon: Monitor,
    color: 'forest',
    title: 'Auditoría UX',
    date: '30 mayo 2026',
    score: '74/100',
    scoreLabel: 'Bueno',
    status: 'complete',
    summary: '9 dimensiones heurísticas sobre 8 rutas públicas. Score de línea base: 74/100. Meta Q3: 80+.',
  },
  {
    id: 'seo',
    icon: Search,
    color: 'andean',
    title: 'Auditoría SEO / IA',
    date: null,
    score: null,
    scoreLabel: null,
    status: 'pending',
    summary: 'Pendiente. Incluirá: indexabilidad, Core Web Vitals, schema markup, presencia en buscadores IA.',
  },
  {
    id: 'seguridad',
    icon: Shield,
    color: 'terra',
    title: 'Auditoría de Seguridad',
    date: null,
    score: null,
    scoreLabel: null,
    status: 'pending',
    summary: 'Pendiente. Incluirá: revisión de RLS, endpoints admin, exposición de env vars, dependencias vulnerables.',
  },
]

const COLOR_MAP = {
  forest: { ring: 'ring-forest/20', icon: 'bg-forest-50 text-forest', border: 'border-forest/20' },
  andean: { ring: 'ring-andean/20', icon: 'bg-andean-50 text-andean-dark', border: 'border-andean/20' },
  terra:  { ring: 'ring-terra/20',  icon: 'bg-terra-50 text-terra',    border: 'border-terra/20'  },
}

export default function AuditoriasPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-rukka-dark text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-forest-light text-xs font-bold uppercase tracking-widest mb-3">
            <Shield className="w-4 h-4" />
            Área privada · Acceso restringido
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Centro de Auditorías</h1>
          <p className="text-white/60 text-sm max-w-xl">
            Documentación técnica interna: UX, SEO/IA y Seguridad. Solo visible para el equipo.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Hub cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {AUDITS.map(audit => {
            const Icon = audit.icon
            const c = COLOR_MAP[audit.color]
            return (
              <a
                key={audit.id}
                href={`#${audit.id}`}
                className={`bg-white rounded-2xl border ${c.border} p-5 hover:shadow-md transition-shadow group ring-0 hover:ring-2 ${c.ring}`}
              >
                <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-black text-gray-900 text-sm leading-tight">{audit.title}</h2>
                  {audit.status === 'complete'
                    ? <CheckCircle className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
                    : <Clock className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                  }
                </div>
                {audit.date && (
                  <p className="text-xs text-gray-400 mb-2">{audit.date}</p>
                )}
                {audit.score && (
                  <p className="text-xl font-black text-forest mb-1">{audit.score} <span className="text-sm font-normal text-gray-500">— {audit.scoreLabel}</span></p>
                )}
                <p className="text-xs text-gray-500 leading-relaxed">{audit.summary}</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-forest mt-3 group-hover:gap-2 transition-all">
                  {audit.status === 'complete' ? 'Ver auditoría' : 'Próximamente'}
                  <ChevronRight className="w-3 h-3" />
                </div>
              </a>
            )
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SECCIÓN: AUDITORÍA UX                                            */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section id="ux" className="scroll-mt-6">

          {/* Encabezado de sección */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest flex items-center justify-center flex-shrink-0">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-forest mb-0.5">Auditoría completa</p>
              <h2 className="text-2xl font-black text-gray-900">Auditoría UX total — Rukka</h2>
            </div>
          </div>

          {/* Meta */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><p className="text-xs text-gray-400 mb-0.5">Fecha</p><p className="font-semibold text-gray-800">30 mayo 2026</p></div>
            <div><p className="text-xs text-gray-400 mb-0.5">Tipo</p><p className="font-semibold text-gray-800">Heurística experta</p></div>
            <div><p className="text-xs text-gray-400 mb-0.5">Cobertura</p><p className="font-semibold text-gray-800">8 rutas públicas</p></div>
            <div><p className="text-xs text-gray-400 mb-0.5">Evidencia</p><p className="font-semibold text-gray-800">16 capturas + código</p></div>
          </div>

          {/* Resumen ejecutivo */}
          <div className="bg-forest-dark text-white rounded-2xl p-6 mb-6">
            <p className="text-forest-light text-xs font-bold uppercase tracking-widest mb-3">Resumen ejecutivo</p>
            <p className="text-4xl font-black mb-1">74 <span className="text-xl font-normal text-white/60">/ 100</span></p>
            <p className="text-forest-light font-semibold text-sm mb-4">Bueno — por encima del promedio de un marketplace temprano</p>
            <div className="space-y-2 text-sm text-white/80">
              <p><strong className="text-white">1.</strong> Fricción en primera visita: popup de bienvenida bloquea el contenido al cargar.</p>
              <p><strong className="text-white">2.</strong> Accesibilidad: labels sin <code className="text-forest-light">htmlFor</code>, sin <code className="text-forest-light">prefers-reduced-motion</code>, sin baseline de foco.</p>
              <p><strong className="text-white">3.</strong> ~811 KB de JS en 19 chunks penaliza el tiempo a interactivo en mobile.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50">
              Meta a 90 días: <strong className="text-white/80">80+</strong> · Meta a 6 meses: <strong className="text-white/80">86+</strong>
            </div>
          </div>

          {/* Scorecard */}
          <div className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-stone-100">
              <h3 className="font-black text-gray-900">Scorecard de referencia</h3>
              <p className="text-xs text-gray-400 mt-0.5">Escala: 90–100 Excelente · 80–89 Sólido · 70–79 Bueno · 60–69 Aceptable · &lt;50 Crítico</p>
            </div>
            <div className="divide-y divide-stone-50">
              {UX_SCORECARD.map(row => {
                const c = ESTADO_COLORS[row.estado]
                return (
                  <div key={row.n} className="px-5 py-3 grid grid-cols-[2rem_1fr_3rem_auto] sm:grid-cols-[2rem_1fr_4rem_3rem_6rem] gap-3 items-center">
                    <span className="text-xs font-bold text-gray-400">{row.n}</span>
                    <span className="text-sm text-gray-800 font-medium leading-tight">{row.dim}</span>
                    <span className="hidden sm:block text-xs text-gray-400 text-center">{row.peso}</span>
                    <span className="text-sm font-black text-gray-900 text-right">{row.score}</span>
                    <div className="hidden sm:block">
                      <ScoreBar score={row.score} />
                    </div>
                  </div>
                )
              })}
              <div className="px-5 py-3 grid grid-cols-[2rem_1fr_3rem_auto] sm:grid-cols-[2rem_1fr_4rem_3rem_6rem] gap-3 items-center bg-gray-50">
                <span />
                <span className="text-sm font-black text-gray-900">TOTAL</span>
                <span className="hidden sm:block text-xs text-gray-400 text-center">100%</span>
                <span className="text-sm font-black text-forest text-right">74/100</span>
                <div className="hidden sm:block"><ScoreBar score={7.4} /></div>
              </div>
            </div>
          </div>

          {/* Recomendaciones priorizadas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-red-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <h3 className="font-black text-gray-900 text-sm">P0 — Crítico (días)</h3>
              </div>
              <ol className="space-y-2">
                {UX_P0.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white rounded-2xl border border-yellow-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <h3 className="font-black text-gray-900 text-sm">P1 — Importante (semanas)</h3>
              </div>
              <ol className="space-y-2">
                {UX_P1.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="bg-yellow-400 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">{i + 4}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Hallazgos por dimensión — detalle */}
          <div className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-stone-100">
              <h3 className="font-black text-gray-900">Hallazgos por dimensión</h3>
            </div>
            <div className="divide-y divide-stone-50">
              {[
                { n: '4.1', dim: 'Primera impresión — 7.0/10', estado: 'aceptable', items: [
                  '✅ Hero con buen gancho sobre paisaje chileno y módulo de búsqueda inmediato.',
                  '✅ Sección "Hogares destacados en Chile" con tarjetas reales.',
                  '⚠️ Popup de bienvenida superpuesto al cargar — bloquea la exploración.',
                ]},
                { n: '4.2', dim: 'Arquitectura e información — 8.0/10', estado: 'bueno', items: [
                  '✅ Rutas reales del App Router: compartibles, SEO-friendly.',
                  '✅ Landings diferenciadas: /anfitriones-airbnb, /about.',
                  '⚠️ /como-funciona usa casi solo H2 — aplana el escaneo.',
                ]},
                { n: '4.3', dim: 'Diseño visual — 8.5/10', estado: 'bueno', items: [
                  '✅ Sistema visual coherente: paleta, tipografía, componentes consistentes.',
                  '→ Para subir a 9+: más fotos de casas reales y rostros verificados.',
                ]},
                { n: '4.4', dim: 'Contenido y confianza — 7.5/10', estado: 'bueno', items: [
                  '✅ Tablas comparativas, FAQ, testimonios en /anfitriones-airbnb.',
                  '⚠️ Prueba social más débil en la home. Cold-start visible en el inventario.',
                ]},
                { n: '4.5', dim: 'Conversión y onboarding — 7.0/10', estado: 'aceptable', items: [
                  '✅ Login con Google, toggle de contraseña, 3 Yankis de bienvenida.',
                  '⚠️ Popup puede aumentar rebote. "Publicar mi casa" exige cuenta antes de mostrar valor.',
                ]},
                { n: '4.6', dim: 'Formularios — 7.5/10', estado: 'bueno', items: [
                  '✅ autocomplete, inputMode, enterKeyHint, focus:ring — mejor que el promedio.',
                  '⚠️ <label> sin htmlFor / inputs sin id — no asociados para lectores de pantalla.',
                ]},
                { n: '4.7', dim: 'Accesibilidad WCAG 2.2 AA — 6.5/10', estado: 'aceptable', items: [
                  '⚠️ P0: etiqueta–campo no asociada (1.3.1 A).',
                  '⚠️ P0: sin baseline de foco visible en globals.css (2.4.7 AA).',
                  '⚠️ P0: 0 archivos con prefers-reduced-motion (2.3.3 AA).',
                ]},
                { n: '4.8', dim: 'UX mobile — 8.0/10', estado: 'bueno', items: [
                  '✅ Reflejo a una columna limpio, CTAs a ancho completo.',
                  '→ Verificar targets táctiles ≥44px en el header.',
                ]},
                { n: '4.9', dim: 'Performance — 7.0/10', estado: 'aceptable', items: [
                  '✅ TTFB ~0.2–0.5s, HTML liviano (43 KB home).',
                  '⚠️ ~811 KB JS en 19 chunks → penaliza mobile.',
                ]},
              ].map(row => {
                const c = ESTADO_COLORS[row.estado]
                return (
                  <div key={row.n} className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-gray-400">{row.n}</span>
                      <h4 className="text-sm font-black text-gray-900">{row.dim}</h4>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold ${c.bg} ${c.text}`}>
                        {row.estado.charAt(0).toUpperCase() + row.estado.slice(1)}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {row.items.map((item, i) => (
                        <li key={i} className="text-xs text-gray-600 leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Formularios — tabla detalle */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-5 mb-6">
            <h3 className="font-black text-gray-900 mb-4 text-sm">Formularios — Detalle (código verificado)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left py-2 pr-4 font-bold text-gray-500">Característica</th>
                    <th className="text-center py-2 px-3 font-bold text-gray-500">Login</th>
                    <th className="text-center py-2 pl-3 font-bold text-gray-500">Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {[
                    ['<label> visibles', '✅', '✅'],
                    ['autocomplete', '✅ email, current-password', '✅ name, email, new-password'],
                    ['inputMode + enterKeyHint mobile', '✅', '✅'],
                    ['Toggle contraseña (aria-label)', '✅', '✅'],
                    ['required + error inline', '✅', '✅'],
                    ['focus:ring', '✅', '✅'],
                    ['label.htmlFor ↔ input.id', '⚠️ falta', '⚠️ falta'],
                  ].map(([feat, login, reg]) => (
                    <tr key={feat}>
                      <td className="py-2 pr-4 text-gray-700">{feat}</td>
                      <td className="py-2 px-3 text-center text-gray-700">{login}</td>
                      <td className="py-2 pl-3 text-center text-gray-700">{reg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Métricas de performance */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-5 mb-6">
            <h3 className="font-black text-gray-900 mb-4 text-sm">Performance — Métricas reales (producción)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left py-2 pr-4 font-bold text-gray-500">Métrica</th>
                    <th className="text-left py-2 pr-4 font-bold text-gray-500">Valor</th>
                    <th className="text-left py-2 font-bold text-gray-500">Lectura</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {[
                    ['TTFB (home)', '~0.2–0.5 s', '🟢 Bien'],
                    ['HTML (home)', '43 KB', '🟢 Bien'],
                    ['HTML (/homes)', '15 KB', '🟢 Muy bien'],
                    ['JavaScript (home)', '~811 KB en 19 chunks', '🟠 Pesado'],
                    ['CSS (home)', '64 KB', '🟡 Aceptable'],
                  ].map(([metrica, valor, lectura]) => (
                    <tr key={metrica}>
                      <td className="py-2 pr-4 font-medium text-gray-800">{metrica}</td>
                      <td className="py-2 pr-4 text-gray-700">{valor}</td>
                      <td className="py-2 text-gray-700">{lectura}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Evidencia visual */}
          <div className="bg-white rounded-2xl border border-stone-200/60 p-5 mb-6">
            <h3 className="font-black text-gray-900 mb-4 text-sm">Evidencia visual (16 capturas)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { file: '01-home-desktop.png',                  label: 'Home — desktop' },
                { file: '01-home-mobile.png',                   label: 'Home — mobile' },
                { file: '02-como-funciona-desktop.png',         label: 'Cómo funciona' },
                { file: '03-homes-desktop.png',                 label: 'Explorar casas' },
                { file: '04-login-desktop.png',                 label: 'Login' },
                { file: '05-register-desktop.png',              label: 'Registro' },
                { file: '07-anfitriones-airbnb-desktop.png',    label: 'Anfitriones Airbnb' },
                { file: '08-about-desktop.png',                 label: 'About' },
              ].map(({ file, label }) => (
                <a
                  key={file}
                  href={`/ux-audit/assets/${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl overflow-hidden border border-stone-200/60 hover:border-forest/40 transition-colors"
                >
                  <div className="bg-stone-100 aspect-video flex items-center justify-center relative">
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-forest transition-colors" />
                  </div>
                  <p className="text-xs text-gray-600 p-2 font-medium">{label}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Limitaciones */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
            <h3 className="font-black text-gray-700 text-sm mb-2">Limitaciones</h3>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>Flujos autenticados no auditados (dashboard, verificación, Yankis, mensajería).</li>
              <li>Métricas de performance desde red rápida — en mobile/3G serán peores.</li>
              <li>Evaluación heurística experta sin test moderado con usuarios reales.</li>
              <li>Próxima auditoría sugerida: Q3 2026, con cuenta de prueba + pasada de axe por ruta.</li>
            </ul>
          </div>

          <div className="bg-white border border-stone-200/60 rounded-2xl px-5 py-4 text-xs text-gray-400 text-center">
            Línea base generada el 30 de mayo de 2026. Repetir con la misma rúbrica de 9 dimensiones para medir progreso.
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SECCIÓN: SEO / IA (placeholder)                                  */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section id="seo" className="scroll-mt-6 mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-andean-50 text-andean-dark flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-andean-dark mb-0.5">Próximamente</p>
              <h2 className="text-2xl font-black text-gray-900">Auditoría SEO / IA</h2>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-andean/20 p-8 text-center">
            <Clock className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Esta auditoría aún no está disponible.</p>
            <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
              Incluirá: indexabilidad, Core Web Vitals, schema markup, cobertura en buscadores IA (ChatGPT, Perplexity, Claude).
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SECCIÓN: SEGURIDAD (placeholder)                                 */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section id="seguridad" className="scroll-mt-6 mt-12 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-terra-50 text-terra flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terra mb-0.5">Próximamente</p>
              <h2 className="text-2xl font-black text-gray-900">Auditoría de Seguridad</h2>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-terra/20 p-8 text-center">
            <Clock className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Esta auditoría aún no está disponible.</p>
            <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
              Incluirá: revisión de RLS, endpoints admin, exposición de env vars, dependencias vulnerables, headers de seguridad.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
