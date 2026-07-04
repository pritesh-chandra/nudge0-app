import { LegalList, LegalSection, LegalShell } from '@/components/site/LegalShell'

export const metadata = {
  title: 'Terms & Conditions · nudgeo',
  description: 'The agreement that governs your use of nudgeo.',
}

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms & Conditions"
      lastUpdated="July 4, 2026"
      intro={
        <p>
          These Terms & Conditions (the "Terms") are a binding agreement between you and
          nudgeo ("nudgeo", "we", "us") governing your use of nudgeo.app and related
          services (the "Service"). By creating an account or using the Service, you
          accept these Terms and our <a href="/privacy">Privacy Policy</a>. If you use the
          Service for an organization, you confirm you have authority to bind it, and
          "you" includes that organization.
        </p>
      }
    >
      <LegalSection heading="1. The Service">
        <p>
          nudgeo lets creators publish waitlist pages for events, products, and content
          drops; collect subscriber signups; send email updates; and view analytics
          including a per-event Hype Score. Features may be added, changed, or withdrawn
          at any time; where a change materially reduces a paid feature you rely on, we
          will provide notice and, where required, a pro-rated remedy.
        </p>
      </LegalSection>

      <LegalSection heading="2. Accounts and eligibility">
        <LegalList
          items={[
            'You must be at least 13 years old to use the Service, and at least 18 (or the age of majority where you live) to purchase a paid plan.',
            'You must provide accurate information and verify your email address (including entering one-time passcodes we send) before your account is fully active.',
            'You are responsible for your credentials and everything done under your account. Notify us immediately of unauthorized use.',
            'One person or entity per account unless your plan expressly includes team seats.',
          ]}
        />
      </LegalSection>

      <LegalSection heading="3. Plans, subscriptions, and billing">
        <LegalList
          items={[
            <span key="1">
              <strong>Plans.</strong> We offer a Free plan and paid subscription plans
              (currently Creator and Studio), each with usage limits such as number of
              live events, signups per event, and monthly email sends. Current limits and
              prices are shown on our pricing page and may change prospectively.
            </span>,
            <span key="2">
              <strong>Payment processing.</strong> Payments are processed by third-party
              payment providers, currently Razorpay. By purchasing, you also agree to the
              processor's terms. We do not store full card or banking details.
            </span>,
            <span key="3">
              <strong>Auto-renewal.</strong> Paid subscriptions renew automatically at the
              end of each billing cycle (monthly or yearly) until cancelled. You authorize
              recurring charges to your chosen payment method, including any mandates
              (such as UPI Autopay or e-mandates) set up through the payment provider.
            </span>,
            <span key="4">
              <strong>Price display and currency.</strong> Prices may be displayed in your
              local currency for convenience; the charged amount and currency are shown at
              checkout. Taxes (including GST where applicable) may be added as required by
              law.
            </span>,
            <span key="5">
              <strong>Cancellation.</strong> You may cancel anytime from Settings or by
              contacting us. Cancellation takes effect at the end of the current billing
              period; you keep paid features until then. We do not provide pro-rated
              refunds for partial periods except as stated in our{' '}
              <a href="/legal">Refund & Cancellation Policy</a> or required by law.
            </span>,
            <span key="6">
              <strong>Downgrades.</strong> If you downgrade or your subscription lapses,
              limits of the lower plan apply. Content or subscribers above the new limits
              are preserved for a reasonable period but new activity may be restricted
              until you are within limits.
            </span>,
            <span key="7">
              <strong>Pay-as-you-go email.</strong> Email sends beyond your plan allowance
              (or on the Free plan) are billed per unit as shown at purchase. Purchased
              send credits are consumed on use and are non-refundable once used.
            </span>,
            <span key="8">
              <strong>Failed payments.</strong> If a renewal charge fails, we may retry,
              notify you, restrict paid features, and eventually cancel the subscription.
            </span>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="4. Your content and your subscribers">
        <LegalList
          items={[
            <span key="1">
              <strong>Ownership.</strong> You own the content you publish (text, images
              you have rights to, links) and your subscriber lists. You grant nudgeo a
              worldwide, non-exclusive, royalty-free license to host, store, reproduce,
              adapt, and display that content solely to operate, secure, improve, and
              promote the Service (for example, rendering your public page).
            </span>,
            <span key="2">
              <strong>Your responsibility.</strong> You are solely responsible for your
              content, your use of subscriber data, and your compliance with laws that
              apply to you, including consumer-protection, privacy, and anti-spam laws.
            </span>,
            <span key="3">
              <strong>Third-party materials.</strong> If you use images or other materials
              from third-party libraries (such as Unsplash), your use must comply with
              their licenses. AI-generated text is provided as a draft; review it before
              publishing, and you are responsible for what you publish.
            </span>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="5. Email sending rules">
        <p>Email is powerful and easy to abuse. When sending through nudgeo you must:</p>
        <LegalList
          items={[
            'send only to people who signed up to your list through the Service or otherwise gave you verifiable consent;',
            'never upload purchased, rented, or scraped lists;',
            'not misrepresent who you are or use deceptive subject lines;',
            'honor unsubscribes immediately (every email we deliver includes a working unsubscribe link that must not be removed or obscured);',
            'comply with applicable anti-spam laws (such as CAN-SPAM, CASL, and equivalent laws where your recipients live).',
          ]}
        />
        <p>
          We may throttle, suspend, or terminate sending, without refund, if your sending
          harms deliverability, triggers abuse complaints, or violates these rules.
        </p>
      </LegalSection>

      <LegalSection heading="6. Acceptable use">
        <p>You must not use the Service to:</p>
        <LegalList
          items={[
            'break the law, infringe intellectual property, or violate others’ privacy;',
            'publish or promote content that is fraudulent, deceptive, defamatory, hateful, sexually exploitative of minors, or that incites violence;',
            'run scams, pyramid schemes, phishing, or malware distribution;',
            'probe, disrupt, overload, or circumvent security or usage limits of the Service (including rate limits and plan limits);',
            'scrape the Service, resell it, or build a competing service using our non-public interfaces without written permission;',
            'impersonate any person or misrepresent your affiliation.',
          ]}
        />
      </LegalSection>

      <LegalSection heading="7. Analytics, Hype Score, and beta features">
        <p>
          Analytics, the Hype Score, live-visitor counts, and similar signals are
          estimates provided for information only. They may be recalculated, may lag, and
          are not a promise of commercial results. Features labeled beta, preview, or
          experimental are provided as-is, may change or disappear, and may be excluded
          from paid-plan commitments.
        </p>
      </LegalSection>

      <LegalSection heading="8. nudgeo's intellectual property">
        <p>
          The Service, including its software, design, and branding, is owned by nudgeo
          and its licensors and is protected by intellectual-property laws. We grant you
          a limited, non-exclusive, non-transferable, revocable license to use the
          Service under these Terms. "nudgeo" and our logos may not be used without our
          prior written consent, except to truthfully state that your page is powered by
          nudgeo. Feedback you send us may be used without restriction or obligation.
        </p>
      </LegalSection>

      <LegalSection heading="9. Suspension and termination">
        <LegalList
          items={[
            'You may stop using the Service and delete your account at any time.',
            'We may suspend or terminate your access, with notice where practicable, if you materially breach these Terms, create risk or legal exposure for us or others, or fail to pay amounts due.',
            'On termination, your right to use the Service ends. You may export your subscriber lists before termination; for a reasonable period after, we will make export available on request unless prohibited by law.',
            'Sections that by their nature should survive (ownership, disclaimers, liability limits, disputes) survive termination.',
          ]}
        />
      </LegalSection>

      <LegalSection heading="10. Disclaimers">
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE". TO THE MAXIMUM EXTENT
          PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY
          WARRANTY ARISING FROM COURSE OF DEALING. WE DO NOT WARRANT THAT THE SERVICE
          WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, THAT EMAILS WILL REACH EVERY
          INBOX, OR THAT ANALYTICS WILL BE ACCURATE.
        </p>
      </LegalSection>

      <LegalSection heading="11. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW: (A) NEITHER PARTY IS LIABLE FOR
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST
          PROFITS, REVENUE, DATA, OR GOODWILL; AND (B) NUDGEO'S TOTAL LIABILITY ARISING
          OUT OF OR RELATING TO THE SERVICE IS LIMITED TO THE GREATER OF THE AMOUNTS YOU
          PAID US IN THE 12 MONTHS BEFORE THE CLAIM OR INR 5,000. NOTHING IN THESE TERMS
          LIMITS LIABILITY THAT CANNOT BE LIMITED BY LAW (INCLUDING FOR FRAUD OR WILLFUL
          MISCONDUCT).
        </p>
      </LegalSection>

      <LegalSection heading="12. Indemnity">
        <p>
          You will defend and indemnify nudgeo and its officers, employees, and agents
          against claims, damages, and reasonable costs (including legal fees) arising
          from your content, your subscriber lists and email sending, your breach of
          these Terms, or your violation of law or third-party rights.
        </p>
      </LegalSection>

      <LegalSection heading="13. Governing law and disputes">
        <p>
          These Terms are governed by the laws of India. Subject to any non-waivable
          consumer rights in your country of residence, disputes will be resolved by the
          courts of competent jurisdiction in Bengaluru, Karnataka, India. Before filing
          a claim, you agree to first contact us at{' '}
          <a href="mailto:legal@nudgeo.app">legal@nudgeo.app</a> and give us 30 days to
          try to resolve the dispute informally.
        </p>
      </LegalSection>

      <LegalSection heading="14. Changes to these Terms">
        <p>
          We may update these Terms as the Service or the law evolves. We will post the
          updated Terms with a new "Last updated" date and, for material changes, give
          advance notice by email or in-product message. Changes apply prospectively;
          continued use after they take effect constitutes acceptance. If you do not
          agree, stop using the Service and, if applicable, cancel your subscription
          before renewal.
        </p>
      </LegalSection>

      <LegalSection heading="15. General">
        <LegalList
          items={[
            'These Terms, the Privacy Policy, and the Refund & Cancellation Policy are the entire agreement between you and nudgeo about the Service.',
            'If any provision is held unenforceable, the rest remains in effect, and the provision will be enforced to the maximum extent permitted.',
            'Our failure to enforce a provision is not a waiver.',
            'You may not assign these Terms without our consent; we may assign them in connection with a merger, acquisition, or asset sale.',
            'Neither party is liable for delay or failure caused by events beyond reasonable control (force majeure).',
            'Notices to us: legal@nudgeo.app. Notices to you: your account email.',
          ]}
        />
      </LegalSection>
    </LegalShell>
  )
}
