'use client'
import Link from 'next/link'
import { Reveal } from './Reveal'

export function FinalCta() {
  return (
    <section id="create" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-24 sm:px-6">
      <Reveal>
        <div className="rounded-3xl bg-sun px-6 py-20 text-center md:py-24">
          <h2 className="mx-auto max-w-[18ch] text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Your next launch deserves a line out the door.
          </h2>
          <Link
            href="/auth/sign-up"
            className="mt-10 inline-block rounded-full bg-ink px-9 py-4 text-lg font-semibold text-cream transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Create your page
          </Link>
          <p className="mt-5 text-sm font-medium text-ink/70">
            Free to start. Your page is live in minutes.
          </p>
        </div>
      </Reveal>
    </section>
  )
}
