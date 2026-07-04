import type { ReactNode } from 'react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export function LegalShell({
  title,
  lastUpdated,
  intro,
  children,
}: {
  title: string
  lastUpdated?: string
  intro?: ReactNode
  children: ReactNode
}) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {lastUpdated && (
          <p className="mt-3 text-sm font-semibold text-ink-soft">
            Last updated: {lastUpdated}
          </p>
        )}
        {intro && <div className="mt-6 text-lg leading-relaxed text-ink-soft">{intro}</div>}
        <div className="mt-12 grid gap-10">{children}</div>
      </main>
      <Footer />
    </>
  )
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string
  children: ReactNode
}) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight">{heading}</h2>
      <div className="mt-3 grid gap-3 leading-relaxed text-ink-soft [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_strong]:text-ink">
        {children}
      </div>
    </section>
  )
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="grid list-disc gap-2 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}
