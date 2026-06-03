// Server-side email helpers.
// Only import this file from Route Handlers or Server Components — never from 'use client' modules.
//
// IMPORTANT: Link tracking must be disabled in Resend's dashboard for the rukka.cl domain.
// Resend rewrites URLs for tracking, which corrupts Supabase magic-link / verification URLs.
// Dashboard → Domains → rukka.cl → Settings → Disable link tracking.

import { sendEmail } from './sendEmail'

export async function sendHomeSavedEmail(userEmail, homeName, homeId) {
  if (!userEmail || !process.env.RESEND_API_KEY) {
    console.error('[emails] sendHomeSavedEmail skipped — missing email or RESEND_API_KEY')
    return
  }
  const homeUrl = `https://rukka.cl/homes/${homeId}`
  return sendEmail({
    to: userEmail,
    subject: `¡Tu hogar "${homeName}" ya está en Rukka! 🏠`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px">
        <div style="text-align:center;margin-bottom:24px">
          <h1 style="color:#2D5016;font-size:26px;margin:0">¡Tu hogar ya está publicado! 🏡</h1>
        </div>
        <p style="color:#333;font-size:16px;line-height:1.6;margin:0 0 16px">
          <strong>${homeName}</strong> ya es visible para toda la comunidad Rukka. Los demás miembros pueden enviarte solicitudes de intercambio.
        </p>
        <div style="background:#F5F0E8;border-radius:10px;padding:20px;margin:24px 0">
          <p style="color:#2D5016;font-weight:bold;margin:0 0 10px">¿Qué sigue?</p>
          <p style="color:#333;margin:0 0 8px;line-height:1.5">🌍 Otros miembros de Rukka pueden ver tu hogar y enviarte solicitudes de intercambio.</p>
          <p style="color:#333;margin:0;line-height:1.5">✅ Cuando aceptas una solicitud, el viajero usa sus Yankis y tú acumulas los tuyos para viajar.</p>
        </div>
        <div style="text-align:center;margin:24px 0">
          <a href="${homeUrl}" style="display:inline-block;background:#2D5016;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px">
            Ver mi hogar publicado →
          </a>
        </div>
        <div style="text-align:center;margin-top:8px">
          <a href="https://rukka.cl/homes" style="display:inline-block;border:2px solid #2D5016;color:#2D5016;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px">
            Explorar hogares para intercambiar
          </a>
        </div>
        <p style="color:#999;font-size:12px;margin-top:32px;text-align:center">
          El equipo de Rukka · <a href="https://rukka.cl" style="color:#2D5016">rukka.cl</a>
        </p>
      </div>
    `,
    event: 'hogar-guardado',
    triggeredBy: 'dashboard',
  })
}

export async function sendVerificationSuccessEmail(userEmail, userName) {
  if (!userEmail || !process.env.RESEND_API_KEY) {
    console.error('[emails] sendVerificationSuccessEmail skipped — missing email or RESEND_API_KEY')
    return
  }
  return sendEmail({
    to: userEmail,
    subject: '¡Tu cuenta Rukka está confirmada! ✅',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px">
        <div style="text-align:center;margin-bottom:24px">
          <h1 style="color:#2D5016;font-size:26px;margin:0">¡Bienvenido a Rukka, ${userName}! 🎉</h1>
        </div>
        <p style="color:#333;font-size:16px;line-height:1.6;margin:0 0 16px">
          Tu cuenta ha sido confirmada exitosamente. Ya eres parte de la comunidad latinoamericana de intercambio de hogares.
        </p>
        <div style="background:#F5F0E8;border-radius:10px;padding:20px;margin:24px 0">
          <p style="color:#2D5016;font-weight:bold;margin:0 0 12px">¿Por dónde empezar?</p>
          <p style="color:#333;margin:0 0 8px;line-height:1.5">🏠 <strong>Publica tu hogar</strong> — Cuéntanos sobre tu espacio.</p>
          <p style="color:#333;margin:0 0 8px;line-height:1.5">🌍 <strong>Busca tu destino</strong> — Hogares en Chile, México, Colombia y Argentina.</p>
          <p style="color:#333;margin:0;line-height:1.5">⚡ <strong>Haz match</strong> — Envía tu solicitud y empieza a planear.</p>
        </div>
        <div style="text-align:center;margin:24px 0">
          <a href="https://rukka.cl/dashboard" style="display:inline-block;background:#2D5016;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px">
            Ir a mi panel →
          </a>
        </div>
        <p style="color:#999;font-size:12px;margin-top:32px;text-align:center">
          El equipo de Rukka · <a href="https://rukka.cl" style="color:#2D5016">rukka.cl</a>
        </p>
      </div>
    `,
    event: 'verificacion-exitosa',
    triggeredBy: 'auth',
  })
}

export async function sendPartialVerificationEmail(userEmail, userName) {
  if (!userEmail || !process.env.RESEND_API_KEY) return
  return sendEmail({
    to: userEmail,
    subject: 'Tu identidad fue verificada parcialmente en Rukka',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px">
        <div style="text-align:center;margin-bottom:24px">
          <div style="width:56px;height:56px;background:#FEF3C7;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px">🛡️</div>
        </div>
        <h1 style="color:#1a1a1a;font-size:22px;margin:0 0 16px">Hola${userName ? `, ${userName}` : ''}</h1>
        <p style="color:#333;font-size:16px;line-height:1.6;margin:0 0 20px">
          Hemos verificado tus datos de documento exitosamente. Tu cuenta está activa en Rukka.
        </p>
        <div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:10px;padding:20px;margin:0 0 24px">
          <p style="color:#92400E;font-weight:bold;margin:0 0 10px">Información importante</p>
          <p style="color:#78350F;font-size:15px;line-height:1.5;margin:0">
            Es posible que te solicitemos documentación complementaria por este medio para completar tu verificación de identidad.
            Si eso ocurre, te enviaremos las instrucciones correspondientes.
          </p>
        </div>
        <div style="text-align:center;margin:24px 0">
          <a href="https://rukka.cl/dashboard" style="display:inline-block;background:#2D5016;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px">
            Ir a mi panel →
          </a>
        </div>
        <p style="color:#999;font-size:12px;margin-top:32px;text-align:center">
          El equipo de Rukka · <a href="https://rukka.cl" style="color:#2D5016">rukka.cl</a>
        </p>
      </div>
    `,
    event: 'verificacion-parcial',
    triggeredBy: 'auth',
  })
}
