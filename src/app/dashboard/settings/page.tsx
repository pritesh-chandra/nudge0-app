import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getUserPlan } from '@/lib/billing'
import { SettingsView } from '@/components/dashboard/SettingsView'

export const metadata = { title: 'Settings · nudgeo' }

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/sign-in')

  const plan = await getUserPlan(session.user.id)

  return (
    <SettingsView
      initialName={session.user.name}
      email={session.user.email}
      plan={{
        name: plan.name,
        priceUsdMonthly: Number(plan.price_usd_monthly),
        eventsLimit: plan.events_limit,
        signupsPerEvent: plan.signups_per_event,
        emailSendsMonthly: plan.email_sends_monthly,
      }}
    />
  )
}
