'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient, signIn } from '@/lib/auth-client'
import { AuthLayout, Field, SubmitButton } from './AuthLayout'

const QUOTE = {
  text: 'We collected 4,200 signups before our Kickstarter went live. Day one, we were funded in six hours.',
  name: 'Priya Raghavan',
  role: 'Founder, Loomcraft Games',
  img: 'https://i.pravatar.cc/88?img=25',
}

export function SignInForm() {
  const router = useRouter()
  const justVerified = useSearchParams().get('verified') === '1'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email'))
    setError(null)
    setLoading(true)
    const { error } = await signIn.email({
      email,
      password: String(form.get('password')),
    })
    setLoading(false)
    if (error) {
      // Unverified accounts get bounced to OTP verification with a fresh code
      if (error.status === 403) {
        await authClient.emailOtp.sendVerificationOtp({ email, type: 'email-verification' })
        router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
        return
      }
      setError(error.message ?? 'Something went wrong. Please try again.')
      return
    }
    router.push('/dashboard')
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account" quote={QUOTE}>
      {justVerified && (
        <p role="status" className="mb-5 rounded-xl bg-sun/15 px-4 py-3 text-sm font-medium text-sun">
          Email verified. Sign in to get started.
        </p>
      )}
      <form className="grid gap-5" onSubmit={onSubmit}>
        <Field
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <Field
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          required
        />
        {error && (
          <p role="alert" className="text-sm font-medium text-[#F8B4AD]">
            {error}
          </p>
        )}
        <SubmitButton loading={loading}>{loading ? 'Signing in…' : 'Sign in'}</SubmitButton>
      </form>
      <p className="mt-8 text-center text-sm text-cream/60">
        Don't have an account?{' '}
        <Link
          href="/auth/sign-up"
          className="font-medium text-cream underline underline-offset-4 hover:text-sun"
        >
          Sign up now
        </Link>
      </p>
    </AuthLayout>
  )
}
