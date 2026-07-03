'use client'
import { useMemo } from 'react'
import { Buildings, Lightning, Sparkle } from '@phosphor-icons/react'
import { formatUsd, useLocalCurrency } from '@/lib/currency'
import { PricingSection, type PricingTier } from './blocks/pricing-section'
import { Reveal } from './Reveal'

const buildTiers = (payAsYouGo: string): PricingTier[] => [
  {
    name: 'Free',
    monthlyPrice: 0,
    description: 'For your first launch.',
    icon: <Sparkle size={26} weight="bold" />,
    cta: 'Start free',
    features: [
      { name: '1 live event', included: true },
      { name: 'Up to 100 signups', included: true },
      { name: 'Hype Score included', included: true },
      {
        name: 'Email updates pay-as-you-go',
        description: `${payAsYouGo} per 1,000 sends`,
        included: true,
      },
      { name: 'Custom branding', included: false },
      { name: 'Custom domain', included: false },
    ],
  },
  {
    name: 'Creator',
    monthlyPrice: 15,
    description: 'For launches that keep coming.',
    highlight: true,
    badge: 'Most popular',
    icon: <Lightning size={26} weight="bold" />,
    cta: 'Start with Creator',
    features: [
      { name: '5 live events', included: true },
      { name: '2,500 signups per event', included: true },
      { name: '10,000 email sends a month', included: true },
      { name: 'Referral tracking', included: true },
      { name: 'Custom branding and colors', included: true },
      { name: 'Custom domain', included: false },
    ],
  },
  {
    name: 'Studio',
    monthlyPrice: 49,
    description: 'For teams running big drops.',
    icon: <Buildings size={26} weight="bold" />,
    cta: 'Start with Studio',
    features: [
      { name: 'Unlimited events', included: true },
      { name: '25,000 signups per event', included: true },
      { name: '100,000 email sends a month', included: true },
      { name: 'Custom domain', included: true },
      { name: '3 team seats', included: true },
      { name: 'Priority support', included: true },
    ],
  },
]

export function Pricing() {
  const money = useLocalCurrency()
  const tiers = useMemo(() => buildTiers(formatUsd(2, money)), [money])

  return (
    <section id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Free to build. Paid to blast.
        </h2>
        <p className="mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
          Creating an event page always costs nothing. You pay when you send emails or
          scale past your first hundred fans.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <PricingSection tiers={tiers} />
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-10 text-center text-sm text-ink-soft">
          Every plan can buy extra email sends at {formatUsd(2, money)} per 1,000.
          {money.currency !== 'USD' && (
            <span className="mt-1 block text-ink-soft/70">
              Prices shown in {money.currency}. You'll be billed in USD.
            </span>
          )}
        </p>
      </Reveal>
    </section>
  )
}
