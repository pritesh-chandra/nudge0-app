'use client'
import Link from 'next/link'

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-sun text-lg font-extrabold text-ink">
            n
          </span>
          <span className="text-xl font-bold tracking-tight">nudgeo</span>
        </a>

        <div className="hidden items-center gap-8 text-[15px] font-medium text-ink-soft md:flex">
          <a href="#how" className="transition-colors hover:text-ink">
            How it works
          </a>
          <a href="#features" className="transition-colors hover:text-ink">
            Features
          </a>
          <a href="#pricing" className="transition-colors hover:text-ink">
            Pricing
          </a>
          <a href="#faq" className="transition-colors hover:text-ink">
            FAQ
          </a>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/auth/sign-in"
            className="hidden text-[15px] font-medium text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Log in
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-full bg-sun px-5 py-2.5 text-[15px] font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98]"
          >
            Create your page
          </Link>
        </div>
      </nav>
    </header>
  )
}
