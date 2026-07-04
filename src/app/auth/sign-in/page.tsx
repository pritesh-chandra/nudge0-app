import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { SignInForm } from '@/components/auth/SignInForm'

export const metadata = { title: 'Sign in · nudgeo' }

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect('/dashboard')

  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}
