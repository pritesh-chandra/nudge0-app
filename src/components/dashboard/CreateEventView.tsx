'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowsOut,
  CheckCircle,
  Crown,
  Globe,
  Image as ImageIcon,
  InstagramLogo,
  MagnifyingGlass,
  Plus,
  Sparkle,
  TiktokLogo,
  Trash,
  UploadSimple,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react'
import {
  createEvent,
  generateDescription,
  searchCoverPhotos,
  type CoverPhoto,
  type ProductLink,
  type Socials,
} from '@/app/dashboard/events/new/actions'
import { EventFullPreview } from './EventFullPreview'

const CATEGORIES = [
  'Product drop',
  'Album release',
  'Course cohort',
  'App beta',
  'Pop-up event',
  'Newsletter launch',
  'Book preorder',
  'Podcast season',
]

const BRAND_COLORS = ['#FFD43B', '#E2725B', '#4A7C59', '#6C7FD8', '#201D15']

const SOCIAL_FIELDS = [
  { key: 'instagram', label: 'Instagram', icon: InstagramLogo, placeholder: '@yourhandle' },
  { key: 'tiktok', label: 'TikTok', icon: TiktokLogo, placeholder: '@yourhandle' },
  { key: 'x', label: 'X', icon: XLogo, placeholder: '@yourhandle' },
  { key: 'youtube', label: 'YouTube', icon: YoutubeLogo, placeholder: '@yourchannel' },
  { key: 'website', label: 'Website', icon: Globe, placeholder: 'yoursite.com' },
] as const

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40)
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function LaunchCountdown({ date }: { date: string }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const target = new Date(`${date}T00:00:00`).getTime()
  const diff = Math.max(0, target - now)
  if (diff === 0) {
    return (
      <p className="mt-3 inline-block rounded-full bg-sun px-3 py-1 text-xs font-bold">
        Live now
      </p>
    )
  }

  const units = [
    { label: 'days', value: String(Math.floor(diff / 86_400_000)) },
    { label: 'hours', value: pad2(Math.floor(diff / 3_600_000) % 24) },
    { label: 'min', value: pad2(Math.floor(diff / 60_000) % 60) },
    { label: 'sec', value: pad2(Math.floor(diff / 1_000) % 60) },
  ]
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold text-ink-soft">Launching in</p>
      <div className="mt-1.5 flex items-center gap-1.5">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-1.5">
            {i > 0 && <span className="pb-4 text-lg font-bold text-ink-soft/50">:</span>}
            <div className="grid min-w-12 place-items-center rounded-xl bg-cream-deep px-2 py-1.5">
              <span className="text-lg font-extrabold leading-none tabular-nums">
                {unit.value}
              </span>
              <span className="mt-1 text-[10px] font-semibold text-ink-soft">
                {unit.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-ink-soft/70">in your timezone, {timeZone}</p>
    </div>
  )
}

function LField({
  id,
  label,
  hint,
  labelEnd,
  children,
}: {
  id: string
  label: string
  hint?: string
  labelEnd?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        {labelEnd}
      </div>
      {children}
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </div>
  )
}

function Toggle({
  id,
  checked,
  onChange,
  disabled,
}: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-sun' : 'bg-cream-deep'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <span
        className={`absolute top-1 size-5 rounded-full bg-white shadow transition-[left] ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  )
}

const inputClass =
  'w-full rounded-[14px] border border-line bg-white px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/60 focus:outline-2 focus:outline-sun-deep'

export function CreateEventView({
  creatorName,
  plan,
}: {
  creatorName: string
  plan: 'free' | 'creator' | 'studio'
}) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [launchDate, setLaunchDate] = useState('')
  const [color, setColor] = useState(BRAND_COLORS[0])

  // AI description
  const [generating, setGenerating] = useState(false)
  const [aiNote, setAiNote] = useState<string | null>(null)

  // Cover photo
  const [coverTab, setCoverTab] = useState<'unsplash' | 'upload'>('unsplash')
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [coverCredit, setCoverCredit] = useState<string | null>(null)
  const [photoQuery, setPhotoQuery] = useState('')
  const [photos, setPhotos] = useState<CoverPhoto[]>([])
  const [searching, setSearching] = useState(false)
  const [photoSource, setPhotoSource] = useState<'unsplash' | 'placeholder' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Product links, socials, extras
  const [productLinks, setProductLinks] = useState<ProductLink[]>([])
  const [socials, setSocials] = useState<Socials>({})
  const [goalEnabled, setGoalEnabled] = useState(false)
  const [signupGoal, setSignupGoal] = useState(500)
  const [referralsEnabled, setReferralsEnabled] = useState(true)
  const [liveCountEnabled, setLiveCountEnabled] = useState(false)

  const [fullPreview, setFullPreview] = useState(false)
  const [published, setPublished] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const effectiveSlug = slugTouched ? slug : slugify(name)
  const isPro = plan !== 'free'
  const coverIsUpload = coverUrl?.startsWith('data:') ?? false

  const previewEvent = {
    name,
    slug: effectiveSlug,
    description,
    color,
    coverUrl,
    launchDate,
    productLinks,
    socials,
    signupGoal: goalEnabled ? signupGoal : null,
    referralsEnabled,
    liveCountEnabled,
  }

  async function onGenerate() {
    setGenerating(true)
    setAiNote(null)
    const result = await generateDescription({ name, category })
    setDescription(result.description)
    setAiNote(
      result.source === 'ai' ? 'Written by AI. Edit it to taste.' : 'AI was busy, so here is a starter. Edit it to taste.',
    )
    setGenerating(false)
  }

  async function onSearchPhotos(query: string) {
    setSearching(true)
    const result = await searchCoverPhotos(query)
    setPhotos(result.photos)
    setPhotoSource(result.source)
    setSearching(false)
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCoverUrl(String(reader.result))
      setCoverCredit(null)
    }
    reader.readAsDataURL(file)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)
    setSubmitting(true)
    const result = await createEvent({
      name,
      slug: effectiveSlug,
      description,
      category,
      launchDate,
      color,
      coverUrl,
      productLinks,
      socials,
      signupGoal: goalEnabled ? signupGoal : null,
      referralsEnabled,
      liveCountEnabled: isPro && liveCountEnabled,
    })
    setSubmitting(false)
    if (!result.ok) {
      setServerError(result.message)
      return
    }
    setPublished(true)
  }

  if (published) {
    return (
      <div className="mx-auto grid max-w-2xl place-items-center py-20 text-center">
        <CheckCircle size={56} weight="fill" className="text-sun-deep" />
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight">Your page is ready.</h1>
        <p className="mt-3 max-w-[44ch] leading-relaxed text-ink-soft">
          <span className="font-semibold text-ink">{name || 'Your event'}</span> is saved and
          lives at{' '}
          <span className="rounded-full bg-cream-deep px-3 py-1 font-semibold text-ink">
            nudgeo.app/{effectiveSlug || 'your-event'}
          </span>
        </p>
        <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-ink-soft">
          The public page itself goes live when subscriber signups ship.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-sun px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98]"
          >
            Back to home
          </Link>
          <button
            type="button"
            onClick={() => setPublished(false)}
            className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/50"
          >
            Edit event
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      {fullPreview && (
        <EventFullPreview
          event={previewEvent}
          creatorName={creatorName}
          onClose={() => setFullPreview(false)}
        />
      )}

      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Create an event</h1>
      <p className="mt-2 text-ink-soft">
        Set up the waitlist page your fans will see. You can change everything later.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-5">
        <form className="grid gap-6 lg:col-span-3" onSubmit={onSubmit}>
          <LField id="event-name" label="Event name">
            <input
              id="event-name"
              className={inputClass}
              placeholder="Fieldnotes, Vol. 3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </LField>

          <LField id="event-slug" label="Page link" hint="Letters, numbers, and dashes only.">
            <div className="flex items-center">
              <span className="rounded-l-[14px] border border-r-0 border-line bg-cream-deep px-4 py-2.5 text-[15px] text-ink-soft">
                nudgeo.app/
              </span>
              <input
                id="event-slug"
                className={`${inputClass} rounded-l-none`}
                placeholder="fieldnotes-3"
                value={effectiveSlug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setSlug(slugify(e.target.value))
                }}
                required
              />
            </div>
          </LField>

          <LField
            id="event-description"
            label="Description"
            labelEnd={
              <button
                type="button"
                onClick={onGenerate}
                disabled={generating}
                className="flex items-center gap-1.5 rounded-full bg-sun-soft px-3.5 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-sun disabled:opacity-60"
              >
                <Sparkle size={13} weight="fill" />
                {generating ? 'Writing…' : 'Generate with AI'}
              </button>
            }
            hint={aiNote ?? undefined}
          >
            <textarea
              id="event-description"
              className={`${inputClass} min-h-28 resize-y`}
              placeholder="One or two sentences that make people want in."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
            />
          </LField>

          <div className="grid gap-6 sm:grid-cols-2">
            <LField id="event-category" label="Category">
              <select
                id="event-category"
                className={inputClass}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </LField>

            <LField
              id="event-date"
              label="Launch date"
              hint="Optional. Shows a live countdown on your page."
            >
              <input
                id="event-date"
                type="date"
                className={inputClass}
                value={launchDate}
                onChange={(e) => setLaunchDate(e.target.value)}
              />
            </LField>
          </div>

          <LField id="event-color" label="Brand color">
            <div id="event-color" className="flex items-center gap-2.5">
              {BRAND_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Use color ${c}`}
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                  className={`size-9 rounded-full border transition-transform hover:scale-105 ${
                    color === c ? 'border-ink ring-2 ring-ink/20' : 'border-line'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </LField>

          {/* Cover photo */}
          <div className="rounded-3xl border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Cover photo</p>
              <div className="flex rounded-full border border-line p-1">
                {(
                  [
                    { key: 'unsplash', label: 'Unsplash', icon: MagnifyingGlass },
                    { key: 'upload', label: 'Upload', icon: UploadSimple },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setCoverTab(tab.key)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                      coverTab === tab.key ? 'bg-ink text-cream' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    <tab.icon size={13} weight="bold" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {coverTab === 'unsplash' ? (
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    aria-label="Search photos"
                    className={inputClass}
                    placeholder="Search photos, e.g. darkroom prints"
                    value={photoQuery || name}
                    onChange={(e) => setPhotoQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        onSearchPhotos(photoQuery || name)
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onSearchPhotos(photoQuery || name)}
                    disabled={searching}
                    className="shrink-0 rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-px active:scale-[0.98] disabled:opacity-60"
                  >
                    {searching ? 'Searching…' : 'Search'}
                  </button>
                </div>
                {photos.length > 0 && (
                  <>
                    <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {photos.map((photo) => (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => {
                            setCoverUrl(photo.fullUrl)
                            setCoverCredit(photo.credit)
                          }}
                          className={`overflow-hidden rounded-xl border-2 transition-transform hover:scale-[1.03] ${
                            coverUrl === photo.fullUrl ? 'border-ink' : 'border-transparent'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.thumbUrl}
                            alt={photo.credit}
                            className="h-20 w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    {photoSource === 'placeholder' && (
                      <p className="mt-2 text-xs text-ink-soft">
                        Unsplash was unreachable, showing placeholder photos instead.
                      </p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="grid w-full place-items-center gap-1 rounded-2xl border border-dashed border-line px-6 py-8 text-center transition-colors hover:bg-cream"
                >
                  <ImageIcon size={26} className="text-ink-soft" />
                  <span className="text-sm font-semibold">Choose an image</span>
                  <span className="text-xs text-ink-soft">
                    Shows in previews now; upload storage ships later.
                  </span>
                </button>
              </div>
            )}

            {coverUrl && (
              <div className="mt-4 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverUrl} alt="" className="h-14 w-24 rounded-lg object-cover" />
                <div className="min-w-0 flex-1 text-xs text-ink-soft">
                  {coverCredit && <p className="truncate">Photo: {coverCredit}</p>}
                  {coverIsUpload && <p>Preview only until upload storage ships.</p>}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCoverUrl(null)
                    setCoverCredit(null)
                  }}
                  className="text-xs font-semibold text-ink-soft underline underline-offset-2 hover:text-ink"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Product links */}
          <div className="rounded-3xl border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Product links</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  Optional. Up to 5 buttons under your signup form.
                </p>
              </div>
              <button
                type="button"
                disabled={productLinks.length >= 5}
                onClick={() => setProductLinks((l) => [...l, { label: '', url: '' }])}
                className="flex items-center gap-1 rounded-full border border-line px-3.5 py-1.5 text-xs font-bold transition-colors hover:bg-cream disabled:opacity-40"
              >
                <Plus size={12} weight="bold" />
                Add link
              </button>
            </div>
            {productLinks.map((link, i) => (
              <div key={i} className="mt-3 flex gap-2">
                <input
                  aria-label={`Link ${i + 1} label`}
                  className={inputClass}
                  placeholder="Preorder the zine"
                  value={link.label}
                  onChange={(e) =>
                    setProductLinks((l) =>
                      l.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)),
                    )
                  }
                />
                <input
                  aria-label={`Link ${i + 1} URL`}
                  className={inputClass}
                  placeholder="https://…"
                  type="url"
                  value={link.url}
                  onChange={(e) =>
                    setProductLinks((l) =>
                      l.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)),
                    )
                  }
                />
                <button
                  type="button"
                  aria-label={`Remove link ${i + 1}`}
                  onClick={() => setProductLinks((l) => l.filter((_, j) => j !== i))}
                  className="grid size-10 shrink-0 place-items-center self-center rounded-full text-ink-soft transition-colors hover:bg-cream hover:text-ink"
                >
                  <Trash size={16} weight="bold" />
                </button>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="rounded-3xl border border-line bg-white p-6">
            <p className="text-sm font-semibold">Social accounts</p>
            <p className="mt-0.5 text-xs text-ink-soft">
              Shown as icons on your page so fans can follow you.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {SOCIAL_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cream-deep text-ink">
                    <Icon size={18} weight="fill" />
                  </span>
                  <input
                    aria-label={label}
                    className={inputClass}
                    placeholder={placeholder}
                    value={socials[key] ?? ''}
                    onChange={(e) => setSocials((s) => ({ ...s, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Engagement extras */}
          <div className="rounded-3xl border border-line bg-white p-6">
            <p className="text-sm font-semibold">Make it engaging</p>
            <div className="mt-4 grid gap-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <label htmlFor="toggle-referrals" className="text-sm font-semibold">
                    Referral leaderboard
                  </label>
                  <p className="text-xs text-ink-soft">
                    Fans get a share link after joining; top referrers climb the list.
                  </p>
                </div>
                <Toggle
                  id="toggle-referrals"
                  checked={referralsEnabled}
                  onChange={setReferralsEnabled}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <label htmlFor="toggle-goal" className="text-sm font-semibold">
                    Signup goal bar
                  </label>
                  <p className="text-xs text-ink-soft">
                    Show progress toward a target, like limited spots.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {goalEnabled && (
                    <input
                      aria-label="Signup goal"
                      type="number"
                      min={10}
                      max={100000}
                      value={signupGoal}
                      onChange={(e) => setSignupGoal(Number(e.target.value))}
                      className={`${inputClass} w-28 py-1.5`}
                    />
                  )}
                  <Toggle id="toggle-goal" checked={goalEnabled} onChange={setGoalEnabled} />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <label htmlFor="toggle-live" className="flex items-center gap-2 text-sm font-semibold">
                    Live visitor count
                    <span className="flex items-center gap-1 rounded-full bg-sun px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink">
                      <Crown size={10} weight="fill" />
                      Pro
                    </span>
                  </label>
                  <p className="text-xs text-ink-soft">
                    {isPro
                      ? 'Included in your plan. Shows "x here right now" on the cover.'
                      : 'Show fans how many people are on the page right now.'}
                  </p>
                  {!isPro && (
                    <Link
                      href="/#pricing"
                      className="mt-1 inline-block text-xs font-bold underline underline-offset-2"
                    >
                      Upgrade to unlock
                    </Link>
                  )}
                </div>
                <Toggle
                  id="toggle-live"
                  checked={isPro && liveCountEnabled}
                  onChange={setLiveCountEnabled}
                  disabled={!isPro}
                />
              </div>
            </div>
          </div>

          {serverError && (
            <p role="alert" className="text-sm font-medium text-[#B3261E]">
              {serverError}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-sun px-7 py-3 text-base font-semibold text-ink transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? 'Publishing…' : 'Publish event'}
            </button>
            <p className="text-sm text-ink-soft">
              Free plan: 1 live event, up to 100 signups.
            </p>
          </div>
        </form>

        {/* Live preview */}
        <aside className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-soft">Live preview</p>
            <button
              type="button"
              onClick={() => setFullPreview(true)}
              className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-bold transition-colors hover:bg-cream-deep"
            >
              <ArrowsOut size={13} weight="bold" />
              Full screen
            </button>
          </div>
          <div className="sticky top-24 mt-3 overflow-hidden rounded-3xl border border-line bg-white shadow-[0_24px_60px_-30px_rgba(93,79,26,0.3)]">
            <div className="relative h-28 w-full" style={{ backgroundColor: color }}>
              {coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl} alt="" className="h-full w-full object-cover" />
              )}
              {isPro && liveCountEnabled && (
                <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold backdrop-blur">
                  <span className="size-2 rounded-full bg-[#4A7C59]" />
                  23 here right now
                </span>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-cream-deep font-bold">
                  {creatorName.charAt(0).toUpperCase()}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{creatorName}</p>
                  <p className="text-xs text-ink-soft">
                    nudgeo.app/{effectiveSlug || 'your-event'}
                  </p>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold tracking-tight">
                {name || 'Your event name'}
              </h3>
              <p className="mt-1.5 min-h-10 text-sm leading-relaxed text-ink-soft">
                {description || 'Your description shows up here.'}
              </p>
              {launchDate && <LaunchCountdown date={launchDate} />}
              <div className="mt-4 flex gap-2">
                <span className="flex-1 rounded-[14px] border border-line bg-cream px-4 py-2.5 text-sm text-ink-soft/60">
                  you@example.com
                </span>
                <span
                  className="rounded-full px-5 py-2.5 text-sm font-semibold"
                  style={{
                    backgroundColor: color,
                    color: color === '#201D15' ? '#FAF6ED' : '#201D15',
                  }}
                >
                  Notify me
                </span>
              </div>
              {goalEnabled && signupGoal > 0 && (
                <div className="mt-4">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold">Spots claimed</span>
                    <span className="text-ink-soft tabular-nums">
                      0 / {signupGoal.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream-deep">
                    <div className="h-full w-1 rounded-full" style={{ backgroundColor: color }} />
                  </div>
                </div>
              )}
              {productLinks.filter((l) => l.label.trim()).length > 0 && (
                <div className="mt-4 grid gap-2">
                  {productLinks
                    .filter((l) => l.label.trim())
                    .slice(0, 3)
                    .map((link, i) => (
                      <span
                        key={`${link.label}-${i}`}
                        className="rounded-full border border-line py-2 text-center text-xs font-semibold"
                      >
                        {link.label}
                      </span>
                    ))}
                </div>
              )}
              {Object.values(socials).some((v) => v?.trim()) && (
                <div className="mt-4 flex justify-center gap-2">
                  {SOCIAL_FIELDS.filter(({ key }) => socials[key]?.trim()).map(
                    ({ key, icon: Icon }) => (
                      <span
                        key={key}
                        className="grid size-8 place-items-center rounded-full border border-line text-ink"
                      >
                        <Icon size={14} weight="fill" />
                      </span>
                    ),
                  )}
                </div>
              )}
              <p className="mt-4 text-xs text-ink-soft">Your fans will appear here.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
