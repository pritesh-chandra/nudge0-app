'use client'
import { Check, Minus } from '@phosphor-icons/react'
import { Reveal } from './Reveal'

// Compared against tool *categories* rather than named brands: honest and clear.
const COLUMNS = ['nudgeo', 'Waitlist tools', 'Email platforms', 'Link-in-bio'] as const

type Cell = boolean | 'partial'

const ROWS: { feature: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { feature: 'Waitlist page live in minutes', cells: [true, true, 'partial', true] },
  { feature: 'Email updates to fans built in', cells: [true, 'partial', true, false] },
  { feature: 'Referral leaderboard', cells: [true, 'partial', false, false] },
  { feature: 'Hype Score momentum analytics', cells: [true, false, false, false] },
  { feature: 'Prices shown in local currency', cells: [true, false, 'partial', false] },
  { feature: 'Free to start, no card', cells: [true, 'partial', 'partial', true] },
  { feature: 'Export & own your subscriber list', cells: [true, 'partial', true, false] },
]

function CellMark({ value, highlight }: { value: Cell; highlight?: boolean }) {
  if (value === true) {
    return (
      <span
        className={`mx-auto grid size-6 place-items-center rounded-full ${
          highlight ? 'bg-ink text-sun' : 'bg-sun-soft text-ink'
        }`}
      >
        <Check size={14} weight="bold" />
      </span>
    )
  }
  if (value === 'partial') {
    return <span className="text-sm font-semibold text-ink-soft">Some</span>
  }
  return (
    <span className="mx-auto grid size-6 place-items-center text-ink-soft/40">
      <Minus size={14} weight="bold" />
    </span>
  )
}

export function Comparison() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Why creators pick nudgeo.
        </h2>
        <p className="mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
          Other tools do one slice of a launch. nudgeo does the whole thing, from first
          signup to launch-day email.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-2/5 p-4 text-left" />
              {COLUMNS.map((col, i) => (
                <th
                  key={col}
                  className={`p-4 text-center align-bottom ${
                    i === 0
                      ? 'rounded-t-2xl bg-sun text-lg font-extrabold text-ink'
                      : 'text-sm font-semibold text-ink-soft'
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, r) => (
              <tr key={row.feature}>
                <td
                  className={`p-4 text-[15px] font-semibold ${
                    r > 0 ? 'border-t border-line' : ''
                  }`}
                >
                  {row.feature}
                </td>
                {row.cells.map((cell, c) => (
                  <td
                    key={c}
                    className={`p-4 text-center ${
                      c === 0
                        ? `bg-sun/15 ${r === ROWS.length - 1 ? 'rounded-b-2xl' : ''}`
                        : r > 0
                          ? 'border-t border-line'
                          : ''
                    }`}
                  >
                    <CellMark value={cell} highlight={c === 0} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-6 text-center text-xs text-ink-soft">
          Comparison reflects typical offerings in each category. Features vary by provider
          and plan.
        </p>
      </Reveal>
    </section>
  )
}
