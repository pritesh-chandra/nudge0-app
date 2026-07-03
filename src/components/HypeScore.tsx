'use client'
import { motion, useReducedMotion } from 'motion/react'
import { ChartLineUp, ShareNetwork, UsersThree } from '@phosphor-icons/react'
import { Reveal } from './Reveal'

const RING_R = 52
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R
const SCORE = 87

// Sample factors behind the demo score
const FACTORS = [
  { label: 'Signup velocity', value: '+312 / week' },
  { label: 'Referral share', value: '38%' },
  { label: 'Visit-to-signup', value: '6.4%' },
]

function ScoreCard() {
  const reduce = useReducedMotion()
  const offset = RING_CIRCUMFERENCE * (1 - SCORE / 100)

  return (
    <div className="rounded-3xl border border-line bg-white p-8 shadow-[0_24px_60px_-30px_rgba(93,79,26,0.3)]">
      <div className="flex flex-wrap items-center gap-7">
        <div className="relative grid size-36 place-items-center">
          <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={RING_R}
              fill="none"
              strokeWidth="11"
              className="stroke-cream-deep"
            />
            <motion.circle
              cx="60"
              cy="60"
              r={RING_R}
              fill="none"
              strokeWidth="11"
              strokeLinecap="round"
              className="stroke-sun"
              strokeDasharray={RING_CIRCUMFERENCE}
              initial={{ strokeDashoffset: reduce ? offset : RING_CIRCUMFERENCE }}
              whileInView={{ strokeDashoffset: offset }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            />
          </svg>
          <div className="text-center leading-none">
            <p className="text-5xl font-extrabold tracking-tight">{SCORE}</p>
          </div>
        </div>
        <div>
          <p className="text-xl font-bold">Hype Score</p>
          <p className="mt-1 text-ink-soft">Fieldnotes, Vol. 2</p>
          <p className="mt-3 inline-block rounded-full bg-sun-soft px-3 py-1 text-sm font-semibold">
            +9 this week
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-line">
        {FACTORS.map((f) => (
          <div key={f.label} className="flex items-center justify-between py-4">
            <span className="text-ink-soft">{f.label}</span>
            <span className="font-bold tabular-nums">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const POINTS = [
  {
    icon: UsersThree,
    title: 'Signups move it',
    body: 'Every confirmed email nudges the score, and momentum counts for more than raw totals.',
  },
  {
    icon: ShareNetwork,
    title: 'Referrals move it most',
    body: 'Fans who bring friends push the score hardest, so your superfans surface fast.',
  },
  {
    icon: ChartLineUp,
    title: 'Conversion keeps it honest',
    body: 'If visits stop turning into signups, the score tells you before launch day does.',
  },
]

export function HypeScore() {
  return (
    <section className="border-y border-line bg-cream-deep">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:py-32">
        <Reveal>
          <ScoreCard />
        </Reveal>

        <div>
          <Reveal>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Meet the Hype Score.
            </h2>
            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-ink-soft">
              Signups, referrals, and conversion, rolled into one number that tells you
              whether your launch is heating up.
            </p>
          </Reveal>
          <div className="mt-10 space-y-8">
            {POINTS.map((point, i) => (
              <Reveal key={point.title} delay={i * 0.08}>
                <div className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sun text-ink">
                    <point.icon size={20} weight="bold" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{point.title}</h3>
                    <p className="mt-1 max-w-[48ch] leading-relaxed text-ink-soft">
                      {point.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
