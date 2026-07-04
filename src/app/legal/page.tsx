import Link from 'next/link'
import { LegalList, LegalSection, LegalShell } from '@/components/site/LegalShell'

export const metadata = {
  title: 'Legal · nudgeo',
  description: 'nudgeo policies: terms, privacy, refunds and cancellations, and contact.',
}

const POLICIES = [
  {
    href: '/terms',
    title: 'Terms & Conditions',
    blurb: 'The agreement that governs your use of nudgeo, including plans and billing.',
  },
  {
    href: '/privacy',
    title: 'Privacy Policy',
    blurb: 'What we collect, why, who we share it with, and the rights you have.',
  },
  {
    href: '/about',
    title: 'About nudgeo',
    blurb: 'Who we are and what we believe.',
  },
]

export default function LegalPage() {
  return (
    <LegalShell
      title="Legal"
      intro={
        <p>
          Everything formal in one place. The short version: your content and your
          subscriber lists are yours, we charge only for what the pricing page says, and
          you can cancel anytime.
        </p>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {POLICIES.map((policy) => (
          <Link
            key={policy.href}
            href={policy.href}
            className="rounded-3xl border border-line bg-white p-6 transition-colors hover:bg-cream-deep"
          >
            <h2 className="text-lg font-bold tracking-tight">{policy.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{policy.blurb}</p>
          </Link>
        ))}
      </div>

      <div className="border-t border-line pt-10">
        <h2 className="text-2xl font-extrabold tracking-tight">
          Refund & Cancellation Policy
        </h2>
        <p className="mt-2 text-sm font-semibold text-ink-soft">Last updated: July 4, 2026</p>
      </div>

      <LegalSection heading="1. Subscriptions">
        <LegalList
          items={[
            'Paid plans (currently Creator and Studio) are billed in advance, monthly or yearly, through Razorpay, and renew automatically until cancelled.',
            'You can cancel anytime from Settings or by emailing billing@nudgeo.app. Cancellation stops the next renewal; you keep paid features until the end of the period you already paid for.',
            'We do not charge cancellation fees.',
          ]}
        />
      </LegalSection>

      <LegalSection heading="2. Refunds">
        <LegalList
          items={[
            <span key="1">
              <strong>First purchase guarantee.</strong> If nudgeo is not for you, email
              us within 7 days of your first paid subscription charge and we will refund
              it in full.
            </span>,
            <span key="2">
              <strong>Renewals.</strong> Renewal charges are generally non-refundable, but
              if you cancel within 48 hours of an accidental renewal and have not
              materially used paid features in the new period, we will refund it.
            </span>,
            <span key="3">
              <strong>Duplicate or erroneous charges.</strong> Charged twice, or charged
              after cancelling? Tell us and we will refund the incorrect charge in full.
            </span>,
            <span key="4">
              <strong>Email send credits.</strong> Pay-as-you-go send credits are
              refundable while unused; credits already consumed by delivered email are
              not.
            </span>,
            <span key="5">
              <strong>Service failure.</strong> If a sustained outage on our side stops
              you from using a paid feature for a material part of a billing period, we
              will credit or refund a fair pro-rated amount.
            </span>,
          ]}
        />
        <p>
          Approved refunds are issued to the original payment method within 7 to 10
          business days of approval (bank timelines may add to this). Nothing in this
          policy limits non-waivable rights you have under applicable consumer law.
        </p>
      </LegalSection>

      <LegalSection heading="3. How to request a refund">
        <p>
          Email <a href="mailto:billing@nudgeo.app">billing@nudgeo.app</a> from your
          account email with the payment reference (shown in your Razorpay receipt). We
          acknowledge requests within 48 hours and decide within 7 business days.
        </p>
      </LegalSection>

      <LegalSection heading="4. Contact">
        <LegalList
          items={[
            <span key="1">
              General: <a href="mailto:hello@nudgeo.app">hello@nudgeo.app</a>
            </span>,
            <span key="2">
              Billing and refunds: <a href="mailto:billing@nudgeo.app">billing@nudgeo.app</a>
            </span>,
            <span key="3">
              Privacy and grievance officer:{' '}
              <a href="mailto:privacy@nudgeo.app">privacy@nudgeo.app</a>
            </span>,
            <span key="4">
              Legal notices: <a href="mailto:legal@nudgeo.app">legal@nudgeo.app</a>
            </span>,
          ]}
        />
      </LegalSection>
    </LegalShell>
  )
}
