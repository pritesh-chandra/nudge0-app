'use client'
import { PaintBrushBroad, LinkSimple, PaperPlaneTilt } from '@phosphor-icons/react'
import { Reveal } from './Reveal'

const STEPS = [
  {
    icon: PaintBrushBroad,
    title: 'Create',
    body: 'Pick a template, tell your story, and publish at nudgeo.app/yourname. No code, no drag-and-drop maze.',
  },
  {
    icon: LinkSimple,
    title: 'Share',
    body: 'One link for your bio, your stories, and your posters. Fans join with a single tap and an email.',
  },
  {
    icon: PaperPlaneTilt,
    title: 'Update',
    body: 'Write an update once. Every subscriber gets it in their inbox, sent from your name.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 lg:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Live in minutes.
        </h2>
        <p className="mx-auto mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
          A waitlist should take less time to build than the thing you are launching.
          nudgeo keeps it to three moves.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-14">
        <div className="grid divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="group p-9 transition-colors duration-300 hover:bg-cream"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-sun text-ink transition-transform duration-300 group-hover:-translate-y-1">
                <step.icon size={24} weight="bold" />
              </span>
              <h3 className="mt-6 text-2xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2.5 leading-relaxed text-ink-soft">{step.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
