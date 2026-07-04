import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { PublicEventPage } from '@/components/public/PublicEventPage'

type ProductLink = { label: string; url: string }
type Socials = Record<string, string>

// jsonb columns arrive parsed from node-postgres, but stay defensive
function asArray(value: unknown): ProductLink[] {
  if (Array.isArray(value)) return value as ProductLink[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function asObject(value: unknown): Socials {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Socials
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
      return {}
    }
  }
  return {}
}

async function getEvent(slug: string) {
  return db.selectFrom('events').selectAll().where('slug', '=', slug).executeTakeFirst()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: 'Page not found · nudgeo' }

  const description = event.description ?? `Join the waitlist for ${event.name}.`
  return {
    title: `${event.name} · nudgeo`,
    description,
    openGraph: {
      title: event.name,
      description,
      images: event.cover_url ? [event.cover_url] : [],
    },
  }
}

export default async function EventPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string | string[] }>
}) {
  const { slug } = await params
  const { ref } = await searchParams
  const event = await getEvent(slug)
  if (!event) notFound()

  const [creator, countRow] = await Promise.all([
    db.selectFrom('user').select('name').where('id', '=', event.user_id).executeTakeFirst(),
    db
      .selectFrom('subscriptions')
      .select((eb) => eb.fn.countAll<string>().as('c'))
      .where('event_id', '=', event.id)
      .where('unsubscribed_at', 'is', null)
      .executeTakeFirst(),
  ])

  const referralId = Array.isArray(ref) ? ref[0] : (ref ?? null)

  return (
    <PublicEventPage
      creatorName={creator?.name ?? 'A creator'}
      initialCount={Number(countRow?.c ?? 0)}
      referralId={referralId}
      event={{
        slug: event.slug,
        name: event.name,
        description: event.description,
        color: event.brand_color,
        coverUrl: event.cover_url,
        launchAt: event.launch_at,
        productLinks: asArray(event.product_links),
        socials: asObject(event.socials),
        signupGoal: event.signup_goal,
        referralsEnabled: event.referrals_enabled,
        liveCountEnabled: event.live_count_enabled,
        status: event.status,
      }}
    />
  )
}
