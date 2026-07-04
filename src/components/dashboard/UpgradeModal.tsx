'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, Check, Crown, Sparkle, X } from '@phosphor-icons/react'
import { formatUsd, useLocalCurrency } from '@/lib/currency'

type PlanKey = 'free' | 'creator' | 'studio'

// Each answer implies a minimum plan tier (0 free, 1 creator, 2 studio).
const QUESTIONS = [
  {
    id: 'subscribers',
    title: 'How many subscribers do you expect?',
    options: [
      { label: 'Under 100', tier: 0 },
      { label: 'A few hundred to ~2,500', tier: 1 },
      { label: 'Up to 25,000', tier: 2 },
      { label: 'More than 25,000', tier: 2 },
    ],
  },
  {
    id: 'events',
    title: 'How many launches will you run?',
    options: [
      { label: 'Just one for now', tier: 0 },
      { label: 'A handful (up to 5)', tier: 1 },
      { label: 'Lots, ongoing', tier: 2 },
    ],
  },
  {
    id: 'emails',
    title: 'How much will you email your list?',
    options: [
      { label: 'Rarely, pay-as-I-go is fine', tier: 0 },
      { label: 'Regular updates (~10k/mo)', tier: 1 },
      { label: 'Heavy sending (~100k/mo)', tier: 2 },
    ],
  },
] as const

const PLANS: Record<
  PlanKey,
  { name: string; usdMonthly: number; blurb: string; features: string[] }
> = {
  free: {
    name: 'Free',
    usdMonthly: 0,
    blurb: 'Perfect for your first launch.',
    features: ['1 live event', 'Up to 100 signups', 'Hype Score', 'Pay-as-you-go email'],
  },
  creator: {
    name: 'Creator',
    usdMonthly: 15,
    blurb: 'For launches that keep coming.',
    features: [
      '5 live events',
      '2,500 signups per event',
      '10,000 emails a month',
      'Custom email templates',
      'Live visitor count',
    ],
  },
  studio: {
    name: 'Studio',
    usdMonthly: 49,
    blurb: 'For teams running big drops.',
    features: [
      'Unlimited events',
      '25,000 signups per event',
      '100,000 emails a month',
      'Custom domain',
      '3 team seats',
    ],
  },
}

const TIER_TO_PLAN: PlanKey[] = ['free', 'creator', 'studio']

export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const money = useLocalCurrency()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  useEffect(() => {
    if (!open) return
    // Fresh questionnaire each time the modal opens
    setStep(0)
    setAnswers([])
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const isResult = step >= QUESTIONS.length
  const recommendedTier = answers.length ? Math.max(...answers) : 0
  const recommended = TIER_TO_PLAN[recommendedTier]
  const plan = PLANS[recommended]

  function choose(tier: number) {
    const next = [...answers]
    next[step] = tier
    setAnswers(next)
    setStep(step + 1)
  }

  function restart() {
    setStep(0)
    setAnswers([])
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-cream shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Crown size={16} weight="fill" className="text-sun-deep" />
            {isResult ? 'Your match' : `Question ${step + 1} of ${QUESTIONS.length}`}
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full text-ink-soft transition-colors hover:bg-cream-deep hover:text-ink"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Progress */}
        <div className="mt-4 flex gap-1.5 px-6">
          {QUESTIONS.map((q, i) => (
            <span
              key={q.id}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-sun' : 'bg-cream-deep'}`}
            />
          ))}
        </div>

        {isResult ? (
          <div className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
              <Sparkle size={15} weight="fill" className="text-sun-deep" />
              Based on your answers, we suggest
            </div>
            <div className="mt-3 rounded-2xl border border-ink bg-ink p-6 text-cream">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-right">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {formatUsd(plan.usdMonthly, money)}
                  </span>
                  <span className="text-sm text-cream/60">
                    {plan.usdMonthly === 0 ? ' free' : ' /mo'}
                  </span>
                </p>
              </div>
              <p className="mt-1 text-sm text-cream/60">{plan.blurb}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-cream/85">
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-sun text-ink">
                      <Check size={10} weight="bold" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="/#pricing"
              className="mt-5 flex items-center justify-center gap-1.5 rounded-full bg-sun px-6 py-3 text-base font-semibold text-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              {recommended === 'free' ? "You're already set" : `Upgrade to ${plan.name}`}
            </a>
            <button
              type="button"
              onClick={restart}
              className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
            >
              <ArrowLeft size={14} weight="bold" />
              Start over
            </button>
          </div>
        ) : (
          <div className="p-6">
            <h3 className="text-lg font-bold tracking-tight">{QUESTIONS[step].title}</h3>
            <div className="mt-4 grid gap-2.5">
              {QUESTIONS[step].options.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => choose(opt.tier)}
                  className="rounded-2xl border border-line bg-white px-5 py-3.5 text-left text-[15px] font-semibold text-ink transition-colors hover:border-ink/40 hover:bg-cream-deep"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
              >
                <ArrowLeft size={14} weight="bold" />
                Back
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
