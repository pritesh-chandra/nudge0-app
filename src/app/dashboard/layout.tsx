import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getUserPlan } from '@/lib/billing'
import { getUsage } from '@/lib/stats'
import { Shell } from '@/components/dashboard/Shell'

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/sign-in')

  const [plan, usage] = await Promise.all([
    getUserPlan(session.user.id),
    getUsage(session.user.id),
  ])

  return (
    <Shell
      user={{ name: session.user.name, email: session.user.email }}
      quota={{
        planKey: plan.key,
        planName: plan.name,
        eventsUsed: usage.events,
        eventsLimit: plan.events_limit,
        emailsUsed: usage.emailSends,
        emailsLimit: plan.email_sends_monthly,
      }}
    >
      {children}
    </Shell>
  )
}
