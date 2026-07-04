import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getEventsAnalytics } from '@/lib/analytics'
import { AnalyticsView } from '@/components/dashboard/AnalyticsView'

export const metadata = { title: 'Analytics · nudgeo' }

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/sign-in')

  const events = await getEventsAnalytics(session.user.id)
  return <AnalyticsView events={events} />
}
