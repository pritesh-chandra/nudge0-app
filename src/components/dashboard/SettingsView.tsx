'use client'
import { useState } from 'react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { formatUsd, useLocalCurrency } from '@/lib/currency'

const inputClass =
  'w-full rounded-[14px] border border-line bg-white px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 focus:outline-2 focus:outline-sun-deep'

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-line bg-white p-7">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-ink-soft">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function Status({ state }: { state: { ok: boolean; message: string } | null }) {
  if (!state) return null
  return (
    <p
      role="status"
      className={`text-sm font-medium ${state.ok ? 'text-[#4A7C59]' : 'text-[#B3261E]'}`}
    >
      {state.message}
    </p>
  )
}

function Usage({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = Math.min(100, Math.round((used / limit) * 100))
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="text-ink-soft tabular-nums">
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream-deep">
        <div className="h-full rounded-full bg-sun" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export type PlanSummary = {
  name: string
  priceUsdMonthly: number
  eventsLimit: number | null
  signupsPerEvent: number | null
  emailSendsMonthly: number
}

export function SettingsView({
  initialName,
  email,
  plan,
}: {
  initialName: string
  email: string
  plan: PlanSummary
}) {
  const money = useLocalCurrency()

  const [name, setName] = useState(initialName)
  const [profileBusy, setProfileBusy] = useState(false)
  const [profileStatus, setProfileStatus] = useState<{ ok: boolean; message: string } | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordBusy, setPasswordBusy] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState<{ ok: boolean; message: string } | null>(null)

  async function onSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProfileStatus(null)
    setProfileBusy(true)
    const { error } = await authClient.updateUser({ name: name.trim() })
    setProfileBusy(false)
    setProfileStatus(
      error
        ? { ok: false, message: error.message ?? 'Could not save. Please try again.' }
        : { ok: true, message: 'Profile saved.' },
    )
  }

  async function onChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPasswordStatus(null)
    setPasswordBusy(true)
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    })
    setPasswordBusy(false)
    if (error) {
      setPasswordStatus({
        ok: false,
        message: error.message ?? 'Could not change password. Please try again.',
      })
      return
    }
    setCurrentPassword('')
    setNewPassword('')
    setPasswordStatus({ ok: true, message: 'Password changed. Other devices were signed out.' })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Settings</h1>
      <p className="mt-2 text-ink-soft">Your account, plan, and email sending.</p>

      <div className="mt-8 grid gap-6">
        <Section title="Profile" description="How your name appears on your event pages.">
          <form className="grid gap-5" onSubmit={onSaveProfile}>
            <div className="grid gap-2">
              <label htmlFor="settings-name" className="text-sm font-semibold">
                Name
              </label>
              <input
                id="settings-name"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="settings-email" className="text-sm font-semibold">
                Email
              </label>
              <input id="settings-email" className={`${inputClass} opacity-60`} value={email} disabled />
              <p className="text-xs text-ink-soft">
                Email changes need verification and ship later.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={profileBusy}
                className="rounded-full bg-sun px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98] disabled:opacity-60"
              >
                {profileBusy ? 'Saving…' : 'Save profile'}
              </button>
              <Status state={profileStatus} />
            </div>
          </form>
        </Section>

        <Section title="Password" description="Changing your password signs out your other devices.">
          <form className="grid gap-5" onSubmit={onChangePassword}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="settings-current-password" className="text-sm font-semibold">
                  Current password
                </label>
                <input
                  id="settings-current-password"
                  type="password"
                  autoComplete="current-password"
                  className={inputClass}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="settings-new-password" className="text-sm font-semibold">
                  New password
                </label>
                <input
                  id="settings-new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="At least 8 characters"
                  className={inputClass}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={passwordBusy}
                className="rounded-full bg-sun px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98] disabled:opacity-60"
              >
                {passwordBusy ? 'Changing…' : 'Change password'}
              </button>
              <Status state={passwordStatus} />
            </div>
          </form>
        </Section>

        <Section
          title="Plan and usage"
          description={
            plan.priceUsdMonthly > 0
              ? `You're on ${plan.name}, ${formatUsd(plan.priceUsdMonthly, money)} per month, billed with Razorpay.`
              : `You're on the ${plan.name} plan.`
          }
        >
          <div className="grid gap-5">
            <Usage label="Live events" used={0} limit={plan.eventsLimit ?? 999} />
            <Usage
              label="Signups (largest event)"
              used={0}
              limit={plan.signupsPerEvent ?? 999999}
            />
            <Usage
              label="Email sends this month"
              used={0}
              limit={Math.max(plan.emailSendsMonthly, 1)}
            />
            <p className="text-xs text-ink-soft">
              {plan.emailSendsMonthly === 0
                ? `Email updates are pay-as-you-go on this plan, ${formatUsd(2, money)} per 1,000 sends.`
                : `Extra sends cost ${formatUsd(2, money)} per 1,000.`}{' '}
              Usage meters fill in as signups and sending go live.
            </p>
            <div>
              <Link
                href="/#pricing"
                className="inline-block rounded-full border border-ink/20 px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/50"
              >
                Manage plan
              </Link>
            </div>
          </div>
        </Section>

        <Section title="Danger zone" description="Deleting your account removes every event and subscriber list.">
          <button
            type="button"
            disabled
            title="Contact support to delete your account"
            className="cursor-not-allowed rounded-full border border-[#B3261E]/40 px-6 py-2.5 text-sm font-semibold text-[#B3261E] opacity-60"
          >
            Delete account
          </button>
          <p className="mt-3 text-xs text-ink-soft">
            Self-serve deletion ships later. Email hello@nudgeo.app and we'll handle it.
          </p>
        </Section>
      </div>
    </div>
  )
}
