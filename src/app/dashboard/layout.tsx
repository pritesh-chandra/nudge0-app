import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Shell } from '@/components/dashboard/Shell'

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/sign-in')

  return (
    <Shell user={{ name: session.user.name, email: session.user.email }}>{children}</Shell>
  )
}
