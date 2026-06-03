// Server-side email helpers.
// Only import this file from Route Handlers or Server Components — never from 'use client' modules.
//
// IMPORTANT: Link tracking must be disabled in Resend's dashboard for the rukka.cl domain.
// Resend rewrites URLs for tracking, which corrupts Supabase magic-link / verification URLs.
// Dashboard → Domains → rukka.cl → Settings → Disable link tracking.

import { sendEmail } from './sendEmail'
import Bienvenida from '../emails/bienvenida'
import HogarPublicado from '../emails/hogar-publicado'
import IdentidadVerificada from '../emails/identidad-verificada'

const FEATURED_HOME = {
  titulo: 'Casita privada en el bosque, Puertecillo',
  ciudad: 'Navidad',
}

export async function sendHomeSavedEmail(userEmail, homeName, homeId) {
  if (!userEmail || !process.env.RESEND_API_KEY) {
    console.error('[emails] sendHomeSavedEmail skipped — missing email or RESEND_API_KEY')
    return
  }
  const homeUrl = `https://rukka.cl/homes/${homeId}`
  return sendEmail({
    to: userEmail,
    subject: `¡Tu hogar "${homeName}" ya está en Rukka! 🏠`,
    react: HogarPublicado({
      nombre: 'Anfitrión',
      nombreHogar: homeName,
      urlHogar: homeUrl,
      hogarDestacado: FEATURED_HOME,
    }),
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
    subject: '¡Email confirmado! Comienza tu primera aventura Rukka 🏡',
    react: Bienvenida({ nombre: userName || 'Viajero', email: userEmail }),
    event: 'bienvenida',
    triggeredBy: 'auth',
  })
}

export async function sendIdentidadVerificadaEmail(userEmail, userName) {
  if (!userEmail || !process.env.RESEND_API_KEY) {
    console.error('[emails] sendIdentidadVerificadaEmail skipped — missing email or RESEND_API_KEY')
    return
  }
  return sendEmail({
    to: userEmail,
    subject: '¡Identidad verificada! Ahora publica tu hogar 🏡',
    react: IdentidadVerificada({ nombre: userName || 'Viajero' }),
    event: 'identidad-verificada',
    triggeredBy: 'verificacion',
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
