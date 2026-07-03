'use client'
import { DownloadSimple, PaperPlaneRight } from '@phosphor-icons/react'
import { Reveal } from './Reveal'

function EmailPreview() {
  return (
    <div className="mt-6 rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-line pb-3 text-sm">
        <p className="text-ink-soft">
          To: <span className="font-semibold text-ink">All 1,284 subscribers</span>
        </p>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-sun px-4 py-1.5 font-semibold text-ink"
        >
          Send
          <PaperPlaneRight size={14} weight="bold" />
        </button>
      </div>
      <p className="mt-3 font-semibold">The presses are rolling</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
        Vol. 2 went to print this morning. First 200 copies come with a signed darkroom
        contact sheet. Preorders open to this list two days early.
      </p>
    </div>
  )
}

function SubscriberRows() {
  const rows = [
    { name: 'Anaïs Fontaine', joined: 'Joined 2d ago' },
    { name: 'Kofi Mensah', joined: 'Joined 3d ago' },
    { name: 'Ren Takahashi', joined: 'Joined 5d ago' },
  ]
  return (
    <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm">
      {rows.map((r, i) => (
        <div
          key={r.name}
          className={`flex items-center justify-between py-2 ${i > 0 ? 'border-t border-white/10' : ''}`}
      >
          <span className="font-medium text-cream">{r.name}</span>
          <span className="text-cream/60">{r.joined}</span>
        </div>
      ))}
    </div>
  )
}

export function FeatureBento() {
  return (
    <section
      id="features"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-24 sm:px-6 lg:pb-32"
    >
      <Reveal>
        <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Everything after the signup.
        </h2>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
          Collecting emails is the easy part. nudgeo handles what comes next.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        <Reveal className="rounded-3xl bg-sun-soft p-8 md:col-span-2">
          <h3 className="text-2xl font-bold tracking-tight">Updates that feel personal</h3>
          <p className="mt-2 max-w-[52ch] leading-relaxed text-ink-soft">
            Post once and every subscriber hears about it by email. No separate newsletter
            tool, no CSV shuffling.
          </p>
          <EmailPreview />
        </Reveal>

        <Reveal delay={0.08} className="rounded-3xl bg-ink p-8 text-cream">
          <span className="grid size-11 place-items-center rounded-2xl bg-sun text-ink">
            <DownloadSimple size={22} weight="bold" />
          </span>
          <h3 className="mt-5 text-2xl font-bold tracking-tight">Your list is yours</h3>
          <p className="mt-2 leading-relaxed text-cream/70">
            Export every subscriber as CSV whenever you want. No lock-in, no ransom.
          </p>
          <SubscriberRows />
        </Reveal>

        <Reveal delay={0.06} className="rounded-3xl border border-line bg-white p-8">
          <h3 className="text-2xl font-bold tracking-tight">Your look, your link</h3>
          <p className="mt-2 leading-relaxed text-ink-soft">
            Brand colors, your photography, and a clean URL that fits on a poster.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {['#FFD43B', '#201D15', '#E2725B', '#4A7C59', '#6C7FD8'].map((c) => (
              <span
                key={c}
                className="size-8 rounded-full border border-line"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <p className="mt-4 inline-block rounded-full bg-cream px-4 py-2 text-sm font-semibold">
            nudgeo.app/yourname
          </p>
        </Reveal>

        <Reveal delay={0.12} className="rounded-3xl border border-line bg-white p-8 md:col-span-2">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Embed anywhere</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">
                Drop the signup form into your existing site, blog, or link-in-bio with one
                snippet.
              </p>
            </div>
            <pre className="overflow-x-auto rounded-2xl bg-ink p-5 text-sm leading-relaxed text-sun">
              <code>{`<script
  src="https://nudgeo.app/embed.js"
  data-page="fieldnotes">
</script>`}</code>
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
