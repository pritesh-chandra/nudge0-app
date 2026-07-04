'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { CalendarPlus, Crown, PaperPlaneRight } from '@phosphor-icons/react'
import { saveTemplate } from '@/app/dashboard/emails/actions'
import { publicEventHost } from '@/lib/urls'

type EventLite = { id: string; name: string; slug: string; status: string }
type SavedTemplate = { event_id: string; template_key: string; subject: string; body: string }

const TEMPLATES = [
  {
    key: 'welcome',
    name: 'Signup confirmation',
    description: 'Sent the moment a fan joins the waitlist.',
    subject: "You're on the list for {{event_name}}",
    body: `Hey {{first_name}},

You're in. {{event_name}} just got one fan closer to launch.

We'll email you the moment there's news. Until then, share your link so friends can join too:
{{page_link}}

{{creator_name}}`,
  },
  {
    key: 'update',
    name: 'Update announcement',
    description: 'Sent when you post an update to this event.',
    subject: 'News on {{event_name}}',
    body: `Hey {{first_name}},

[Write your update here.]

Thanks for waiting,
{{creator_name}}`,
  },
  {
    key: 'launch',
    name: 'Launch day',
    description: 'Sent when the event goes live.',
    subject: '{{event_name}} is live',
    body: `Hey {{first_name}},

The wait is over. {{event_name}} is live right now:
{{page_link}}

You signed up early, so you get first pick.

{{creator_name}}`,
  },
  {
    key: 'reminder',
    name: 'Last call',
    description: 'Sent shortly before the event closes.',
    subject: 'Last call for {{event_name}}',
    body: `Hey {{first_name}},

{{event_name}} closes soon. This is the last email before the doors shut:
{{page_link}}

{{creator_name}}`,
  },
] as const

const VARIABLES = ['{{first_name}}', '{{event_name}}', '{{creator_name}}', '{{page_link}}']

type Draft = { subject: string; body: string }

function render(text: string, event: EventLite, creatorName: string) {
  return text
    .replaceAll('{{first_name}}', 'Anaïs')
    .replaceAll('{{event_name}}', event.name)
    .replaceAll('{{creator_name}}', creatorName)
    .replaceAll('{{page_link}}', publicEventHost(event.slug))
}

function LockedState() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Email templates</h1>
      <p className="mt-2 text-ink-soft">Customize what subscribers receive, per event.</p>
      <div className="mt-8 grid place-items-center rounded-3xl border border-line bg-white px-6 py-16 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-sun text-ink">
          <Crown size={28} weight="fill" />
        </span>
        <h2 className="mt-5 text-xl font-bold tracking-tight">A Pro feature</h2>
        <p className="mt-2 max-w-[44ch] leading-relaxed text-ink-soft">
          Custom email templates are available on Creator and Studio. Upgrade to write your
          own signup, update, launch, and last-call emails per event.
        </p>
        <Link
          href="/#pricing"
          className="mt-6 flex items-center gap-1.5 rounded-full bg-sun px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98]"
        >
          <Crown size={14} weight="fill" />
          See plans
        </Link>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Email templates</h1>
      <p className="mt-2 text-ink-soft">Customize what subscribers receive, per event.</p>
      <div className="mt-8 grid place-items-center rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-sun-soft text-sun-deep">
          <CalendarPlus size={28} weight="bold" />
        </span>
        <h2 className="mt-5 text-xl font-bold tracking-tight">No events yet</h2>
        <p className="mt-2 max-w-[40ch] leading-relaxed text-ink-soft">
          Create an event first, then tailor the emails its subscribers receive.
        </p>
        <Link
          href="/dashboard/events/new"
          className="mt-6 rounded-full bg-sun px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98]"
        >
          Create an event
        </Link>
      </div>
    </div>
  )
}

export function EmailTemplatesView({
  creatorName,
  isPro,
  events,
  saved,
}: {
  creatorName: string
  isPro: boolean
  events: EventLite[]
  saved: SavedTemplate[]
}) {
  if (!isPro) return <LockedState />
  if (events.length === 0) return <EmptyState />
  return <Editor creatorName={creatorName} events={events} saved={saved} />
}

function Editor({
  creatorName,
  events,
  saved,
}: {
  creatorName: string
  events: EventLite[]
  saved: SavedTemplate[]
}) {
  // Persisted drafts keyed by "eventId:templateKey"; seed from DB
  const seeded: Record<string, Draft> = {}
  for (const t of saved) {
    seeded[`${t.event_id}:${t.template_key}`] = { subject: t.subject, body: t.body }
  }

  const [eventId, setEventId] = useState(events[0].id)
  const [templateKey, setTemplateKey] = useState<string>(TEMPLATES[0].key)
  const [drafts, setDrafts] = useState<Record<string, Draft>>(seeded)
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set(Object.keys(seeded)))
  const [status, setStatus] = useState<{ key: string; ok: boolean; message: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const event = events.find((e) => e.id === eventId)!
  const template = TEMPLATES.find((t) => t.key === templateKey)!
  const draftKey = `${eventId}:${templateKey}`
  const draft = drafts[draftKey] ?? { subject: template.subject, body: template.body }

  function update(patch: Partial<Draft>) {
    setStatus(null)
    setDrafts((d) => ({ ...d, [draftKey]: { ...draft, ...patch } }))
  }

  function insertVariable(token: string) {
    const el = bodyRef.current
    if (!el) return
    const start = el.selectionStart ?? draft.body.length
    const end = el.selectionEnd ?? draft.body.length
    update({ body: draft.body.slice(0, start) + token + draft.body.slice(end) })
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + token.length, start + token.length)
    })
  }

  async function onSave() {
    setSaving(true)
    setStatus(null)
    const result = await saveTemplate({
      eventId,
      templateKey,
      subject: draft.subject,
      body: draft.body,
    })
    setSaving(false)
    if (!result.ok) {
      setStatus({ key: draftKey, ok: false, message: result.message })
      return
    }
    setSavedKeys((s) => new Set(s).add(draftKey))
    setStatus({ key: draftKey, ok: true, message: `Saved for ${event.name}.` })
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Email templates</h1>
          <p className="mt-2 text-ink-soft">What subscribers receive, customized per event.</p>
        </div>
        <div>
          <label htmlFor="template-event-select" className="sr-only">
            Event
          </label>
          <select
            id="template-event-select"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink focus:outline-2 focus:outline-sun-deep"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} ({e.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Template list */}
        <nav className="lg:col-span-1">
          <div className="grid gap-2">
            {TEMPLATES.map((t) => {
              const active = t.key === templateKey
              const customized = savedKeys.has(`${eventId}:${t.key}`)
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTemplateKey(t.key)}
                  aria-pressed={active}
                  className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-ink text-cream'
                      : 'border border-line bg-white text-ink hover:bg-cream-deep'
                  }`}
                >
                  {t.name}
                  {customized && (
                    <span className={`mt-0.5 block text-xs font-medium ${active ? 'text-sun' : 'text-sun-deep'}`}>
                      Saved for this event
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Editor */}
        <section className="rounded-3xl border border-line bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-bold tracking-tight">{template.name}</h2>
          <p className="mt-1 text-sm text-ink-soft">{template.description}</p>

          <div className="mt-5 grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="template-subject" className="text-sm font-semibold">
                Subject
              </label>
              <input
                id="template-subject"
                className="w-full rounded-[14px] border border-line bg-white px-4 py-2.5 text-[15px] focus:outline-2 focus:outline-sun-deep"
                value={draft.subject}
                onChange={(e) => update({ subject: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="template-body" className="text-sm font-semibold">
                Body
              </label>
              <textarea
                id="template-body"
                ref={bodyRef}
                className="min-h-64 w-full resize-y rounded-[14px] border border-line bg-white px-4 py-2.5 text-[15px] leading-relaxed focus:outline-2 focus:outline-sun-deep"
                value={draft.body}
                onChange={(e) => update({ body: e.target.value })}
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-ink-soft">Insert a variable</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {VARIABLES.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => insertVariable(v)}
                    className="rounded-full bg-cream-deep px-3 py-1.5 font-mono text-xs font-semibold text-ink transition-colors hover:bg-sun-soft"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="rounded-full bg-sun px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98] disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save template'}
              </button>
              {status && status.key === draftKey && (
                <p
                  role="status"
                  className={`text-sm font-medium ${status.ok ? 'text-[#4A7C59]' : 'text-[#B3261E]'}`}
                >
                  {status.message}
                </p>
              )}
            </div>
            <p className="text-xs text-ink-soft">
              Saved to your account, per event. Sending runs off these when you post an
              update.
            </p>
          </div>
        </section>

        {/* Rendered preview */}
        <section className="lg:col-span-2">
          <p className="text-sm font-semibold text-ink-soft">
            Preview, as Anaïs would receive it
          </p>
          <div className="sticky top-24 mt-3 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_24px_60px_-30px_rgba(93,79,26,0.3)]">
            <div className="border-b border-line bg-cream-deep/60 px-6 py-4 text-sm">
              <p>
                <span className="text-ink-soft">From:</span>{' '}
                <span className="font-semibold">{creatorName}</span>{' '}
                <span className="text-ink-soft">via nudgeo</span>
              </p>
              <p className="mt-1">
                <span className="text-ink-soft">To:</span> Anaïs Fontaine
              </p>
              <p className="mt-2 font-bold">{render(draft.subject, event, creatorName)}</p>
            </div>
            <div className="whitespace-pre-line px-6 py-5 text-[15px] leading-relaxed">
              {render(draft.body, event, creatorName)}
            </div>
            <div className="border-t border-line px-6 py-4">
              <p className="flex items-center gap-1.5 text-xs text-ink-soft">
                <PaperPlaneRight size={12} weight="bold" />
                Sent with nudgeo. Unsubscribe with one click.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
