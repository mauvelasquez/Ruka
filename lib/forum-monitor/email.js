import { sendEmail } from '../sendEmail'

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleString("es-CL", {
      timeZone: "America/Santiago",
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  } catch {
    return dateStr
  }
}

export async function sendAlertEmail(posts) {
  if (posts.length === 0) return

  const scanTime = new Date().toLocaleString("es-CL", {
    timeZone: "America/Santiago",
  })

  const postRows = posts.map(p => `
    <div style="margin-bottom:24px;border-left:3px solid #2D6A4F;padding-left:16px">
      <p style="margin:0;font-size:12px;color:#888">${p.source} · ${formatDate(p.date)}</p>
      <a href="${p.url}" style="font-weight:bold;color:#2D6A4F;text-decoration:none;font-size:15px">
        ${p.title}
      </a>
      ${p.snippet ? `<p style="color:#444;margin:6px 0 4px">${p.snippet}…</p>` : ""}
      <a href="${p.url}" style="font-size:13px;color:#2D6A4F">Ver conversación →</a>
    </div>
  `).join("")

  const html = `
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto">
      <h2 style="color:#2D6A4F">
        Rukka Monitor — ${posts.length} conversación${posts.length > 1 ? "es" : ""} relevante${posts.length > 1 ? "s" : ""}
      </h2>
      <p style="color:#666;margin-top:-8px">Scan: ${scanTime}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
      ${postRows}
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p style="font-size:12px;color:#aaa">
        Rukka.cl · Monitor de comunidades de viaje
      </p>
    </div>
  `

  const result = await sendEmail({
    from: "Rukka Monitor <monitor@rukka.cl>",
    to: process.env.ALERT_EMAIL,
    subject: `[Rukka] ${posts.length} conversación${posts.length > 1 ? "es" : ""} sobre intercambio de hogares`,
    html,
    event: 'monitor-alert',
    triggeredBy: 'cron',
  })

  if (result.error) {
    throw new Error(`Resend: ${result.error.message ?? JSON.stringify(result.error)}`)
  }

  return result.data
}
