'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'

const RECENT_SIGNUPS = [
  { name: 'Jonas Petersen', img: 5 },
  { name: 'Amara Diallo', img: 16 },
  { name: 'Yuki Sato', img: 31 },
  { name: 'Theo Marchand', img: 59 },
]

const BASE_COUNT = 1284
const RING_CIRCUMFERENCE = 100.5 // 2 * PI * r16

function HypeScoreChip({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -right-3 top-24 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_12px_32px_-12px_rgba(93,79,26,0.3)] md:-right-20"
    >
      <div className="relative grid size-11 place-items-center">
        <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
          <circle cx="20" cy="20" r="16" fill="none" strokeWidth="4" className="stroke-cream-deep" />
          <motion.circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            className="stroke-sun-deep"
            strokeDasharray={RING_CIRCUMFERENCE}
            initial={{ strokeDashoffset: reduce ? RING_CIRCUMFERENCE * 0.13 : RING_CIRCUMFERENCE }}
            animate={{ strokeDashoffset: RING_CIRCUMFERENCE * 0.13 }}
            transition={{ duration: 1.4, delay: 0.9, ease: 'easeOut' }}
          />
        </svg>
        <span className="text-sm font-extrabold">87</span>
      </div>
      <div className="text-left leading-tight">
        <p className="text-sm font-bold">Hype Score</p>
        <p className="text-xs text-ink-soft">+9 this week</p>
      </div>
    </motion.div>
  )
}

function SignupToast({ reduce, tick }: { reduce: boolean; tick: number }) {
  const person = RECENT_SIGNUPS[tick % RECENT_SIGNUPS.length]
  return (
    <div className="absolute -bottom-7 -left-3 md:-left-16">
      <motion.div
        key={tick}
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2.5 rounded-2xl border border-line bg-white px-4 py-3 shadow-[0_12px_32px_-12px_rgba(93,79,26,0.3)]"
      >
        <img
          src={`https://i.pravatar.cc/56?img=${person.img}`}
          alt=""
          className="size-8 rounded-full"
        />
        <div className="text-left leading-tight">
          <p className="text-sm font-bold">{person.name} joined</p>
          <p className="text-xs text-ink-soft">just now</p>
        </div>
      </motion.div>
    </div>
  )
}

function WaitlistPreview() {
  const reduce = useReducedMotion() ?? false
  const [tick, setTick] = useState(0)

  // Simulate fans signing up while the visitor watches
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setTick((t) => t + 1), 2600)
    return () => clearInterval(id)
  }, [reduce])

  const count = (BASE_COUNT + tick).toLocaleString('en-US')

  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      {/* A miniature of an actual nudgeo waitlist page */}
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_24px_60px_-24px_rgba(93,79,26,0.25)]">
        <img
          src="https://picsum.photos/seed/fieldnotes-zine-darkroom/960/440"
          alt="Cover photo for the Fieldnotes zine waitlist page"
          className="h-40 w-full object-cover"
          width={960}
          height={440}
        />
        <div className="p-6">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/80?img=47"
              alt="Mara Quinn"
              className="size-11 rounded-full border-2 border-white shadow-sm"
            />
            <div className="text-left">
              <p className="font-semibold leading-tight">Mara Quinn</p>
              <p className="text-sm text-ink-soft">nudgeo.app/fieldnotes</p>
            </div>
          </div>

          <h3 className="mt-4 text-left text-2xl font-bold tracking-tight">
            Fieldnotes, Vol. 2
          </h3>
          <p className="mt-1.5 text-left text-[15px] leading-relaxed text-ink-soft">
            A print zine of 35mm photography from the Pacific Northwest. Shipping this fall.
          </p>

          <form className="mt-5 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="hero-preview-email" className="sr-only">
              Email address
            </label>
            <input
              id="hero-preview-email"
              type="email"
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-[14px] border border-line bg-cream px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/70 focus:outline-2 focus:outline-sun-deep"
            />
            <button
              type="submit"
              className="rounded-full bg-sun px-5 py-2.5 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98]"
            >
              Notify me
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[12, 32, 56].map((n) => (
                <img
                  key={n}
                  src={`https://i.pravatar.cc/56?img=${n}`}
                  alt=""
                  className="size-7 rounded-full border-2 border-white"
                />
              ))}
            </div>
            <p className="text-sm font-medium text-ink-soft">
              <span className="font-bold text-ink tabular-nums">{count}</span> people are
              waiting
            </p>
          </div>
        </div>
      </div>

      <HypeScoreChip reduce={reduce} />
      <SignupToast reduce={reduce} tick={tick} />
    </div>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        }

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-sun-soft blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-6 pb-28 pt-16 text-center sm:px-10 lg:pt-24">
        <motion.h1
          {...enter(0)}
          className="mx-auto max-w-[16ch] text-5xl font-extrabold leading-[1.04] tracking-tight md:text-6xl lg:text-7xl"
        >
          Build the{' '}
          <span className="relative inline-block">
            <span className="relative z-10">hype</span>
            <span
              aria-hidden
              className="absolute inset-x-[-4px] bottom-1 z-0 h-[38%] -rotate-1 rounded-sm bg-sun"
            />
          </span>{' '}
          before you launch.
        </motion.h1>

        <motion.p
          {...enter(0.12)}
          className="mx-auto mt-6 max-w-[48ch] text-lg leading-relaxed text-ink-soft md:text-xl"
        >
          Spin up a waitlist page for your product, event, or drop. Collect signups, send
          email updates, and watch momentum build.
        </motion.p>

        <motion.div
          {...enter(0.22)}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/auth/sign-up"
            className="rounded-full bg-sun px-7 py-3.5 text-base font-semibold text-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Create your page
          </Link>
          <a
            href="#how"
            className="rounded-full border border-ink/20 px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:border-ink/50"
          >
            See how it works
          </a>
        </motion.div>

        <motion.div {...enter(0.32)} className="mt-16">
          <WaitlistPreview />
        </motion.div>
      </div>
    </section>
  )
}
