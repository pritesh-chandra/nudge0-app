'use server'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { sendMail } from '@/lib/mailer'
import { appUrl, publicEventUrl } from '@/lib/urls'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export type JoinResult =
  | { ok: true; count: number; referralId: string; alreadyJoined: boolean }
  | { ok: false; message: string }

async function sendWelcome(opts: {
  to: string
  name: string
  eventName: string
  description: string | null
  creatorName: string
  slug: string
  subscriptionId: string
}) {
  const eventUrl = publicEventUrl(opts.slug)
  const unsubscribeUrl = appUrl(`/u/${opts.subscriptionId}`)
  const first = opts.name.split(' ')[0] || 'there'

  const text = `Hey ${first},

You're on the waitlist for ${opts.eventName}.
${opts.description ? `\n${opts.description}\n` : ''}
We'll email you the moment there's news from ${opts.creatorName}.

View the page: ${eventUrl}

You can unsubscribe anytime: ${unsubscribeUrl}

Powered by nudgeo`

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:480px;margin:0 auto;color:#201d15">
  <p>Hey ${first},</p>
  <p>You're on the waitlist for <strong>${opts.eventName}</strong>.</p>
  ${opts.description ? `<p style="color:#5d5847">${opts.description}</p>` : ''}
  <p>We'll email you the moment there's news from ${opts.creatorName}.</p>
  <p><a href="${eventUrl}" style="display:inline-block;background:#ffd43b;color:#201d15;font-weight:600;text-decoration:none;padding:10px 20px;border-radius:999px">View the page</a></p>
  <p style="color:#5d5847;font-size:13px;margin-top:24px">Not interested anymore? <a href="${unsubscribeUrl}" style="color:#5d5847">Unsubscribe anytime</a>.</p>
  <p style="color:#8a836f;font-size:12px">Powered by nudgeo</p>
</div>`

  await sendMail({ to: opts.to, subject: `You're on the list for ${opts.eventName}`, text, html })
}

export async function joinWaitlist(input: {
  slug: string
  name: string
  email: string
  ref?: string | null
  source?: string | null
  agreedToTerms: boolean
}): Promise<JoinResult> {
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  if (!name) return { ok: false, message: 'Please enter your name.' }
  if (!EMAIL_RE.test(email)) return { ok: false, message: 'Enter a valid email address.' }
  if (!input.agreedToTerms) {
    return { ok: false, message: 'Please accept the Terms and Privacy Policy to continue.' }
  }

  const event = await db
    .selectFrom('events')
    .select(['id', 'status', 'name', 'slug', 'description', 'user_id'])
    .where('slug', '=', input.slug)
    .executeTakeFirst()
  if (!event) return { ok: false, message: 'This event no longer exists.' }
  if (event.status === 'draft') return { ok: false, message: 'This page is not open yet.' }

  const countOf = async () => {
    const row = await db
      .selectFrom('subscriptions')
      .select((eb) => eb.fn.countAll<string>().as('c'))
      .where('event_id', '=', event.id)
      .where('unsubscribed_at', 'is', null)
      .executeTakeFirst()
    return Number(row?.c ?? 0)
  }

  // Already on the list? Return their spot and referral link, no duplicate row.
  const existing = await db
    .selectFrom('subscriptions')
    .select('id')
    .where('event_id', '=', event.id)
    .where('email', '=', email)
    .executeTakeFirst()
  if (existing) {
    return { ok: true, count: await countOf(), referralId: existing.id, alreadyJoined: true }
  }

  // Attribute the referral only if the ref points at a real subscriber of this event
  let referrerId: string | null = null
  if (input.ref) {
    const referrer = await db
      .selectFrom('subscriptions')
      .select('id')
      .where('id', '=', input.ref)
      .where('event_id', '=', event.id)
      .executeTakeFirst()
    referrerId = referrer?.id ?? null
  }

  const id = randomUUID()
  await db
    .insertInto('subscriptions')
    .values({
      id,
      event_id: event.id,
      email,
      name,
      source: input.source?.slice(0, 40) ?? null,
      referrer_id: referrerId,
      verified: false,
      unsubscribed_at: null,
      created_at: new Date().toISOString(),
    })
    .execute()

  // Welcome email with event details + one-click unsubscribe (best-effort)
  const creator = await db
    .selectFrom('user')
    .select('name')
    .where('id', '=', event.user_id)
    .executeTakeFirst()
  await sendWelcome({
    to: email,
    name,
    eventName: event.name,
    description: event.description,
    creatorName: creator?.name ?? 'the creator',
    slug: event.slug,
    subscriptionId: id,
  })

  return { ok: true, count: await countOf(), referralId: id, alreadyJoined: false }
}
