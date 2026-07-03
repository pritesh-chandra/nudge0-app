'use client'
import { XLogo, InstagramLogo, YoutubeLogo } from '@phosphor-icons/react'

const SOCIALS = [
  { label: 'X', href: '#', Icon: XLogo },
  { label: 'Instagram', href: '#', Icon: InstagramLogo },
  { label: 'YouTube', href: '#', Icon: YoutubeLogo },
]

export function Footer() {
  return (
    <footer className="px-4 pb-6 sm:px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-ink text-cream">
        <div className="grid gap-12 px-8 pt-16 sm:px-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-sun text-lg font-extrabold text-ink">
                n
              </span>
              <span className="text-xl font-bold tracking-tight">nudgeo</span>
            </div>
            <p className="mt-4 max-w-[36ch] leading-relaxed text-cream/60">
              Waitlist pages for products, events, and everything you're about to release.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-sun hover:text-sun"
                >
                  <Icon size={19} weight="fill" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Product" className="md:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-cream/40">
              Product
            </p>
            <ul className="mt-4 space-y-3 text-cream/70">
              <li>
                <a href="#how" className="transition-colors hover:text-sun">
                  How it works
                </a>
              </li>
              <li>
                <a href="#features" className="transition-colors hover:text-sun">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition-colors hover:text-sun">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-sun">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company" className="md:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-cream/40">
              Company
            </p>
            <ul className="mt-4 space-y-3 text-cream/70">
              <li>
                <a href="#" className="transition-colors hover:text-sun">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-sun">
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@nudgeo.app"
                  className="transition-colors hover:text-sun"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Oversized wordmark, clipped at the panel edge */}
        <p
          aria-hidden
          className="mt-10 -mb-[0.32em] select-none text-center text-[26vw] font-extrabold leading-none tracking-tight text-cream/[0.07] md:text-[13rem]"
        >
          nudgeo
        </p>

        <div className="border-t border-cream/10">
          <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-6 text-sm text-cream/50 sm:px-12">
            <p>© 2026 nudgeo</p>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-cream">
                Privacy
              </a>
              <a href="#" className="transition-colors hover:text-cream">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
