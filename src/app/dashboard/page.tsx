import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getHomeSummary } from '@/lib/stats'
import { HomeView } from '@/components/dashboard/HomeView'

export const metadata = { title: 'Home · nudgeo' }

export default async function DashboardHomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/sign-in')

  const summary = await getHomeSummary(session.user.id)
  const firstName = session.user.name?.split(' ')[0] || 'there'

  return <HomeView firstName={firstName} summary={summary} />
}
