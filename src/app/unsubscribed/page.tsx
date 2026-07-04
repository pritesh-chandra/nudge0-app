import Link from 'next/link'

export const metadata = { title: 'Unsubscribed · nudgeo' }

export default async function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string; missing?: string }>
}) {
  const { event, missing } = await searchParams

  return (
    <div className="grid min-h-[100dvh] place-items-center px-6 text-center">
      <div>
        <span className="grid size-14 place-items-center rounded-2xl bg-sun text-2xl font-extrabold text-ink">
          n
        </span>
        {missing ? (
          <>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Link not found.</h1>
            <p className="mx-auto mt-3 max-w-[42ch] leading-relaxed text-ink-soft">
              This unsubscribe link is no longer valid. You may already be unsubscribed.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight">You're unsubscribed.</h1>
            <p className="mx-auto mt-3 max-w-[42ch] leading-relaxed text-ink-soft">
              You won't get any more emails{event ? ` about ${event}` : ''}. Changed your mind?
              Just sign up again on the event page.
            </p>
          </>
        )}
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-sun px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        >
          Go to nudgeo
        </Link>
      </div>
    </div>
  )
}
