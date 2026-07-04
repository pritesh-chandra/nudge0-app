'use client'
import { useEffect, useMemo, useState } from 'react'
import {
  Broadcast,
  CheckCircle,
  Copy,
  Globe,
  InstagramLogo,
  LinkSimple,
  ShareNetwork,
  TiktokLogo,
  Trophy,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import { joinWaitlist } from '@/app/[slug]/actions'
import { appUrl, publicEventUrl } from '@/lib/urls'

type ProductLink = { label: string; url: string }
type Socials = Partial<Record<'instagram' | 'tiktok' | 'x' | 'youtube' | 'website', string>>

export type PublicEvent = {
  slug: string
  name: string
  description: string | null
  color: string
  coverUrl: string | null
  launchAt: string | null
  productLinks: ProductLink[]
  socials: Socials
  signupGoal: number | null
  referralsEnabled: boolean
  liveCountEnabled: boolean
  status: string
}

const SOCIAL_META = {
  instagram: { icon: InstagramLogo, url: (h: string) => `https://instagram.com/${h}` },
  tiktok: { icon: TiktokLogo, url: (h: string) => `https://tiktok.com/@${h}` },
  x: { icon: XLogo, url: (h: string) => `https://x.com/${h}` },
  youtube: { icon: YoutubeLogo, url: (h: string) => `https://youtube.com/@${h}` },
  website: {
    icon: Globe,
    url: (h: string) => (/^https?:\/\//.test(h) ? h : `https://${h}`),
  },
} as const

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

/** Detects a coarse traffic source from UTM params or the referrer host. */
function detectSource(): string {
  if (typeof window === 'undefined') return 'direct'
  const params = new URLSearchParams(window.location.search)
  const utm = params.get('utm_source') || params.get('src')
  if (utm) return utm.toLowerCase().slice(0, 40)
  const ref = document.referrer
  if (!ref) return 'direct'
  try {
    const host = new URL(ref).hostname.replace(/^www\./, '')
    if (host.includes('tiktok')) return 'tiktok'
    if (host.includes('instagram')) return 'instagram'
    if (host === 'x.com' || host.includes('twitter') || host === 't.co') return 'x'
    if (host.includes('youtube') || host.includes('youtu.be')) return 'youtube'
    if (host.includes('nudgeo')) return 'direct'
    return host.slice(0, 40)
  } catch {
    return 'direct'
  }
}

function Countdown({ launchAt }: { launchAt: string }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, new Date(launchAt).getTime() - now)
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
            <span className="text-2xl font-extrabold leading-none tabular-nums">{u.value}</span>
            <span className="mt-1 text-[11px] font-semibold text-ink-soft">{u.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function LiveBadge({ seed }: { seed: number }) {
  // Approximate presence (real websocket presence is a later upgrade)
  const [count, setCount] = useState(() => Math.max(6, Math.round(seed * 0.02) + 11))
  useEffect(() => {
    const id = setInterval(
      () => setCount((c) => Math.max(4, c + Math.floor(Math.random() * 7) - 3)),
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

export function PublicEventPage({
  event,
  creatorName,
  initialCount,
  referralId,
}: {
  event: PublicEvent
  creatorName: string
  initialCount: number
  referralId: string | null
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState(initialCount)
  const [agreed, setAgreed] = useState(false)
  const [joined, setJoined] = useState<{ referralId: string; alreadyJoined: boolean } | null>(
    null,
  )
  const [copied, setCopied] = useState(false)

  const buttonText = event.color === '#201D15' ? '#FAF6ED' : '#201D15'
  const socials = useMemo(
    () =>
      (Object.entries(event.socials) as Array<[keyof typeof SOCIAL_META, string]>).filter(
        ([, v]) => v?.trim(),
      ),
    [event.socials],
  )
  const links = useMemo(() => event.productLinks.filter((l) => l.label?.trim()), [event.productLinks])

  const shareUrl = joined ? `${publicEventUrl(event.slug)}?ref=${joined.referralId}` : ''

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await joinWaitlist({
      slug: event.slug,
      name,
      email,
      ref: referralId,
      source: detectSource(),
      agreedToTerms: agreed,
    })
    setLoading(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setCount(result.count)
    setJoined({ referralId: result.referralId, alreadyJoined: result.alreadyJoined })
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard blocked; the input is selectable as a fallback
    }
  }

  const goalPct =
    event.signupGoal && event.signupGoal > 0
      ? Math.min(100, Math.round((count / event.signupGoal) * 100))
      : null

  return (
    <div className="min-h-[100dvh]">
      {/* Cover */}
      <div
        className="relative flex h-64 items-end justify-center sm:h-72"
        style={{ backgroundColor: event.color }}
      >
        {event.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        {event.liveCountEnabled && (
          <div className="absolute bottom-4">
            <LiveBadge seed={count} />
          </div>
        )}
      </div>

      <div className="mx-auto max-w-xl px-6 pb-20">
        <div className="-mt-8 flex justify-center">
          <span className="grid size-16 place-items-center rounded-full border-4 border-cream bg-white text-xl font-extrabold shadow-sm">
            {creatorName.charAt(0).toUpperCase()}
          </span>
        </div>
        <p className="mt-2 text-center text-sm font-semibold text-ink-soft">{creatorName}</p>

        <h1 className="mt-4 text-center text-4xl font-extrabold tracking-tight md:text-5xl">
          {event.name}
        </h1>
        {event.description && (
          <p className="mx-auto mt-4 max-w-[48ch] text-center text-lg leading-relaxed text-ink-soft">
            {event.description}
          </p>
        )}

        {event.launchAt && <Countdown launchAt={event.launchAt} />}

        {/* Signup / success */}
        <div className="mt-8">
          {joined ? (
            <div className="grid place-items-center rounded-3xl border border-line bg-white px-6 py-9 text-center">
              <CheckCircle size={44} weight="fill" style={{ color: event.color }} />
              <p className="mt-3 text-xl font-bold">
                {joined.alreadyJoined ? "You're already on the list!" : "You're on the list!"}
              </p>
              <p className="mt-1.5 text-sm text-ink-soft">
                <span className="font-bold text-ink tabular-nums">{count.toLocaleString()}</span>{' '}
                {count === 1 ? 'person is' : 'people are'} waiting for {event.name}.
              </p>

              {event.referralsEnabled && shareUrl && (
                <div className="mt-6 w-full">
                  <p className="flex items-center justify-center gap-1.5 text-sm font-semibold">
                    <ShareNetwork size={15} weight="bold" />
                    Share your link to move up the list
                  </p>
                  <div className="mt-2 flex gap-2">
                    <input
                      readOnly
                      value={shareUrl}
                      onFocus={(e) => e.currentTarget.select()}
                      className="min-w-0 flex-1 rounded-[14px] border border-line bg-cream px-3 py-2.5 text-sm text-ink-soft"
                    />
                    <button
                      type="button"
                      onClick={onCopy}
                      className="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold"
                      style={{ backgroundColor: event.color, color: buttonText }}
                    >
                      <Copy size={14} weight="bold" />
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : event.status === 'draft' ? (
            <div className="grid place-items-center rounded-3xl border border-line bg-white px-6 py-10 text-center">
              <p className="text-lg font-bold">This page is not open yet.</p>
              <p className="mt-1.5 max-w-[36ch] text-sm text-ink-soft">
                Check back soon, {creatorName} is still setting things up.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-3 rounded-3xl border border-line bg-white p-6">
              <label htmlFor="fan-name" className="sr-only">
                Your name
              </label>
              <input
                id="fan-name"
                name="name"
                placeholder="Your name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-[14px] border border-line bg-cream px-4 py-3 text-[15px] focus:outline-2 focus:outline-sun-deep"
              />
              <label htmlFor="fan-email" className="sr-only">
                Your email
              </label>
              <input
                id="fan-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[14px] border border-line bg-cream px-4 py-3 text-[15px] focus:outline-2 focus:outline-sun-deep"
              />
              <label htmlFor="fan-terms" className="flex items-start gap-2.5 text-left text-xs leading-relaxed text-ink-soft">
                <input
                  id="fan-terms"
                  name="terms"
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 rounded border-line accent-ink"
                />
                <span>
                  I agree to nudgeo's{' '}
                  <a
                    href={appUrl('/terms')}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-ink underline underline-offset-2"
                  >
                    Terms
                  </a>{' '}
                  and{' '}
                  <a
                    href={appUrl('/privacy')}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-ink underline underline-offset-2"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
              {error && (
                <p role="alert" className="text-sm font-medium text-[#B3261E]">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !agreed}
                className="rounded-full py-3.5 text-base font-semibold transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
                style={{ backgroundColor: event.color, color: buttonText }}
              >
                {loading ? 'Joining…' : 'Notify me'}
              </button>
              <p className="text-center text-xs text-ink-soft">
                <span className="font-bold text-ink tabular-nums">{count.toLocaleString()}</span>{' '}
                already waiting. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>

        {/* Signup goal */}
        {goalPct !== null && event.signupGoal && (
          <div className="mt-6 rounded-3xl border border-line bg-white p-6">
            <div className="flex items-baseline justify-between text-sm">
              <span className="flex items-center gap-1.5 font-bold">
                <Trophy size={15} weight="fill" style={{ color: event.color }} />
                Spots claimed
              </span>
              <span className="text-ink-soft tabular-nums">
                {count.toLocaleString()} / {event.signupGoal.toLocaleString()}
              </span>
            </div>
            <div className="mt-2.5 h-3 overflow-hidden rounded-full bg-cream-deep">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${Math.max(goalPct, 1)}%`, backgroundColor: event.color }}
              />
            </div>
          </div>
        )}

        {/* Product links */}
        {links.length > 0 && (
          <div className="mt-6 grid gap-2.5">
            {links.map((link, i) => (
              <a
                key={`${link.label}-${i}`}
                href={link.url}
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
              const meta = SOCIAL_META[key]
              const Icon = meta.icon
              return (
                <a
                  key={key}
                  href={meta.url(handle.replace(/^@/, ''))}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={key}
                  className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-cream-deep"
                >
                  <Icon size={20} weight="fill" />
                </a>
              )
            })}
          </div>
        )}

        {event.liveCountEnabled && !event.coverUrl && (
          <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-ink-soft">
            <Broadcast size={13} weight="bold" />
            Live visitor count
          </p>
        )}

        <p className="mt-12 text-center text-xs text-ink-soft">
          Powered by{' '}
          <a href="/" className="font-bold underline underline-offset-2 hover:text-ink">
            nudgeo
          </a>
        </p>
      </div>
    </div>
  )
}
