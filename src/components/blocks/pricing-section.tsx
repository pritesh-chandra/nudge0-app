'use client'
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatUsd, useLocalCurrency } from '@/lib/currency'
import { cn } from '@/lib/utils'

const YEARLY_DISCOUNT = 0.2

export interface PricingFeature {
  name: string
  description?: string
  included: boolean
}

export interface PricingTier {
  name: string
  /** Monthly price in dollars; yearly billing applies the 20% discount automatically */
  monthlyPrice: number
  description: string
  features: PricingFeature[]
  cta: string
  highlight?: boolean
  badge?: string
  icon: ReactNode
}

export function PricingSection({ tiers, className }: { tiers: PricingTier[]; className?: string }) {
  const [isYearly, setIsYearly] = useState(false)
  const money = useLocalCurrency()

  return (
    <div className={cn('w-full', className)}>
      {/* Billing period toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center rounded-full border border-line bg-white p-1.5 shadow-sm">
          {(['Monthly', 'Yearly'] as const).map((period) => {
            const active = (period === 'Yearly') === isYearly
            return (
              <button
                key={period}
                type="button"
                onClick={() => setIsYearly(period === 'Yearly')}
                className={cn(
                  'flex items-center gap-2 rounded-full px-7 py-2.5 text-sm font-semibold transition-all duration-300',
                  active ? 'bg-ink text-cream shadow-lg' : 'text-ink-soft hover:text-ink',
                )}
              >
                {period}
                {period === 'Yearly' && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-bold',
                      active ? 'bg-sun text-ink' : 'bg-sun-soft text-ink',
                    )}
                  >
                    save 20%
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
        {tiers.map((tier) => {
          const price = isYearly
            ? Math.round(tier.monthlyPrice * (1 - YEARLY_DISCOUNT))
            : tier.monthlyPrice

          return (
            <div
              key={tier.name}
              className={cn(
                'relative flex flex-col rounded-3xl border transition-shadow duration-300',
                tier.highlight
                  ? 'border-ink bg-ink text-cream shadow-xl'
                  : 'border-line bg-white shadow-md hover:shadow-lg',
              )}
            >
              {tier.badge && tier.highlight && (
                <Badge className="absolute -top-3.5 left-6 border-none bg-sun px-4 py-1.5 text-sm font-bold text-ink shadow-lg hover:bg-sun">
                  {tier.badge}
                </Badge>
              )}

              <div className="flex-1 p-8">
                <div className="mb-4 flex items-center justify-between">
                  {/* <div
                    className={cn(
                      'rounded-xl p-3',
                      tier.highlight ? 'bg-sun text-ink' : 'bg-sun-soft text-ink',
                    )}
                  >
                    {tier.icon}
                  </div> */}
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tight tabular-nums">
                      {formatUsd(price, money)}
                    </span>
                    <span
                      className={cn('text-sm', tier.highlight ? 'text-cream/60' : 'text-ink-soft')}
                    >
                      {tier.monthlyPrice === 0
                        ? 'forever'
                        : isYearly
                          ? 'per month, billed yearly'
                          : 'per month'}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'mt-2 text-sm',
                      tier.highlight ? 'text-cream/60' : 'text-ink-soft',
                    )}
                  >
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature.name} className="flex gap-3.5">
                      <span
                        className={cn(
                          'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
                          feature.included
                            ? tier.highlight
                              ? 'bg-sun text-ink'
                              : 'bg-sun-soft text-ink'
                            : tier.highlight
                              ? 'bg-white/10 text-cream/40'
                              : 'bg-cream-deep text-ink-soft/50',
                        )}
                      >
                        <Check size={12} weight="bold" />
                      </span>
                      <div>
                        <div
                          className={cn(
                            'text-sm font-semibold',
                            !feature.included && (tier.highlight ? 'text-cream/50' : 'text-ink-soft/60'),
                          )}
                        >
                          {feature.name}
                        </div>
                        {feature.description && (
                          <div
                            className={cn(
                              'text-sm',
                              tier.highlight ? 'text-cream/55' : 'text-ink-soft',
                            )}
                          >
                            {feature.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto p-8 pt-0">
                <Button
                  asChild
                  className={cn(
                    'h-12 w-full text-base font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98]',
                    tier.highlight
                      ? 'bg-sun text-ink hover:bg-sun'
                      : 'border border-ink/20 bg-transparent text-ink hover:border-ink/50 hover:bg-transparent',
                  )}
                >
                  <Link href="/auth/sign-up">
                    <span className="flex items-center justify-center gap-2">
                      {tier.cta}
                      <ArrowRight size={16} weight="bold" />
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
