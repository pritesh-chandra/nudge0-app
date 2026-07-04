'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth-client'
import { AuthLayout, Field, SubmitButton } from './AuthLayout'

const QUOTE = {
  text: 'The analytics showed my TikTok bio link converting three times better than Instagram. I moved my budget the same day.',
  name: 'Elsa Marchetti',
  role: 'Author, Brine & Ember cookbook',
  img: 'https://i.pravatar.cc/88?img=44',
}

export function SignUpForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email'))
    setError(null)
    setLoading(true)
    const { error } = await signUp.email({
      name: String(form.get('name')),
      email,
      password: String(form.get('password')),
    })
    setLoading(false)
    if (error) {
      setError(error.message ?? 'Something went wrong. Please try again.')
      return
    }
    // Signup emails a 6-digit OTP; the account works once it's confirmed
    router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
  }

  return (
    <AuthLayout title="Get started" subtitle="Create a new account" quote={QUOTE}>
      <form className="grid gap-5" onSubmit={onSubmit}>
        <Field
          id="name"
          name="name"
          label="Name"
          type="text"
          placeholder="Mara Quinn"
          autoComplete="name"
          required
        />
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          required
        />
        {error && (
          <p role="alert" className="text-sm font-medium text-[#F8B4AD]">
            {error}
          </p>
        )}
        <SubmitButton loading={loading}>
          {loading ? 'Creating your account…' : 'Sign up'}
        </SubmitButton>
      </form>
      <p className="mt-8 text-center text-sm text-cream/60">
        Have an account?{' '}
        <Link
          href="/auth/sign-in"
          className="font-medium text-cream underline underline-offset-4 hover:text-sun"
        >
          Sign in now
        </Link>
      </p>
    </AuthLayout>
  )
}
