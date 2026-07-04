'use server'
import { randomUUID } from 'node:crypto'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// ---------- Create event ----------

export type ProductLink = { label: string; url: string }
export type Socials = Partial<
  Record<'instagram' | 'tiktok' | 'x' | 'youtube' | 'website', string>
>

export type CreateEventInput = {
  name: string
  slug: string
  description: string
  category: string
  launchDate: string
  color: string
  coverUrl: string | null
  productLinks: ProductLink[]
  socials: Socials
  signupGoal: number | null
  referralsEnabled: boolean
  liveCountEnabled: boolean
}

export type CreateEventResult = { ok: true; slug: string } | { ok: false; message: string }

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isHttpUrl(value: string) {
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export async function createEvent(input: CreateEventInput): Promise<CreateEventResult> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return { ok: false, message: 'Your session expired. Please sign in again.' }

  const name = input.name.trim()
  const slug = input.slug.trim().toLowerCase()
  if (!name) return { ok: false, message: 'Give your event a name.' }
  if (!SLUG_RE.test(slug)) {
    return { ok: false, message: 'Page link can only use letters, numbers, and dashes.' }
  }

  const productLinks = input.productLinks
    .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
    .filter((l) => l.label && isHttpUrl(l.url))
    .slice(0, 5)

  const socials = Object.fromEntries(
    Object.entries(input.socials)
      .map(([k, v]) => [k, (v ?? '').trim().replace(/^@/, '')])
      .filter(([, v]) => v),
  )

  // Device uploads are preview-only until file storage ships; keep real URLs only
  const coverUrl = input.coverUrl && isHttpUrl(input.coverUrl) ? input.coverUrl : null

  const taken = await db
    .selectFrom('events')
    .select('id')
    .where('slug', '=', slug)
    .executeTakeFirst()
  if (taken) return { ok: false, message: `nudgeo.app/${slug} is taken. Pick another link.` }

  const now = new Date().toISOString()
  await db
    .insertInto('events')
    .values({
      id: randomUUID(),
      user_id: session.user.id,
      name,
      slug,
      description: input.description.trim() || null,
      category: input.category,
      brand_color: input.color,
      launch_at: input.launchDate
        ? new Date(`${input.launchDate}T00:00:00`).toISOString()
        : null,
      status: 'live',
      cover_url: coverUrl,
      product_links: JSON.stringify(productLinks),
      socials: JSON.stringify(socials),
      signup_goal:
        input.signupGoal && input.signupGoal > 0 ? Math.floor(input.signupGoal) : null,
      referrals_enabled: input.referralsEnabled,
      live_count_enabled: input.liveCountEnabled,
      created_at: now,
      updated_at: now,
    })
    .execute()

  return { ok: true, slug }
}

// ---------- AI description ----------

const FALLBACK_TEMPLATES = [
  (n: string, c: string) =>
    `${n} is almost here. Join the waitlist and be first in line when this ${c.toLowerCase()} drops.`,
  (n: string, c: string) =>
    `The next ${c.toLowerCase()} from our studio: ${n}. Early birds get first pick, so grab your spot.`,
  (n: string) => `${n} is coming. Sign up now and hear about it before anyone else does.`,
]

export async function generateDescription(input: {
  name: string
  category: string
}): Promise<{ description: string; source: 'ai' | 'template' }> {
  const name = input.name.trim() || 'our next launch'
  const category = input.category || 'launch'

  const prompt = `Write one punchy sentence (under 160 characters, plain text, no quotes, no hashtags, no emoji) for a waitlist landing page. It should make fans want to sign up for this upcoming ${category.toLowerCase()} called "${name}". Reply with the sentence only.`

  try {
    // Pollinations: free, keyless text generation API
    const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`, {
      signal: AbortSignal.timeout(9000),
    })
    if (res.ok) {
      const text = (await res.text()).trim().replace(/^["']|["']$/g, '')
      if (text.length > 10 && text.length <= 300) {
        return { description: text.slice(0, 200), source: 'ai' }
      }
    }
  } catch {
    // fall through to templates
  }

  const template = FALLBACK_TEMPLATES[Math.floor(Math.random() * FALLBACK_TEMPLATES.length)]
  return { description: template(name, category).slice(0, 200), source: 'template' }
}

// ---------- Cover photo search ----------

export type CoverPhoto = {
  id: string
  thumbUrl: string
  fullUrl: string
  credit: string
}

export async function searchCoverPhotos(query: string): Promise<{
  photos: CoverPhoto[]
  source: 'unsplash' | 'placeholder'
}> {
  const q = query.trim() || 'launch'
  const accessKey = process.env.UNSPLASH_ACCESS_KEY

  try {
    const url = accessKey
      ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=8&orientation=landscape`
      : `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(q)}&per_page=8&orientation=landscape`
    const res = await fetch(url, {
      headers: accessKey ? { Authorization: `Client-ID ${accessKey}` } : {},
      signal: AbortSignal.timeout(9000),
    })
    if (res.ok) {
      const data = await res.json()
      const results = ((data.results ?? []) as Array<{
        id: string
        urls: { small: string; regular: string }
        user?: { name?: string }
      }>)
        // Unsplash+ premium images render with watermarks; keep free ones only
        .filter((p) => !p.urls.regular.includes('plus.unsplash.com'))
      if (results.length > 0) {
        return {
          source: 'unsplash',
          photos: results.map((p) => ({
            id: p.id,
            thumbUrl: p.urls.small,
            fullUrl: p.urls.regular,
            credit: p.user?.name ? `${p.user.name} on Unsplash` : 'Unsplash',
          })),
        }
      }
    }
  } catch {
    // fall through to placeholders
  }

  const slug = q.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    source: 'placeholder',
    photos: Array.from({ length: 8 }, (_, i) => ({
      id: `picsum-${slug}-${i}`,
      thumbUrl: `https://picsum.photos/seed/${slug}-${i}/400/240`,
      fullUrl: `https://picsum.photos/seed/${slug}-${i}/1600/900`,
      credit: 'Placeholder photo',
    })),
  }
}
