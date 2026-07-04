import { LegalList, LegalSection, LegalShell } from '@/components/site/LegalShell'

export const metadata = {
  title: 'Privacy Policy · nudgeo',
  description: 'How nudgeo collects, uses, shares, and protects personal data.',
}

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      lastUpdated="July 4, 2026"
      intro={
        <p>
          This Privacy Policy explains how nudgeo ("nudgeo", "we", "us") collects, uses,
          shares, and protects personal data when you use nudgeo.app, our applications, and
          related services (together, the "Service"). By using the Service you agree to
          this Policy. If you do not agree, please do not use the Service.
        </p>
      }
    >
      <LegalSection heading="1. Who this Policy covers">
        <p>The Service involves two kinds of people, and we treat their data differently:</p>
        <LegalList
          items={[
            <span key="c">
              <strong>Creators</strong>: account holders who build event pages, collect
              signups, and send updates. For creator account data, nudgeo is the data
              controller (or "data fiduciary" under Indian law).
            </span>,
            <span key="s">
              <strong>Subscribers</strong>: fans who join a creator's waitlist. Subscriber
              lists belong to the creator. For subscriber data collected through a
              creator's page, the creator is the controller and nudgeo acts as a processor
              on the creator's behalf.
            </span>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="2. Data we collect">
        <LegalList
          items={[
            <span key="1">
              <strong>Account data</strong>: name, email address, hashed password, and
              email-verification status (including one-time verification codes).
            </span>,
            <span key="2">
              <strong>Event content</strong>: event names, descriptions (including
              AI-assisted drafts), images and image references, links, social handles,
              launch dates, and page settings you configure.
            </span>,
            <span key="3">
              <strong>Subscriber data</strong> (processed for creators): a subscriber's
              name, email address, signup source, referral relationships, and
              subscription status.
            </span>,
            <span key="4">
              <strong>Billing data</strong>: plan, billing cycle, subscription status, and
              payment records (amount, currency, method, and payment identifiers). Payments
              are processed by Razorpay; we never receive or store your full card number,
              CVV, or banking credentials.
            </span>,
            <span key="5">
              <strong>Usage and technical data</strong>: log data such as IP address,
              browser and device information, session identifiers, approximate location
              inferred from your browser's timezone or locale (used, for example, to show
              prices in your local currency), and analytics about how pages perform
              (visits, signups, conversion, referral activity).
            </span>,
            <span key="6">
              <strong>Communications</strong>: messages you send us, and delivery metadata
              for emails sent through the Service.
            </span>,
          ]}
        />
      </LegalSection>

      <LegalSection heading="3. How we use data">
        <LegalList
          items={[
            'Providing the Service: accounts, event pages, signups, analytics, Hype Scores, and email delivery.',
            'Verifying identity and securing accounts, including one-time passcodes (OTP) sent to your email at signup.',
            'Processing subscription payments, invoicing, taxes, and fraud prevention through our payment partners.',
            'Showing localized information, such as prices converted to your local currency.',
            'Improving the Service, diagnosing problems, and developing new features.',
            'Sending service messages (verification codes, billing notices, security alerts) and, with your consent, product news. You can opt out of non-essential messages at any time.',
            'Complying with law, enforcing our Terms, and protecting nudgeo, our users, and the public.',
          ]}
        />
        <p>
          Where the law requires a legal basis (for example under the GDPR), we rely on:
          performance of a contract (running your account), legitimate interests (securing
          and improving the Service), consent (marketing, optional features), and legal
          obligation (tax and accounting records).
        </p>
      </LegalSection>

      <LegalSection heading="4. AI features">
        <p>
          Some features can generate content for you, such as suggested event
          descriptions. Prompts for these features (for example, your event name and
          category) may be processed by third-party AI providers to produce the
          suggestion. Do not include sensitive personal data in content you ask AI to
          write. AI output is a draft: you are responsible for reviewing it before
          publishing.
        </p>
      </LegalSection>

      <LegalSection heading="5. Who we share data with">
        <p>
          We do not sell personal data. We share it only with service providers who help
          us run the Service, under contracts that limit their use of it:
        </p>
        <LegalList
          items={[
            <span key="1">
              <strong>Infrastructure and database</strong> (e.g. Supabase and our hosting
              providers) to store and serve the Service.
            </span>,
            <span key="2">
              <strong>Email delivery</strong> (e.g. Resend) to send verification codes and
              creator updates.
            </span>,
            <span key="3">
              <strong>Payments</strong> (e.g. Razorpay) to process subscriptions and
              purchases. Razorpay processes your payment data under its own privacy
              policy.
            </span>,
            <span key="4">
              <strong>Media</strong> (e.g. Unsplash) when you search for and embed cover
              photos; searches are sent to the photo provider.
            </span>,
            <span key="5">
              <strong>Professional advisers and authorities</strong> where required by
              law, legal process, or to protect rights, safety, and the integrity of the
              Service.
            </span>,
            <span key="6">
              <strong>A successor entity</strong> if we go through a merger, acquisition,
              or asset sale; this Policy will continue to apply to data transferred.
            </span>,
          ]}
        />
        <p>
          Creators receive the subscriber data collected through their own pages. How a
          creator uses their list is governed by the creator's own practices; subscribers
          should contact the creator with questions about a specific list.
        </p>
      </LegalSection>

      <LegalSection heading="6. International transfers">
        <p>
          Our providers may store and process data in countries other than yours,
          including India, the United States, and the European Union. Where required, we
          use appropriate safeguards for such transfers, such as standard contractual
          clauses or equivalent mechanisms.
        </p>
      </LegalSection>

      <LegalSection heading="7. Retention">
        <p>
          We keep personal data for as long as your account is active or as needed to
          provide the Service, then delete or anonymize it within a reasonable period,
          except where we must keep it longer for legal, tax, accounting, security, or
          dispute-resolution purposes. Verification codes expire within minutes and are
          purged automatically. Creators who delete an event also delete its subscriber
          list from our systems, subject to backup cycles.
        </p>
      </LegalSection>

      <LegalSection heading="8. Security">
        <p>
          We protect data with industry-standard measures: encryption in transit,
          password hashing, scoped database access, and least-privilege infrastructure.
          No method of transmission or storage is completely secure; we cannot guarantee
          absolute security, and you use the Service at your own risk. If we learn of a
          breach affecting your personal data, we will notify you and the relevant
          authorities as required by law.
        </p>
      </LegalSection>

      <LegalSection heading="9. Cookies and similar technologies">
        <p>
          We currently use only essential cookies: session cookies that keep you signed
          in and security cookies that protect against request forgery. These are
          strictly necessary and cannot be switched off in the product. If we later adopt
          analytics or marketing cookies, we will update this Policy and, where required,
          ask for consent first.
        </p>
      </LegalSection>

      <LegalSection heading="10. Your rights">
        <p>
          Depending on where you live (including under the EU/UK GDPR, India's Digital
          Personal Data Protection Act 2023, and the California Consumer Privacy Act),
          you may have rights to:
        </p>
        <LegalList
          items={[
            'access the personal data we hold about you and receive a copy;',
            'correct inaccurate data, or complete incomplete data;',
            'delete your data ("right to erasure");',
            'restrict or object to certain processing, including direct marketing;',
            'data portability, in a structured, machine-readable format;',
            'withdraw consent at any time, without affecting prior processing;',
            'nominate a person to exercise your rights in case of death or incapacity (India);',
            'complain to your data protection authority.',
          ]}
        />
        <p>
          To exercise any right, email{' '}
          <a href="mailto:privacy@nudgeo.app">privacy@nudgeo.app</a>. We respond within
          the timelines required by applicable law. If you are a subscriber on a
          creator's list, we may redirect your request to that creator, since the list is
          theirs; you can always unsubscribe directly using the link in any email.
        </p>
      </LegalSection>

      <LegalSection heading="11. Children">
        <p>
          The Service is not directed to children under 13 (or the higher age your local
          law sets for consenting to data processing, such as 18 for entering payment
          contracts in India). We do not knowingly collect data from children. If you
          believe a child has provided us data, contact us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection heading="12. Changes to this Policy">
        <p>
          We may update this Policy as the Service, technology, or law changes. We will
          post the new version here and update the date above; for material changes we
          will give you additional notice (for example by email or an in-product notice).
          Continued use of the Service after changes take effect means you accept the
          updated Policy.
        </p>
      </LegalSection>

      <LegalSection heading="13. Contact and grievance officer">
        <p>
          Privacy questions, requests, and complaints:{' '}
          <a href="mailto:privacy@nudgeo.app">privacy@nudgeo.app</a>. In accordance with
          Indian law, our designated grievance officer can be reached at the same
          address; we acknowledge complaints within 48 hours and aim to resolve them
          within applicable statutory timelines.
        </p>
      </LegalSection>
    </LegalShell>
  )
}
