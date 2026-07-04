'use client'
import Link from 'next/link'
import { ArrowRight, CalendarPlus, Plus } from '@phosphor-icons/react'
import type { HomeEventRow, RecentSignup } from '@/lib/stats'
import { publicEventHost } from '@/lib/urls'
import { StatCard } from './StatCard'

type Summary = {
  events: HomeEventRow[]
  totalSignups: number
  weekSignups: number
  referred: number
  liveEvents: number
  hype: number
  recent: RecentSignup[]
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

function StatusPill({ status }: { status: string }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  const styles =
    status === 'live'
      ? 'bg-sun text-ink'
      : status === 'draft'
        ? 'border border-line text-ink-soft'
        : 'bg-cream-deep text-ink-soft'
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles}`}>{label}</span>
}

export function HomeView({ firstName, summary }: { firstName: string; summary: Summary }) {
  const referralShare =
    summary.totalSignups > 0
      ? `${Math.round((summary.referred / summary.totalSignups) * 100)}%`
      : '0%'

  const stats = [
    {
      label: 'Total signups',
      value: summary.totalSignups.toLocaleString(),
      hint: `+${summary.weekSignups.toLocaleString()} this week`,
    },
    { label: 'Hype Score', value: String(summary.hype), hint: 'across your events' },
    { label: 'Referred signups', value: referralShare, hint: `${summary.referred} via friends` },
    {
      label: 'Live events',
      value: String(summary.liveEvents),
      hint: `${summary.events.length} total`,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Hey {firstName}.</h1>
      <p className="mt-2 text-ink-soft">Here's how your launches are doing today.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Your events</h2>
            <Link
              href="/dashboard/events/new"
              className="flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
            >
              <Plus size={14} weight="bold" />
              New event
            </Link>
          </div>

          {summary.events.length === 0 ? (
            <div className="mt-4 grid place-items-center rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-sun-soft text-sun-deep">
                <CalendarPlus size={28} weight="bold" />
              </span>
              <h3 className="mt-5 text-xl font-bold tracking-tight">No events yet</h3>
              <p className="mt-2 max-w-[40ch] leading-relaxed text-ink-soft">
                Your first event is free, with up to 100 signups.
              </p>
              <Link
                href="/dashboard/events/new"
                className="mt-6 rounded-full bg-sun px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98]"
              >
                Create your first event
              </Link>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-3xl border border-line bg-white">
              {summary.events.map((event, i) => (
                <Link
                  key={event.id}
                  href="/dashboard/analytics"
                  className={`flex items-center gap-4 px-6 py-5 transition-colors hover:bg-cream ${
                    i > 0 ? 'border-t border-line' : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{event.name}</p>
                    <p className="mt-0.5 truncate text-sm text-ink-soft">
                      {event.category ? `${event.category} · ` : ''}
                      {publicEventHost(event.slug)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold tabular-nums">{event.signups.toLocaleString()}</p>
                    <p className="text-xs text-ink-soft">signups</p>
                  </div>
                  <StatusPill status={event.status} />
                  <ArrowRight size={16} weight="bold" className="text-ink-soft" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-tight">Recent signups</h2>
          <div className="mt-4 rounded-3xl border border-line bg-white p-6">
            {summary.recent.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-soft">
                No signups yet. Share an event link to get the first one.
              </p>
            ) : (
              summary.recent.map((s, i) => (
                <div
                  key={`${s.name}-${i}`}
                  className={`flex items-center gap-3 py-3 ${i > 0 ? 'border-t border-line' : 'pt-0'}`}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sun-soft text-sm font-bold text-ink">
                    {s.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-sm font-semibold">{s.name}</p>
                    <p className="truncate text-xs text-ink-soft">{s.event}</p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-soft">{relativeTime(s.at)}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
