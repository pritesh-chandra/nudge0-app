import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getUserPlan } from '@/lib/billing'
import { db } from '@/lib/db'
import { EmailTemplatesView } from '@/components/dashboard/EmailTemplatesView'

export const metadata = { title: 'Email templates · nudgeo' }

export default async function EmailTemplatesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/sign-in')

  const plan = await getUserPlan(session.user.id)
  const isPro = plan.key !== 'free'

  const events = await db
    .selectFrom('events')
    .select(['id', 'name', 'slug', 'status'])
    .where('user_id', '=', session.user.id)
    .orderBy('created_at', 'desc')
    .execute()

  const ids = events.map((e) => e.id)
  const saved =
    ids.length > 0
      ? await db
          .selectFrom('email_templates')
          .select(['event_id', 'template_key', 'subject', 'body'])
          .where('event_id', 'in', ids)
          .execute()
      : []

  return (
    <EmailTemplatesView
      creatorName={session.user.name}
      isPro={isPro}
      events={events}
      saved={saved}
    />
  )
}
