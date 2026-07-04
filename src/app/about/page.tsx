import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'About · nudgeo',
  description:
    'nudgeo helps creators build hype before they launch: waitlist pages, email updates, and a Hype Score that shows momentum.',
}

const VALUES = [
  {
    title: 'Your fans are yours',
    body: 'Every email on your waitlist belongs to you. Export it anytime, take it anywhere. We never market to your subscribers or sell your list.',
  },
  {
    title: 'Momentum you can measure',
    body: 'Launches fail quietly when nobody measures the build-up. The Hype Score turns signups, referrals, and conversion into one number you can act on.',
  },
  {
    title: 'Honest pricing',
    body: 'Creating a page is free, forever. You pay when you send email at scale, because that is when we incur real costs. No surprise charges, no dark patterns.',
  },
  {
    title: 'Small surface, sharp tools',
    body: 'We would rather do five things well than fifty things badly. If a feature does not help you launch louder, it does not ship.',
  },
]

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="mx-auto max-w-3xl px-4 pb-16 pt-14 text-center sm:px-6">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Launches deserve a{' '}
            <span className="relative inline-block">
              <span className="relative z-10">line out the door.</span>
              <span
                aria-hidden
                className="absolute inset-x-[-4px] bottom-1 z-0 h-[34%] -rotate-1 rounded-sm bg-sun"
              />
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
            nudgeo is a hype engine for people who make things: waitlist pages that collect
            fans, email updates that keep them warm, and analytics that show whether your
            launch is heating up.
          </p>
        </section>

        <section className="border-y border-line bg-cream-deep">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Why we exist</h2>
            <div className="mt-5 grid gap-4 text-lg leading-relaxed text-ink-soft">
              <p>
                Every creator knows the feeling: you pour months into a zine, an album, an
                app, a cohort, and then launch day arrives to the sound of crickets. Not
                because the work was bad, but because nobody was waiting for it.
              </p>
              <p>
                The fix is old and unglamorous: collect the people who care, early, and talk
                to them until the doors open. The tools for that were built for marketing
                teams, not for one person launching from a kitchen table. nudgeo is that
                fix, sized for creators.
              </p>
              <p>
                You publish a page in minutes. Fans join with one tap. You post updates and
                every subscriber hears about it. And the Hype Score tells you, honestly,
                whether the wait is growing.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight">What we believe</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-3xl border border-line bg-white p-7">
                <h3 className="text-lg font-bold tracking-tight">{value.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{value.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 pb-24 text-center sm:px-6">
          <div className="rounded-3xl bg-sun px-6 py-14">
            <h2 className="mx-auto max-w-[20ch] text-3xl font-extrabold tracking-tight md:text-4xl">
              Building something? Start the line.
            </h2>
            <Link
              href="/auth/sign-up"
              className="mt-7 inline-block rounded-full bg-ink px-8 py-3.5 text-base font-semibold text-cream transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Create your page
            </Link>
            <p className="mt-4 text-sm font-medium text-ink/70">
              Questions? Write to{' '}
              <a href="mailto:hello@nudgeo.app" className="font-bold underline underline-offset-2">
                hello@nudgeo.app
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
