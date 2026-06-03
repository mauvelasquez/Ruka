export async function sendMetaEvent({ event_name, email, value, currency }) {
  try {
    await fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name,
        event_id: crypto.randomUUID(),
        email,
        url: window.location.href,
        user_agent: navigator.userAgent,
        value,
        currency,
      }),
    })
  } catch (e) {
    console.error('Meta CAPI error:', e)
  }
}
