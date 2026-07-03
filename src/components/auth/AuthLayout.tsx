import type { ReactNode } from 'react'
import Link from 'next/link'

export type AuthQuote = {
  text: string
  name: string
  role: string
  img: string
}

export function AuthLayout({
  title,
  subtitle,
  quote,
  children,
}: {
  title: string
  subtitle: string
  quote: AuthQuote
  children: ReactNode
}) {
  return (
    <div className="grid min-h-[100dvh] bg-ink text-cream lg:grid-cols-2">
      {/* Form column */}
      <div className="flex flex-col px-6 pb-8 pt-6 sm:px-10">
        <Link href="/" className="inline-flex w-fit items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-sun text-base font-extrabold text-ink">
            n
          </span>
          <span className="text-lg font-bold tracking-tight">nudgeo</span>
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-cream/60">{subtitle}</p>
          <div className="mt-10">{children}</div>
        </div>

        <p className="mx-auto w-full max-w-sm text-center text-xs leading-relaxed text-cream/40">
          By continuing, you agree to nudgeo's{' '}
          <a href="#" className="underline underline-offset-2 hover:text-cream/70">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-2 hover:text-cream/70">
            Privacy Policy
          </a>
          .
        </p>
      </div>

      {/* Quote column */}
      <aside className="hidden items-center border-l border-cream/10 bg-white/[0.03] px-16 lg:flex xl:px-24">
        <figure className="max-w-lg">
          <blockquote className="text-2xl font-medium leading-relaxed tracking-tight">
            “{quote.text}”
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-3">
            <img src={quote.img} alt="" className="size-11 rounded-full" />
            <div className="leading-tight">
              <p className="font-semibold">{quote.name}</p>
              <p className="mt-0.5 text-sm text-cream/60">{quote.role}</p>
            </div>
          </figcaption>
        </figure>
      </aside>
    </div>
  )
}

export function Field({
  id,
  label,
  labelEnd,
  ...inputProps
}: {
  id: string
  label: string
  labelEnd?: ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm text-cream/80">
          {label}
        </label>
        {labelEnd}
      </div>
      <input
        id={id}
        className="w-full rounded-xl border border-cream/15 bg-white/5 px-4 py-2.5 text-[15px] text-cream placeholder:text-cream/35 focus:outline-2 focus:outline-sun"
        {...inputProps}
      />
    </div>
  )
}

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-full bg-sun py-3 text-base font-semibold text-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {children}
    </button>
  )
}
