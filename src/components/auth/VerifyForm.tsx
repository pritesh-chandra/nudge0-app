'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { AuthLayout, SubmitButton } from './AuthLayout'

const QUOTE = {
  text: 'We collected 4,200 signups before our Kickstarter went live. Day one, we were funded in six hours.',
  name: 'Priya Raghavan',
  role: 'Founder, Loomcraft Games',
  img: 'https://i.pravatar.cc/88?img=25',
}

const RESEND_COOLDOWN = 30

export function VerifyForm() {
  const router = useRouter()
  const email = useSearchParams().get('email') ?? ''
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(() => setCooldown((c) => c - 1), 1000)
    return () => clearInterval(id)
  }, [cooldown])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await authClient.emailOtp.verifyEmail({ email, otp })
    setLoading(false)
    if (error) {
      setError(error.message ?? 'That code did not work. Please try again.')
      return
    }
    // Verified. If the plugin opened a session, go straight in; otherwise sign in.
    const session = await authClient.getSession()
    router.push(session.data ? '/dashboard' : '/auth/sign-in?verified=1')
  }

  async function onResend() {
    setError(null)
    setNotice(null)
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'email-verification',
    })
    if (error) {
      setError(error.message ?? 'Could not resend the code. Please try again.')
      return
    }
    setNotice(`We sent a new code to ${email}.`)
    setCooldown(RESEND_COOLDOWN)
  }

  return (
    <AuthLayout
      title="Check your inbox"
      subtitle={`We emailed a 6-digit code to ${email || 'your address'}`}
      quote={QUOTE}
    >
      <form className="grid gap-5" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <label htmlFor="otp" className="text-sm text-cream/80">
            Verification code
          </label>
          <input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
            className="w-full rounded-xl border border-cream/15 bg-white/5 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-cream placeholder:text-cream/25 focus:outline-2 focus:outline-sun"
          />
        </div>
        {error && (
          <p role="alert" className="text-sm font-medium text-[#F8B4AD]">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="text-sm font-medium text-sun">
            {notice}
          </p>
        )}
        <SubmitButton loading={loading}>
          {loading ? 'Verifying…' : 'Verify email'}
        </SubmitButton>
      </form>
      <p className="mt-8 text-center text-sm text-cream/60">
        Didn't get it?{' '}
        {cooldown > 0 ? (
          <span>Resend in {cooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            className="font-medium text-cream underline underline-offset-4 hover:text-sun"
          >
            Resend code
          </button>
        )}
      </p>
    </AuthLayout>
  )
}
