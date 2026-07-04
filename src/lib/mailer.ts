// Server-only mail sender.
// With RESEND_API_KEY set, mail goes out via Resend; otherwise it is logged to
// the server console so the flow stays fully testable in development.
//
// IMPORTANT: this function never throws. Email delivery is best-effort — a
// provider failure (e.g. Resend rejecting an unverified `from` domain) must not
// crash the auth flow that triggered it. Callers get a boolean and we log.
export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string
  subject: string
  text: string
  html?: string
}): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log(`\n[mail:dev] To: ${to}\n[mail:dev] Subject: ${subject}\n${text}\n`)
    return { ok: true }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM ?? 'nudgeo <onboarding@resend.dev>',
        to,
        subject,
        text,
        ...(html ? { html } : {}),
      }),
    })

    if (!res.ok) {
      // Log and swallow: never let a mail failure 500 the request.
      console.error(`[mail] Resend ${res.status} for ${to}: ${await res.text()}`)
      return { ok: false }
    }
    return { ok: true }
  } catch (err) {
    console.error(`[mail] send failed for ${to}:`, err)
    return { ok: false }
  }
}
