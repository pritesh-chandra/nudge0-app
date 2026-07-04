'use client'
import { useEffect, useState } from 'react'
import {
  Broadcast,
  CheckCircle,
  Globe,
  InstagramLogo,
  LinkSimple,
  ShareNetwork,
  TiktokLogo,
  X,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import type { ProductLink, Socials } from '@/app/dashboard/events/new/actions'

export type PreviewEvent = {
  name: string
  slug: string
  description: string
  color: string
  coverUrl: string | null
  launchDate: string
  productLinks: ProductLink[]
  socials: Socials
  signupGoal: number | null
  referralsEnabled: boolean
  liveCountEnabled: boolean
}

const SOCIAL_ICONS = {
  instagram: InstagramLogo,
  tiktok: TiktokLogo,
  x: XLogo,
  youtube: YoutubeLogo,
  website: Globe,
} as const

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function Countdown({ date, color }: { date: string; color: string }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, new Date(`${date}T00:00:00`).getTime() - now)
  if (diff === 0) return null

  const units = [
    { label: 'days', value: String(Math.floor(diff / 86_400_000)) },
    { label: 'hours', value: pad2(Math.floor(diff / 3_600_000) % 24) },
    { label: 'min', value: pad2(Math.floor(diff / 60_000) % 60) },
    { label: 'sec', value: pad2(Math.floor(diff / 1_000) % 60) },
  ]
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-center gap-2">
          {i > 0 && <span className="pb-5 text-2xl font-bold text-ink-soft/40">:</span>}
          <div className="grid min-w-16 place-items-center rounded-2xl bg-white px-3 py-2.5 shadow-sm">
            <span className="text-2xl font-extrabold leading-none tabular-nums">
              {u.value}
            </span>
            <span className="mt-1 text-[11px] font-semibold text-ink-soft">{u.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function LiveBadge() {
  const [count, setCount] = useState(23)
  useEffect(() => {
    const id = setInterval(
      () => setCount((c) => Math.max(8, c + Math.floor(Math.random() * 7) - 3)),
      3000,
    )
    return () => clearInterval(id)
  }, [])
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-sm font-bold shadow-sm backdrop-blur">
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4A7C59] opacity-60" />
        <span className="relative inline-flex size-2.5 rounded-full bg-[#4A7C59]" />
      </span>
      <span className="tabular-nums">{count}</span> here right now
    </span>
  )
}

export function EventFullPreview({
  event,
  creatorName,
  onClose,
}: {
  event: PreviewEvent
  creatorName: string
  onClose: () => void
}) {
  const [signedUp, setSignedUp] = useState<string | null>(null)
  const buttonText = event.color === '#201D15' ? '#FAF6ED' : '#201D15'
  const socials = Object.entries(event.socials).filter(([, v]) => v) as Array<
    [keyof typeof SOCIAL_ICONS, string]
  >

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = String(new FormData(e.currentTarget).get('fan-name') || 'friend')
    setSignedUp(name.split(' ')[0])
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-cream">
      {/* Preview chrome */}
      <div className="pointer-events-none sticky top-0 z-10 flex items-center justify-between p-4">
        <span className="pointer-events-auto rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream">
          Previewing nudgeo.app/{event.slug || 'your-event'}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="pointer-events-auto grid size-11 place-items-center rounded-full bg-ink text-cream transition-transform hover:scale-105"
        >
          <X size={20} weight="bold" />
        </button>
      </div>

      {/* Cover */}
      <div
        className="relative -mt-[76px] flex h-72 items-end justify-center"
        style={{ backgroundColor: event.color }}
      >
        {event.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.coverUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {event.liveCountEnabled && (
          <div className="absolute bottom-4">
            <LiveBadge />
          </div>
        )}
      </div>

      {/* Page body */}
      <div className="mx-auto max-w-xl px-6 pb-20">
        <div className="-mt-8 flex justify-center">
          <span className="grid size-16 place-items-center rounded-full border-4 border-cream bg-white text-xl font-extrabold shadow-sm">
            {creatorName.charAt(0).toUpperCase()}
          </span>
        </div>
        <p className="mt-2 text-center text-sm font-semibold text-ink-soft">{creatorName}</p>

        <h1 className="mt-4 text-center text-4xl font-extrabold tracking-tight md:text-5xl">
          {event.name || 'Your event name'}
        </h1>
        <p className="mx-auto mt-4 max-w-[48ch] text-center text-lg leading-relaxed text-ink-soft">
          {event.description || 'Your description shows up here.'}
        </p>

        {event.launchDate && <Countdown date={event.launchDate} color={event.color} />}

        {/* Signup */}
        <div className="mt-8">
          {signedUp ? (
            <div className="grid place-items-center rounded-3xl border border-line bg-white px-6 py-10 text-center">
              <CheckCircle size={44} weight="fill" style={{ color: event.color }} />
              <p className="mt-3 text-xl font-bold">You're on the list, {signedUp}!</p>
              <p className="mt-1.5 max-w-[38ch] text-sm text-ink-soft">
                This is a preview. Signups start counting once the event is published.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="grid gap-3 rounded-3xl border border-line bg-white p-6"
            >
              <label htmlFor="fan-name" className="sr-only">
                Your name
              </label>
              <input
                id="fan-name"
                name="fan-name"
                placeholder="Your name"
                autoComplete="name"
                required
                className="w-full rounded-[14px] border border-line bg-cream px-4 py-3 text-[15px] focus:outline-2 focus:outline-sun-deep"
              />
              <label htmlFor="fan-email" className="sr-only">
                Your email
              </label>
              <input
                id="fan-email"
                name="fan-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-[14px] border border-line bg-cream px-4 py-3 text-[15px] focus:outline-2 focus:outline-sun-deep"
              />
              <button
                type="submit"
                className="rounded-full py-3.5 text-base font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ backgroundColor: event.color, color: buttonText }}
              >
                Notify me
              </button>
              {event.referralsEnabled && (
                <p className="flex items-center justify-center gap-1.5 text-xs text-ink-soft">
                  <ShareNetwork size={13} weight="bold" />
                  Refer friends after joining to climb the list.
                </p>
              )}
            </form>
          )}
        </div>

        {/* Signup goal */}
        {event.signupGoal && event.signupGoal > 0 && (
          <div className="mt-6 rounded-3xl border border-line bg-white p-6">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-bold">Spots claimed</span>
              <span className="text-ink-soft tabular-nums">0 / {event.signupGoal.toLocaleString()}</span>
            </div>
            <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-cream-deep">
              <div className="h-full w-1 rounded-full" style={{ backgroundColor: event.color }} />
            </div>
          </div>
        )}

        {/* Product links */}
        {event.productLinks.filter((l) => l.label.trim()).length > 0 && (
          <div className="mt-6 grid gap-2.5">
            {event.productLinks
              .filter((l) => l.label.trim())
              .map((link, i) => (
                <a
                  key={`${link.label}-${i}`}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-line bg-white py-3.5 text-base font-semibold transition-colors hover:bg-cream-deep"
                >
                  <LinkSimple size={16} weight="bold" />
                  {link.label}
                </a>
              ))}
          </div>
        )}

        {/* Socials */}
        {socials.length > 0 && (
          <div className="mt-8 flex justify-center gap-3">
            {socials.map(([key, handle]) => {
              const Icon = SOCIAL_ICONS[key]
              return (
                <span
                  key={key}
                  title={`${key}: ${handle}`}
                  className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink"
                >
                  <Icon size={20} weight="fill" />
                </span>
              )
            })}
          </div>
        )}

        {event.liveCountEnabled && !event.coverUrl && (
          <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-ink-soft">
            <Broadcast size={13} weight="bold" />
            Live visitor count shows on the cover once published.
          </p>
        )}

        <p className="mt-12 text-center text-xs text-ink-soft">
          Powered by <span className="font-bold">nudgeo</span>
        </p>
      </div>
    </div>
  )
}
