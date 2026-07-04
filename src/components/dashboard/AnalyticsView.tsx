'use client'
import { useState } from 'react'
import { CalendarPlus } from '@phosphor-icons/react'
import Link from 'next/link'
import type { EventAnalytics } from '@/lib/analytics'
import { StatCard } from './StatCard'

function SignupChart({ series }: { series: number[] }) {
  const w = 720
  const h = 260
  const pad = 18
  const max = Math.max(1, ...series)
  const stepX = (w - pad * 2) / (series.length - 1)
  const coords = series.map(
    (v, i) => [pad + i * stepX, h - pad - (v / max) * (h - pad * 2)] as const,
  )
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const area = `${line} L${coords[coords.length - 1][0]},${h - pad} L${pad},${h - pad} Z`

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="Daily signups over the last 30 days"
      className="mt-4 w-full"
    >
      <path d={area} fill="#FFD43B" opacity="0.25" />
      <path d={line} fill="none" stroke="#F0B90B" strokeWidth="3.5" strokeLinecap="round" />
      <circle
        cx={coords[coords.length - 1][0]}
        cy={coords[coords.length - 1][1]}
        r="6"
        fill="#201D15"
        stroke="#FFD43B"
        strokeWidth="3"
      />
    </svg>
  )
}

export function AnalyticsView({ events }: { events: EventAnalytics[] }) {
  const [key, setKey] = useState<string>(events[0]?.key ?? '')
  const data = events.find((e) => e.key === key) ?? events[0]

  if (!data) {
    return (
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Analytics</h1>
        <p className="mt-2 text-ink-soft">What's moving your Hype Score, per event.</p>
        <div className="mt-8 grid place-items-center rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-sun-soft text-sun-deep">
            <CalendarPlus size={28} weight="bold" />
          </span>
          <h2 className="mt-5 text-xl font-bold tracking-tight">No events yet</h2>
          <p className="mt-2 max-w-[40ch] leading-relaxed text-ink-soft">
            Analytics show up here once you have an event collecting signups.
          </p>
          <Link
            href="/dashboard/events/new"
            className="mt-6 rounded-full bg-sun px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98]"
          >
            Create an event
          </Link>
        </div>
      </div>
    )
  }

  const conversion =
    data.totalSignups > 0
      ? `${Math.round((data.verifiedSignups / data.totalSignups) * 100)}%`
      : '0%'

  const stats = [
    { label: 'Signups', value: data.totalSignups.toLocaleString(), hint: `+${data.weekSignups} this week` },
    { label: 'Hype Score', value: String(data.hype), hint: 'live number' },
    { label: 'Referred', value: data.referredSignups.toLocaleString(), hint: 'via friends' },
    { label: 'Confirmed email', value: conversion, hint: 'verified signups' },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Analytics</h1>
          <p className="mt-2 text-ink-soft">What's moving your Hype Score, per event.</p>
        </div>
        <div>
          <label htmlFor="event-select" className="sr-only">
            Event
          </label>
          <select
            id="event-select"
            value={data.key}
            onChange={(e) => setKey(e.target.value)}
            className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink focus:outline-2 focus:outline-sun-deep"
          >
            {events.map((e) => (
              <option key={e.key} value={e.key}>
                {e.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-line bg-white p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold tracking-tight">Daily signups</h2>
          <p className="text-sm text-ink-soft">last 30 days</p>
        </div>
        {data.totalSignups === 0 ? (
          <p className="py-12 text-center text-sm text-ink-soft">
            No signups yet. Share your event link to get the first one.
          </p>
        ) : (
          <SignupChart series={data.series} />
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-line bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-bold tracking-tight">Where signups come from</h2>
          {data.sources.length === 0 ? (
            <p className="mt-5 text-sm text-ink-soft">No signups to break down yet.</p>
          ) : (
            <div className="mt-5 space-y-5">
              {data.sources.map((source) => (
                <div key={source.name}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold">{source.name}</span>
                    <span className="text-ink-soft">
                      {source.count.toLocaleString()} · {source.share}% of signups
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream-deep">
                    <div
                      className="h-full rounded-full bg-sun"
                      style={{ width: `${Math.max(source.share, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold tracking-tight">Top referrers</h2>
          <p className="mt-1 text-sm text-ink-soft">Fans who brought the most friends.</p>
          {data.referrers.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">No referrals yet.</p>
          ) : (
            <div className="mt-4">
              {data.referrers.map((r, i) => (
                <div
                  key={`${r.name}-${i}`}
                  className={`flex items-center gap-3 py-3.5 ${i > 0 ? 'border-t border-line' : ''}`}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sun-soft text-sm font-bold">
                    {i + 1}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold">{r.name}</p>
                  <p className="text-sm text-ink-soft">
                    <span className="font-bold text-ink tabular-nums">{r.invites}</span> invites
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
