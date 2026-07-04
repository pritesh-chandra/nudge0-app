'use server'
import { randomUUID } from 'node:crypto'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getUserPlan } from '@/lib/billing'
import { db } from '@/lib/db'

export type SaveTemplateResult = { ok: true } | { ok: false; message: string }

export async function saveTemplate(input: {
  eventId: string
  templateKey: string
  subject: string
  body: string
}): Promise<SaveTemplateResult> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { ok: false, message: 'Your session expired. Please sign in again.' }

  // Email templates are a Pro feature
  const plan = await getUserPlan(session.user.id)
  if (plan.key === 'free') {
    return { ok: false, message: 'Custom email templates are a Pro feature.' }
  }

  // The event must belong to the signed-in creator
  const event = await db
    .selectFrom('events')
    .select('id')
    .where('id', '=', input.eventId)
    .where('user_id', '=', session.user.id)
    .executeTakeFirst()
  if (!event) return { ok: false, message: 'Event not found.' }

  const subject = input.subject.trim().slice(0, 200)
  const body = input.body.trim().slice(0, 5000)
  if (!subject || !body) return { ok: false, message: 'Subject and body are required.' }

  const now = new Date().toISOString()
  const existing = await db
    .selectFrom('email_templates')
    .select('id')
    .where('event_id', '=', input.eventId)
    .where('template_key', '=', input.templateKey)
    .executeTakeFirst()

  if (existing) {
    await db
      .updateTable('email_templates')
      .set({ subject, body, updated_at: now })
      .where('id', '=', existing.id)
      .execute()
  } else {
    await db
      .insertInto('email_templates')
      .values({
        id: randomUUID(),
        event_id: input.eventId,
        template_key: input.templateKey,
        subject,
        body,
        updated_at: now,
      })
      .execute()
  }

  return { ok: true }
}
