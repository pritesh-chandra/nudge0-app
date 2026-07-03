'use client'
import { Reveal } from './Reveal'

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <Reveal>
        <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Launches that started here.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <Reveal className="flex flex-col justify-between rounded-3xl bg-sun p-9 lg:col-span-2">
          <p className="text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
            “We collected 4,200 signups before our Kickstarter went live. Day one, we were
            funded in six hours.”
          </p>
          <div className="mt-8 flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/80?img=25"
              alt="Priya Raghavan"
              className="size-12 rounded-full border-2 border-ink/10"
            />
            <div className="leading-tight">
              <p className="font-bold">Priya Raghavan</p>
              <p className="text-sm text-ink/70">Founder, Loomcraft Games</p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5">
          <Reveal delay={0.08} className="rounded-3xl border border-line bg-white p-7">
            <p className="font-medium leading-relaxed">
              “I post one update and every fan gets it. No more juggling a newsletter tool
              and a link page.”
            </p>
            <div className="mt-5 flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/80?img=68"
                alt="Dontae Willis"
                className="size-10 rounded-full"
              />
              <div className="leading-tight">
                <p className="text-sm font-bold">Dontae Willis</p>
                <p className="text-sm text-ink-soft">Musician, Marrow City EP</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.16} className="rounded-3xl border border-line bg-white p-7">
            <p className="font-medium leading-relaxed">
              “The analytics showed my TikTok bio link converting three times better than
              Instagram. I moved my budget the same day.”
            </p>
            <div className="mt-5 flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/80?img=44"
                alt="Elsa Marchetti"
                className="size-10 rounded-full"
              />
              <div className="leading-tight">
                <p className="text-sm font-bold">Elsa Marchetti</p>
                <p className="text-sm text-ink-soft">Author, Brine & Ember cookbook</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
