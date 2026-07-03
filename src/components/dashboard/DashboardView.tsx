'use client'
import Link from 'next/link'
import { CalendarPlus } from '@phosphor-icons/react'
import { signOut } from '@/lib/auth-client'

export function DashboardView({ name, email }: { name: string; email: string }) {
  const firstName = name?.split(' ')[0] || 'there'

  async function onSignOut() {
    await signOut()
    // Hard redirect so the server-side guards re-evaluate against the cleared session
    window.location.assign('/')
  }

  return (
    <div className="min-h-[100dvh]">
      <header className="border-b border-line bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-sun text-lg font-extrabold text-ink">
              n
            </span>
            <span className="text-xl font-bold tracking-tight">nudgeo</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink-soft sm:block">{email}</span>
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-full border border-ink/20 px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink/50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Hey {firstName}.</h1>
        <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
          This is where your events will live, each with its signups, Hype Score, and email
          updates.
        </p>

        <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-line bg-white px-6 py-20 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-sun-soft text-sun-deep">
            <CalendarPlus size={28} weight="bold" />
          </span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight">No events yet</h2>
          <p className="mt-2 max-w-[40ch] leading-relaxed text-ink-soft">
            Your first event is free, with up to 100 signups. The event builder ships next.
          </p>
          <button
            type="button"
            disabled
            className="mt-7 cursor-not-allowed rounded-full bg-sun px-7 py-3.5 text-base font-semibold text-ink opacity-60"
          >
            Create your first event
          </button>
        </div>
      </main>
    </div>
  )
}
