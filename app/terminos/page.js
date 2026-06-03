'use client'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function TerminosPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8F4EE' }}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-terra mb-3">Legal</p>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Términos y Privacidad</h1>
          <p className="text-gray-500 text-sm">Última actualización: 30 de abril de 2026</p>
        </div>

        {/* Tabla de contenidos */}
        <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Contenido</p>
          <ol className="space-y-2 text-sm">
            <li>
              <a href="#privacidad" className="text-forest font-semibold hover:underline flex items-center gap-2">
                <span className="text-terra font-bold">I.</span> Política de Privacidad
              </a>
              <ol className="mt-1 ml-5 space-y-1 text-gray-500">
                <li><a href="#datos-google" className="hover:text-forest transition-colors">1. Datos de Google que accedemos</a></li>
                <li><a href="#uso-datos" className="hover:text-forest transition-colors">2. Cómo usamos tus datos</a></li>
                <li><a href="#almacenamiento" className="hover:text-forest transition-colors">3. Cómo almacenamos los datos</a></li>
                <li><a href="#terceros" className="hover:text-forest transition-colors">4. Compartir datos con terceros</a></li>
                <li><a href="#retencion" className="hover:text-forest transition-colors">5. Retención y eliminación</a></li>
                <li><a href="#derechos" className="hover:text-forest transition-colors">6. Tus derechos</a></li>
                <li><a href="#contacto-privacidad" className="hover:text-forest transition-colors">7. Contacto</a></li>
              </ol>
            </li>
            <li className="pt-2">
              <a href="#terminos" className="text-forest font-semibold hover:underline flex items-center gap-2">
                <span className="text-terra font-bold">II.</span> Términos de Servicio
              </a>
            </li>
            <li className="pt-2">
              <a href="#CL" className="text-forest font-semibold hover:underline flex items-center gap-2">
                <span className="text-terra font-bold">III.</span> Verificación de Identidad por País
              </a>
              <ol className="mt-1 ml-5 space-y-1 text-gray-500">
                <li><a href="#CL" className="hover:text-forest transition-colors">🇨🇱 Chile — Ley 19.628</a></li>
                <li><a href="#CO" className="hover:text-forest transition-colors">🇨🇴 Colombia — Ley 1581 de 2012</a></li>
                <li><a href="#AR" className="hover:text-forest transition-colors">🇦🇷 Argentina — Ley 25.326</a></li>
                <li><a href="#MX" className="hover:text-forest transition-colors">🇲🇽 México — LFPDPPP</a></li>
              </ol>
            </li>
            <li className="pt-2">
              <a href="#publicidad" className="text-forest font-semibold hover:underline flex items-center gap-2">
                <span className="text-terra font-bold">IV.</span> Uso de datos para personalización y publicidad
              </a>
            </li>
          </ol>
        </nav>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN I — POLÍTICA DE PRIVACIDAD
        ══════════════════════════════════════════════════════════════ */}
        <div id="privacidad" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 space-y-10 text-gray-700 mb-8 scroll-mt-24">

          <div>
            <div className="inline-flex items-center gap-2 bg-forest/8 text-forest rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
              Sección I
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Política de Privacidad</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Esta Política de Privacidad describe cómo Rukka ("<strong>nosotros</strong>", "<strong>la plataforma</strong>") recopila, utiliza y protege la información personal de los usuarios que acceden a <strong>rukka.cl</strong>, incluyendo aquellos que se autentican mediante Google OAuth 2.0.
            </p>
          </div>

          {/* 1 — Datos de Google */}
          <section id="datos-google" className="scroll-mt-24">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-forest text-white text-xs font-black flex items-center justify-center flex-shrink-0">1</span>
              Datos de Google que accedemos
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              Cuando el usuario elige iniciar sesión con Google, Rukka solicita acceso únicamente a los siguientes datos a través de OAuth 2.0:
            </p>
            <div className="bg-green-50 border border-green-100 rounded-xl p-5 mb-4">
              <p className="text-xs font-bold text-green-800 uppercase tracking-wide mb-3">✓ Datos que SÍ accedemos</p>
              <ul className="text-sm space-y-2 text-green-900">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span><span><strong>Nombre completo</strong> — para personalizar el perfil del usuario en la plataforma.</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span><span><strong>Dirección de correo electrónico</strong> — para identificar la cuenta y enviar notificaciones del servicio.</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span><span><strong>Foto de perfil (avatar)</strong> — para mostrar la imagen del usuario en su perfil público.</span></li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span><span><strong>ID único de Google</strong> — exclusivamente para gestionar la sesión de autenticación.</span></li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-5">
              <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-3">✗ Datos que NO accedemos</p>
              <p className="text-sm text-red-800 leading-relaxed">
                Rukka <strong>no accede ni solicita</strong> acceso a: contactos de Gmail, calendarios de Google, Google Drive, historial de búsqueda, ubicación, datos financieros, YouTube, Google Photos ni ningún otro servicio o dato de Google más allá de lo indicado anteriormente.
              </p>
            </div>
          </section>

          {/* 2 — Uso */}
          <section id="uso-datos" className="scroll-mt-24">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-forest text-white text-xs font-black flex items-center justify-center flex-shrink-0">2</span>
              Cómo usamos tus datos
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              La información obtenida mediante Google OAuth se usa exclusivamente para:
            </p>
            <ul className="text-sm space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Crear y gestionar tu cuenta</strong> en Rukka: nombre, email y foto se almacenan en tu perfil de usuario.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Mostrar tu identidad</strong> dentro de la plataforma: nombre y foto son visibles para otros usuarios cuando hay un intercambio activo o pendiente.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Autenticar sesiones</strong>: el ID único de Google permite identificarte de forma segura al iniciar sesión.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Comunicaciones del servicio</strong>: usamos tu email para notificaciones de intercambios, confirmaciones y comunicaciones operativas. No enviamos publicidad de terceros.</span></li>
            </ul>
            <p className="text-sm text-gray-500 mt-4 italic">
              Rukka no usa datos de Google para publicidad, perfilado comercial ni análisis de comportamiento con fines externos al servicio.
            </p>
          </section>

          {/* 3 — Almacenamiento */}
          <section id="almacenamiento" className="scroll-mt-24">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-forest text-white text-xs font-black flex items-center justify-center flex-shrink-0">3</span>
              Cómo almacenamos los datos
            </h3>
            <ul className="text-sm space-y-3 leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Los datos se almacenan en servidores seguros gestionados por <strong>Supabase</strong>, infraestructura alojada en <strong>Amazon Web Services (AWS)</strong> con cifrado en reposo y en tránsito.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Rukka <strong>no almacena tokens de acceso de Google</strong> ni contraseñas. La autenticación se gestiona íntegramente mediante el estándar <strong>OAuth 2.0</strong>.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Las comunicaciones entre el navegador y nuestros servidores están protegidas mediante <strong>HTTPS/TLS</strong>.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>El acceso a los datos de los usuarios está restringido al equipo de Rukka y solo para fines operativos necesarios.</span></li>
            </ul>
          </section>

          {/* 4 — Terceros */}
          <section id="terceros" className="scroll-mt-24">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-forest text-white text-xs font-black flex items-center justify-center flex-shrink-0">4</span>
              Compartir datos con terceros
            </h3>
            <ul className="text-sm space-y-3 leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-red-400 font-bold mt-0.5">✗</span><span>Rukka <strong>no vende, arrienda ni cede</strong> datos personales de sus usuarios a terceros.</span></li>
              <li className="flex items-start gap-2"><span className="text-red-400 font-bold mt-0.5">✗</span><span><strong>No compartimos datos de Google</strong> con anunciantes, agencias de marketing ni plataformas de análisis externas.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Los datos de perfil (nombre y foto) <strong>son visibles para otros usuarios</strong> de la plataforma únicamente en el contexto de un intercambio activo o pendiente.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Rukka puede compartir datos cuando sea legalmente requerido por autoridades competentes bajo la legislación chilena.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Utilizamos Supabase como proveedor de infraestructura de base de datos. Sus políticas de privacidad están disponibles en <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-forest underline">supabase.com/privacy</a>.</span></li>
            </ul>
          </section>

          {/* 5 — Retención */}
          <section id="retencion" className="scroll-mt-24">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-forest text-white text-xs font-black flex items-center justify-center flex-shrink-0">5</span>
              Retención y eliminación de datos
            </h3>
            <ul className="text-sm space-y-3 leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Los datos se retienen mientras la cuenta esté activa o mientras sea necesario para proveer el servicio.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>El usuario puede <strong>eliminar su cuenta en cualquier momento</strong>. Tras la eliminación, todos los datos personales se borran de nuestros servidores en un plazo máximo de <strong>30 días</strong>.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Para solicitar la eliminación de datos, escribe a <a href="mailto:hola@rukka.cl" className="text-forest font-semibold hover:underline">hola@rukka.cl</a> con el asunto <em>"Eliminación de datos"</em>.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Puedes <strong>revocar el acceso de Rukka a tu cuenta de Google</strong> en cualquier momento desde <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-forest underline">myaccount.google.com/permissions</a>. Revocar el acceso cerrará tu sesión, pero tus datos permanecerán en nuestros servidores hasta que solicites su eliminación.</span></li>
            </ul>
          </section>

          {/* 6 — Derechos */}
          <section id="derechos" className="scroll-mt-24">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-forest text-white text-xs font-black flex items-center justify-center flex-shrink-0">6</span>
              Tus derechos
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              De acuerdo con la Ley 19.628 de Protección de la Vida Privada (Chile) y las mejores prácticas internacionales, tienes derecho a:
            </p>
            <ul className="text-sm space-y-2 leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Acceder</strong> a los datos personales que Rukka tiene sobre ti.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Rectificar</strong> datos incorrectos o desactualizados en tu perfil.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Solicitar la eliminación</strong> de tus datos personales.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Oponerte</strong> al tratamiento de tus datos para determinados fines.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Revocar el consentimiento</strong> otorgado para el uso de datos de Google.</span></li>
            </ul>
            <p className="text-sm text-gray-500 mt-3">
              Para ejercer cualquiera de estos derechos, escríbenos a <a href="mailto:hola@rukka.cl" className="text-forest font-semibold hover:underline">hola@rukka.cl</a>.
            </p>
          </section>

          {/* 7 — Contacto */}
          <section id="contacto-privacidad" className="scroll-mt-24">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-forest text-white text-xs font-black flex items-center justify-center flex-shrink-0">7</span>
              Contacto sobre privacidad
            </h3>
            <div className="bg-gray-50 rounded-xl p-5 text-sm space-y-1">
              <p><strong>Responsable:</strong> Rukka</p>
              <p><strong>Dirección:</strong> Santiago, Chile</p>
              <p><strong>Email:</strong> <a href="mailto:hola@rukka.cl" className="text-forest font-semibold hover:underline">hola@rukka.cl</a></p>
              <p className="text-gray-500 text-xs mt-2">Respondemos consultas de privacidad en un plazo de 10 días hábiles.</p>
            </div>
          </section>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN II — TÉRMINOS DE SERVICIO
        ══════════════════════════════════════════════════════════════ */}
        <div id="terminos" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 space-y-8 text-gray-700 scroll-mt-24">

          <div>
            <div className="inline-flex items-center gap-2 bg-terra/8 text-terra rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
              Sección II
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Términos de Servicio</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Al usar Rukka, el usuario acepta estos Términos de Servicio. Si no estás de acuerdo, no debes usar la plataforma.
            </p>
          </div>

          <section>
            <h3 className="text-base font-black text-gray-900 mb-2">1. Descripción del servicio</h3>
            <p className="text-sm leading-relaxed">
              Rukka es una plataforma digital de intercambio de segundas viviendas entre particulares en Chile. Su propósito es facilitar el contacto entre personas que desean intercambiar el uso temporal de sus hogares de veraneo, cabañas, casas de campo u otras propiedades. El servicio es <strong>gratuito</strong> para todos los usuarios durante la etapa actual de operación.
            </p>
          </section>

          <section>
            <h3 className="text-base font-black text-gray-900 mb-2">2. Responsabilidades del usuario</h3>
            <ul className="text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>El usuario es responsable de la <strong>veracidad de la información</strong> publicada sobre sus propiedades.</li>
              <li>Los intercambios son acuerdos directos entre los usuarios. Rukka actúa como intermediario tecnológico, no como arrendador ni agencia de viajes.</li>
              <li>El usuario debe tener el derecho legal de ofrecer la propiedad publicada en la plataforma.</li>
              <li>Solo pueden registrarse personas mayores de 18 años.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-black text-gray-900 mb-2">3. Uso prohibido</h3>
            <ul className="text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Publicar información falsa, engañosa o fraudulenta sobre propiedades o identidad.</li>
              <li>Usar la plataforma para actividades ilegales o no autorizadas.</li>
              <li>Enviar spam, mensajes no solicitados o acosar a otros usuarios.</li>
              <li>Usar Rukka con fines comerciales de arrendamiento (subarrendar con lucro).</li>
              <li>Intentar acceder a cuentas de otros usuarios o a la infraestructura de la plataforma.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-black text-gray-900 mb-2">4. Limitación de responsabilidad</h3>
            <p className="text-sm leading-relaxed">
              Rukka no se hace responsable de daños materiales, robos, lesiones, conflictos ni incumplimientos derivados de los intercambios. Los usuarios asumen la responsabilidad total de sus acuerdos. Rukka puede suspender cuentas que incumplan estos términos sin previo aviso.
            </p>
          </section>

          <section>
            <h3 className="text-base font-black text-gray-900 mb-2">5. Modificaciones y ley aplicable</h3>
            <p className="text-sm leading-relaxed">
              Rukka puede modificar estos términos en cualquier momento publicando la versión actualizada en esta página. El uso continuado implica aceptación. Estos términos se rigen por la <strong>legislación chilena</strong>. Cualquier disputa se resolverá en los tribunales competentes de Santiago, Chile.
            </p>
          </section>

          <section>
            <h3 className="text-base font-black text-gray-900 mb-2">6. Contacto</h3>
            <p className="text-sm leading-relaxed">
              Para consultas sobre estos términos:{' '}
              <a href="mailto:hola@rukka.cl" className="text-forest font-semibold hover:underline">hola@rukka.cl</a>
            </p>
          </section>

        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN III — TRATAMIENTO DE DATOS BIOMÉTRICOS POR PAÍS
        ══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 space-y-10 text-gray-700 mt-8 scroll-mt-24">
          <div>
            <div className="inline-flex items-center gap-2 bg-andean/8 text-andean rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
              Sección III
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Verificación de Identidad por País</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              El proceso de verificación de identidad en Rukka cumple con la legislación de protección de datos vigente en cada país donde opera la plataforma. A continuación se detallan los marcos legales aplicables.
            </p>
          </div>

          {/* Chile */}
          <section id="CL" className="scroll-mt-24 border-t border-gray-100 pt-8">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🇨🇱</span> Chile
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              Para usuarios verificándose con documento chileno, el tratamiento de datos biométricos se rige por la{' '}
              <strong>Ley N° 19.628 sobre Protección de la Vida Privada</strong>.
            </p>
            <ul className="text-sm space-y-2 leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Documento aceptado:</strong> Cédula de Identidad (RUT/RUN), Pasaporte, Licencia de Conducir.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Datos que guardamos:</strong> RUT (en formato hash irreversible), nombre completo, fecha de nacimiento y resultado de la verificación.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Datos que NO guardamos:</strong> imágenes del documento ni de la selfie — la comparación facial ocurre íntegramente en tu dispositivo.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Tus derechos:</strong> acceso, rectificación, cancelación y oposición al tratamiento de tus datos (derechos ARCO). Escríbenos a <a href="mailto:hola@rukka.cl" className="text-forest underline">hola@rukka.cl</a>.</span></li>
            </ul>
          </section>

          {/* Colombia */}
          <section id="CO" className="scroll-mt-24 border-t border-gray-100 pt-8">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🇨🇴</span> Colombia
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              Para usuarios verificándose con documento colombiano, el tratamiento de datos biométricos se rige por la{' '}
              <strong>Ley 1581 de 2012 (Ley de Habeas Data)</strong> y el Decreto 1377 de 2013, supervisados por la Superintendencia de Industria y Comercio (SIC).
            </p>
            <ul className="text-sm space-y-2 leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Documento aceptado:</strong> Cédula de Ciudadanía, Cédula de Extranjería, Pasaporte, Licencia de Conducción.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Datos que guardamos:</strong> número de documento (en formato hash irreversible), nombre completo, fecha de nacimiento y resultado de la verificación.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Datos que NO guardamos:</strong> imágenes del documento ni de la selfie.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Finalidad:</strong> verificar la identidad del usuario para garantizar la confianza dentro de la comunidad Rukka.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Tus derechos (Habeas Data):</strong> conocer, actualizar, rectificar y suprimir tus datos, y revocar la autorización de tratamiento. Escríbenos a <a href="mailto:hola@rukka.cl" className="text-forest underline">hola@rukka.cl</a>.</span></li>
            </ul>
          </section>

          {/* Argentina */}
          <section id="AR" className="scroll-mt-24 border-t border-gray-100 pt-8">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🇦🇷</span> Argentina
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              Para usuarios verificándose con documento argentino, el tratamiento de datos biométricos se rige por la{' '}
              <strong>Ley 25.326 de Protección de Datos Personales (PDPA)</strong>, supervisada por la Agencia de Acceso a la Información Pública (AAIP).
            </p>
            <ul className="text-sm space-y-2 leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Documento aceptado:</strong> DNI (Documento Nacional de Identidad), Pasaporte, Licencia de Conducir.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Datos que guardamos:</strong> número de DNI (en formato hash irreversible), nombre completo, fecha de nacimiento y resultado de la verificación.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Datos que NO guardamos:</strong> imágenes del documento ni de la selfie.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Consentimiento:</strong> el tratamiento de datos biométricos requiere tu consentimiento explícito, que otorgas al marcar la casilla en el paso de verificación.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Tus derechos:</strong> acceso, rectificación, supresión y confidencialidad de tus datos. Escríbenos a <a href="mailto:hola@rukka.cl" className="text-forest underline">hola@rukka.cl</a>.</span></li>
            </ul>
          </section>

          {/* México */}
          <section id="MX" className="scroll-mt-24 border-t border-gray-100 pt-8">
            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">🇲🇽</span> México
            </h3>
            <p className="text-sm leading-relaxed mb-3">
              Para usuarios verificándose con documento mexicano, el tratamiento de datos biométricos se rige por la{' '}
              <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> y su Reglamento, supervisados por el Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI).
            </p>
            <ul className="text-sm space-y-2 leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Documento aceptado:</strong> Credencial para Votar (INE/IFE), Pasaporte, Licencia de Conducir.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Datos que guardamos:</strong> CURP o folio del documento (en formato hash irreversible), nombre completo, fecha de nacimiento y resultado de la verificación.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Datos que NO guardamos:</strong> imágenes del documento ni de la selfie.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Aviso de privacidad:</strong> al aceptar los términos en el paso de verificación, otorgas tu consentimiento expreso para el tratamiento de tus datos biométricos conforme a este aviso.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span><strong>Tus derechos ARCO:</strong> acceso, rectificación, cancelación y oposición al tratamiento de tus datos. Escríbenos a <a href="mailto:hola@rukka.cl" className="text-forest underline">hola@rukka.cl</a> con el asunto "Derechos ARCO".</span></li>
            </ul>
          </section>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECCIÓN IV — USO DE DATOS PARA PUBLICIDAD
        ══════════════════════════════════════════════════════════════ */}
        <div id="publicidad" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 space-y-6 text-gray-700 mt-8 scroll-mt-24">
          <div>
            <div className="inline-flex items-center gap-2 bg-andean/8 text-andean rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
              Sección IV
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Uso de datos para personalización y publicidad</h2>
          </div>

          <p className="text-sm leading-relaxed">
            Rukka utiliza herramientas de medición y publicidad de terceros, incluyendo{' '}
            <strong>Meta Pixel (Facebook/Instagram)</strong> y{' '}
            <strong>Google Analytics/Google Ads</strong>, para medir el rendimiento de nuestras campañas y mostrarte publicidad relevante.
          </p>

          <p className="text-sm leading-relaxed">
            Con tu consentimiento al registrarte, podemos compartir información como tu dirección de correo electrónico, número de teléfono, fecha de nacimiento y país de residencia con estos servicios en{' '}
            <strong>formato hasheado (cifrado SHA-256)</strong>, lo que impide que terceros accedan a tus datos en texto claro.
          </p>

          <div>
            <p className="text-sm font-bold text-gray-800 mb-2">Esta información se utiliza exclusivamente para:</p>
            <ul className="text-sm space-y-2 leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Medir conversiones y optimizar nuestras campañas publicitarias.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Crear audiencias similares para encontrar usuarios con intereses parecidos.</span></li>
              <li className="flex items-start gap-2"><span className="text-forest font-bold mt-0.5">→</span><span>Evitar mostrarte publicidad de Rukka si ya eres usuario activo.</span></li>
            </ul>
          </div>

          <p className="text-sm leading-relaxed">
            Puedes solicitar la eliminación de tus datos en cualquier momento escribiendo a{' '}
            <a href="mailto:privacidad@rukka.cl" className="text-forest font-semibold hover:underline">privacidad@rukka.cl</a>.
            Para más información sobre cómo Meta usa estos datos, consulta la{' '}
            <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-forest underline">Política de datos de Meta</a>.
            Para Google, consulta la{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-forest underline">Política de privacidad de Google</a>.
          </p>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-400">
          <Link href="#privacidad" className="hover:text-forest transition-colors">↑ Política de Privacidad</Link>
          <span className="hidden sm:inline">·</span>
          <Link href="#terminos" className="hover:text-forest transition-colors">↑ Términos de Servicio</Link>
          <span className="hidden sm:inline">·</span>
          <Link href="#CL" className="hover:text-forest transition-colors">↑ Verificación por país</Link>
          <span className="hidden sm:inline">·</span>
          <Link href="#publicidad" className="hover:text-forest transition-colors">↑ Publicidad</Link>
          <span className="hidden sm:inline">·</span>
          <Link href="/" className="hover:text-forest transition-colors">← Volver al inicio</Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
