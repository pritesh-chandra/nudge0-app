// Server-only mail sender.
// With RESEND_API_KEY set, mail goes out via Resend; otherwise it is logged to
// the server console so the flow stays fully testable in development.
export async function sendMail({
  to,
  subject,
  text,
}: {
  to: string
  subject: string
  text: string
}) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log(`\n[mail:dev] To: ${to}\n[mail:dev] Subject: ${subject}\n${text}\n`)
    return
  }

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
    }),
  })

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`)
  }
}
