'use client'
import { useState } from 'react'
import { StatCard } from './StatCard'

// Sample analytics until the events backend lands
const DATASETS = {
  fieldnotes: {
    label: 'Fieldnotes, Vol. 2 (live)',
    stats: [
      { label: 'Page visits', value: '21,412', hint: 'last 30 days' },
      { label: 'Signups', value: '1,284', hint: '+312 this week' },
      { label: 'Visit-to-signup', value: '6.4%', hint: 'all sources' },
      { label: 'Hype Score', value: '87', hint: '+9 this week' },
    ],
    series: [
      8, 11, 9, 14, 12, 18, 16, 22, 19, 24, 21, 28, 26, 31, 29, 36, 33, 41, 38, 44, 47, 43,
      52, 58, 54, 66, 61, 72, 79, 89,
    ],
    sources: [
      { name: 'TikTok', share: 38, conversion: '9.2%' },
      { name: 'Instagram', share: 24, conversion: '5.1%' },
      { name: 'X', share: 14, conversion: '4.4%' },
      { name: 'Direct', share: 12, conversion: '7.6%' },
      { name: 'Newsletter', share: 12, conversion: '11.8%' },
    ],
    referrers: [
      { name: 'Anaïs Fontaine', invites: 42 },
      { name: 'Dontae Willis', invites: 31 },
      { name: 'Lucía Herrera', invites: 19 },
    ],
  },
  printswap: {
    label: 'Print Swap Night (ended)',
    stats: [
      { label: 'Page visits', value: '34,860', hint: 'full run' },
      { label: 'Signups', value: '2,206', hint: 'final count' },
      { label: 'Visit-to-signup', value: '6.3%', hint: 'all sources' },
      { label: 'Hype Score', value: '74', hint: 'peak score' },
    ],
    series: [
      4, 7, 6, 12, 15, 13, 21, 26, 24, 33, 38, 35, 47, 52, 49, 61, 58, 66, 72, 69, 78, 84,
      81, 88, 92, 86, 74, 61, 43, 22,
    ],
    sources: [
      { name: 'Instagram', share: 41, conversion: '6.8%' },
      { name: 'Direct', share: 22, conversion: '8.1%' },
      { name: 'TikTok', share: 18, conversion: '4.9%' },
      { name: 'Newsletter', share: 11, conversion: '12.4%' },
      { name: 'X', share: 8, conversion: '3.7%' },
    ],
    referrers: [
      { name: 'Ren Takahashi', invites: 58 },
      { name: 'Kofi Mensah', invites: 36 },
      { name: 'Mara Quinn', invites: 27 },
    ],
  },
} as const

type DatasetKey = keyof typeof DATASETS

function SignupChart({ series }: { series: readonly number[] }) {
  const w = 720
  const h = 260
  const pad = 18
  const max = Math.max(...series)
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

export function AnalyticsView() {
  const [key, setKey] = useState<DatasetKey>('fieldnotes')
  const data = DATASETS[key]

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
            value={key}
            onChange={(e) => setKey(e.target.value as DatasetKey)}
            className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink focus:outline-2 focus:outline-sun-deep"
          >
            {Object.entries(DATASETS).map(([k, d]) => (
              <option key={k} value={k}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-line bg-white p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold tracking-tight">Daily signups</h2>
          <p className="text-sm text-ink-soft">last 30 days</p>
        </div>
        <SignupChart series={data.series} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-line bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-bold tracking-tight">Where signups come from</h2>
          <div className="mt-5 space-y-5">
            {data.sources.map((source) => (
              <div key={source.name}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold">{source.name}</span>
                  <span className="text-ink-soft">
                    {source.share}% of traffic · {source.conversion} convert
                  </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream-deep">
                  <div
                    className="h-full rounded-full bg-sun"
                    style={{ width: `${source.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-white p-6">
          <h2 className="text-lg font-bold tracking-tight">Top referrers</h2>
          <p className="mt-1 text-sm text-ink-soft">Fans who brought the most friends.</p>
          <div className="mt-4">
            {data.referrers.map((r, i) => (
              <div
                key={r.name}
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
        </section>
      </div>
    </div>
  )
}
