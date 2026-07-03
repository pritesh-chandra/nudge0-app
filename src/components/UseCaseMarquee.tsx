'use client'
import { Sparkle } from '@phosphor-icons/react'
import { Fragment } from 'react'

const USE_CASES = [
  'Product drops',
  'Album releases',
  'Course cohorts',
  'App betas',
  'Pop-up events',
  'Newsletter launches',
  'Book preorders',
  'Podcast seasons',
]

export function UseCaseMarquee() {
  return (
    <section
      aria-label="What people launch with nudgeo"
      className="overflow-hidden border-y border-line bg-cream-deep py-6"
    >
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {/* track duplicated once for a seamless loop */}
        {[0, 1].map((copy) => (
          <Fragment key={copy}>
            {USE_CASES.map((label) => (
              <span
                key={`${copy}-${label}`}
                aria-hidden={copy === 1}
                className="flex items-center gap-8 text-xl font-semibold text-ink"
              >
                {label}
                <Sparkle size={18} weight="fill" className="text-sun-deep" />
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  )
}
