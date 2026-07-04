import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getUserPlan } from '@/lib/billing'
import { db } from '@/lib/db'
import { CreateEventView } from '@/components/dashboard/CreateEventView'

export const metadata = { title: 'Create event · nudgeo' }

export default async function CreateEventPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/sign-in')

  const plan = await getUserPlan(session.user.id)

  let atLimit = false
  if (plan.events_limit !== null) {
    const countRow = await db
      .selectFrom('events')
      .select((eb) => eb.fn.countAll<string>().as('c'))
      .where('user_id', '=', session.user.id)
      .executeTakeFirst()
    atLimit = Number(countRow?.c ?? 0) >= plan.events_limit
  }

  return (
    <CreateEventView
      creatorName={session.user.name}
      plan={plan.key}
      limit={{ atLimit, planName: plan.name, eventsLimit: plan.events_limit }}
    />
  )
}
