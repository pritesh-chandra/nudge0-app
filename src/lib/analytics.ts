import { db } from './db'
import { hypeScore } from './stats'

export type EventAnalytics = {
  key: string
  label: string
  status: string
  totalSignups: number
  weekSignups: number
  referredSignups: number
  verifiedSignups: number
  hype: number
  series: number[] // daily signups, last 30 days
  sources: { name: string; count: number; share: number }[]
  referrers: { name: string; invites: number }[]
}

const SOURCE_LABELS: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  x: 'X',
  youtube: 'YouTube',
  direct: 'Direct',
  newsletter: 'Newsletter',
}

function labelSource(raw: string | null): string {
  if (!raw) return 'Direct'
  return SOURCE_LABELS[raw] ?? raw.charAt(0).toUpperCase() + raw.slice(1)
}

export async function getEventsAnalytics(userId: string): Promise<EventAnalytics[]> {
  const events = await db
    .selectFrom('events')
    .select(['id', 'slug', 'name', 'status'])
    .where('user_id', '=', userId)
    .orderBy('created_at', 'desc')
    .execute()
  if (events.length === 0) return []

  const ids = events.map((e) => e.id)
  const subs = await db
    .selectFrom('subscriptions')
    .select(['id', 'event_id', 'name', 'source', 'referrer_id', 'verified', 'created_at'])
    .where('event_id', 'in', ids)
    .where('unsubscribed_at', 'is', null)
    .execute()

  // name lookup for referrer attribution
  const nameById = new Map(subs.map((s) => [s.id, s.name ?? 'A fan']))
  const byEvent = new Map<string, typeof subs>()
  for (const s of subs) {
    const list = byEvent.get(s.event_id) ?? []
    list.push(s)
    byEvent.set(s.event_id, list)
  }

  const now = Date.now()
  const weekAgo = now - 7 * 86_400_000
  const dayMs = 86_400_000

  return events.map((event) => {
    const list = byEvent.get(event.id) ?? []
    const total = list.length
    let week = 0
    let referred = 0
    let verified = 0
    const sourceCounts = new Map<string, number>()
    const referrerCounts = new Map<string, number>()
    const series = new Array(30).fill(0)

    for (const s of list) {
      const t = new Date(s.created_at).getTime()
      if (t >= weekAgo) week++
      if (s.referrer_id) {
        referred++
        referrerCounts.set(s.referrer_id, (referrerCounts.get(s.referrer_id) ?? 0) + 1)
      }
      if (s.verified) verified++
      const label = labelSource(s.source)
      sourceCounts.set(label, (sourceCounts.get(label) ?? 0) + 1)
      const dayIndex = 29 - Math.floor((now - t) / dayMs)
      if (dayIndex >= 0 && dayIndex < 30) series[dayIndex]++
    }

    const sources = [...sourceCounts.entries()]
      .map(([name, count]) => ({ name, count, share: total ? Math.round((count / total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)

    const referrers = [...referrerCounts.entries()]
      .map(([id, invites]) => ({ name: nameById.get(id) ?? 'A fan', invites }))
      .sort((a, b) => b.invites - a.invites)
      .slice(0, 5)

    return {
      key: event.slug,
      label: `${event.name} (${event.status})`,
      status: event.status,
      totalSignups: total,
      weekSignups: week,
      referredSignups: referred,
      verifiedSignups: verified,
      hype: hypeScore({ total, week, referred }),
      series,
      sources,
      referrers,
    }
  })
}
