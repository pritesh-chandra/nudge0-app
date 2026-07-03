import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardView } from '@/components/dashboard/DashboardView'

export const metadata = { title: 'Dashboard · nudgeo' }

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/sign-in')

  return <DashboardView name={session.user.name} email={session.user.email} />
}
