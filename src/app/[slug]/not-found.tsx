import Link from 'next/link'

export default function EventNotFound() {
  return (
    <div className="grid min-h-[100dvh] place-items-center px-6 text-center">
      <div>
        <span className="grid size-14 place-items-center rounded-2xl bg-sun text-2xl font-extrabold text-ink">
          n
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight">This page isn't here.</h1>
        <p className="mx-auto mt-3 max-w-[40ch] leading-relaxed text-ink-soft">
          The waitlist you're looking for may have been renamed, unpublished, or never
          existed.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-sun px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Go to nudgeo
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/50"
          >
            Create your own page
          </Link>
        </div>
      </div>
    </div>
  )
}
