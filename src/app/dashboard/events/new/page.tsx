import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getUserPlan } from '@/lib/billing'
import { CreateEventView } from '@/components/dashboard/CreateEventView'

export const metadata = { title: 'Create event · nudgeo' }

export default async function CreateEventPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/sign-in')

  const plan = await getUserPlan(session.user.id)

  return <CreateEventView creatorName={session.user.name} plan={plan.key} />
}
