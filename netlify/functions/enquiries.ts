/**
 * Receives guest and trade enquiries from the site and emails them on.
 *
 * Every enquiry here is worth four or five figures, so the failure behaviour
 * matters more than the happy path: this never returns 200 unless the email
 * provider has actually accepted the message. A silent success that loses a
 * lead is worse than an error the guest can see and act on.
 *
 * Required environment variables (Netlify → Site settings → Environment):
 *   RESEND_API_KEY  — from resend.com, free tier covers early volume
 *   ENQUIRY_TO      — where enquiries land, e.g. jacob@fairwaytour.co.nz
 *   ENQUIRY_FROM    — a verified sender on your domain
 */

type Payload = Record<string, unknown> & { kind?: string }

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

/** Renders whatever shape the form sent, so adding a field needs no change here. */
function renderRows(payload: Payload): string {
  return Object.entries(payload)
    .filter(([, v]) => v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => {
      const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, (m) => m.toUpperCase())
      const value = Array.isArray(v) ? v.join(', ') : String(v)
      return `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;white-space:nowrap">${escapeHtml(
        label,
      )}</td><td style="padding:6px 0;color:#111827">${escapeHtml(value)}</td></tr>`
    })
    .join('')
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.ENQUIRY_TO
  const from = process.env.ENQUIRY_FROM

  if (!apiKey || !to || !from) {
    // Loud on purpose. An unconfigured site must not appear to accept enquiries.
    console.error('enquiries: missing RESEND_API_KEY, ENQUIRY_TO or ENQUIRY_FROM')
    return new Response(JSON.stringify({ error: 'Enquiries are not configured yet.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let payload: Payload
  try {
    payload = (await request.json()) as Payload
  } catch {
    return new Response(JSON.stringify({ error: 'Malformed request.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const isTrade = payload.kind === 'trade'
  const who = String(payload.name ?? payload.agency ?? 'Someone')
  const subject = isTrade ? `Trade enquiry — ${who}` : `Enquiry — ${who}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: typeof payload.email === 'string' ? payload.email : undefined,
      subject,
      html: `<h2 style="font-family:Georgia,serif;font-weight:400">${escapeHtml(subject)}</h2>
<table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">${renderRows(
        payload,
      )}</table>`,
    }),
  })

  if (!res.ok) {
    const detail = await res.text()
    console.error('enquiries: provider rejected the message', res.status, detail)
    return new Response(JSON.stringify({ error: 'Could not send. Please email us directly.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
