import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { EmailTemplatesView } from '@/components/dashboard/EmailTemplatesView'

export const metadata = { title: 'Email templates · nudgeo' }

export default async function EmailTemplatesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/auth/sign-in')

  return <EmailTemplatesView creatorName={session.user.name} />
}
