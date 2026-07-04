import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { HomeView, type HomeEvent } from '@/components/dashboard/HomeView'

export const metadata = { title: 'Home · nudgeo' }

export default async function DashboardHomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/sign-in')

  const rows = await db
    .selectFrom('events')
    .leftJoin('subscriptions', 'subscriptions.event_id', 'events.id')
    .select(({ fn }) => [
      'events.id',
      'events.name',
      'events.slug',
      'events.category',
      'events.status',
      'events.created_at',
      fn.count<number>('subscriptions.id').as('signups'),
    ])
    .where('events.user_id', '=', session.user.id)
    .groupBy([
      'events.id',
      'events.name',
      'events.slug',
      'events.category',
      'events.status',
      'events.created_at',
    ])
    .orderBy('events.created_at', 'desc')
    .execute()

  const events: HomeEvent[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    category: r.category,
    status: r.status,
    signups: Number(r.signups),
  }))

  const firstName = session.user.name?.split(' ')[0] || 'there'
  return <HomeView firstName={firstName} events={events} />
}
