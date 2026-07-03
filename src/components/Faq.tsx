'use client'
import { useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import { Reveal } from './Reveal'

const QA = [
  {
    q: 'What does nudgeo cost?',
    a: 'Creating an event page is always free. The free tier covers 1 live event with up to 100 signups; Creator and Studio plans add more events, more signups, and monthly email sends.',
  },
  {
    q: 'How is the Hype Score calculated?',
    a: 'Each event gets a score from 0 to 100 built from signup velocity, referral share, and visit-to-signup conversion. It updates daily, so you can see a launch heating up or cooling off.',
  },
  {
    q: 'Do my subscribers need an account?',
    a: 'No. Fans just type an email and tap once. They can unsubscribe from any update with a single click.',
  },
  {
    q: 'How do email updates work?',
    a: 'You write an update on your page and we deliver it to every subscriber from your name. Sends come out of your monthly allowance, or pay-as-you-go on the free tier.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Every page lives at nudgeo.app/yourname by default. The Studio plan lets you connect your own domain.',
  },
  {
    q: 'Can I export my subscriber list?',
    a: 'Anytime, as CSV, with one click. The list belongs to you, not to us.',
  },
]

function Item({
  q,
  a,
  open,
  onToggle,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="text-lg font-semibold">{q}</span>
        <Plus
          size={20}
          weight="bold"
          className={`shrink-0 text-ink-soft transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[60ch] pb-6 leading-relaxed text-ink-soft">{a}</p>
        </div>
      </div>
    </div>
  )
}

export function Faq() {
  // Exclusive accordion: opening one question closes the others
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-24 sm:px-6 lg:pb-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Questions, answered.
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="border-t border-line lg:col-span-7 lg:col-start-6">
          {QA.map((item, i) => (
            <Item
              key={item.q}
              {...item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
