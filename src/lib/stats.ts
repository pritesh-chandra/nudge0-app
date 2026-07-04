import { db } from './db'

/** Data-derived Hype Score (0-100): recent momentum + virality + size. */
export function hypeScore(a: { total: number; week: number; referred: number }): number {
  if (a.total === 0) return 0
  const velocity = Math.min(45, a.week * 3)
  const referral = Math.round((a.referred / a.total) * 35)
  const size = Math.min(20, Math.round(a.total / 10))
  return Math.min(100, velocity + referral + size)
}

/** Plan usage: live events and email sends this calendar month. */
export async function getUsage(userId: string): Promise<{ events: number; emailSends: number }> {
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)

  const [eventsRow, sendsRow] = await Promise.all([
    db
      .selectFrom('events')
      .select((eb) => eb.fn.countAll<string>().as('c'))
      .where('user_id', '=', userId)
      .executeTakeFirst(),
    db
      .selectFrom('notifications')
      .select((eb) => eb.fn.sum<string>('recipient_count').as('s'))
      .where('user_id', '=', userId)
      .where('status', '=', 'sent')
      .where('created_at', '>=', monthStart.toISOString())
      .executeTakeFirst(),
  ])

  return { events: Number(eventsRow?.c ?? 0), emailSends: Number(sendsRow?.s ?? 0) }
}

export type HomeEventRow = {
  id: string
  name: string
  slug: string
  category: string | null
  status: string
  signups: number
}

export type RecentSignup = { name: string; event: string; at: string }

export async function getHomeSummary(userId: string): Promise<{
  events: HomeEventRow[]
  totalSignups: number
  weekSignups: number
  referred: number
  liveEvents: number
  hype: number
  recent: RecentSignup[]
}> {
  const events = await db
    .selectFrom('events')
    .select(['id', 'name', 'slug', 'category', 'status'])
    .where('user_id', '=', userId)
    .orderBy('created_at', 'desc')
    .execute()

  const ids = events.map((e) => e.id)
  const perEvent = new Map<string, number>()
  let totalSignups = 0
  let weekSignups = 0
  let referred = 0
  const recent: RecentSignup[] = []

  if (ids.length > 0) {
    const subs = await db
      .selectFrom('subscriptions')
      .innerJoin('events', 'events.id', 'subscriptions.event_id')
      .select([
        'subscriptions.name as name',
        'subscriptions.referrer_id as referrer_id',
        'subscriptions.created_at as created_at',
        'subscriptions.event_id as event_id',
        'events.name as eventName',
      ])
      .where('subscriptions.event_id', 'in', ids)
      .where('subscriptions.unsubscribed_at', 'is', null)
      .orderBy('subscriptions.created_at', 'desc')
      .execute()

    totalSignups = subs.length
    const weekAgo = Date.now() - 7 * 86_400_000
    for (const s of subs) {
      if (new Date(s.created_at).getTime() >= weekAgo) weekSignups++
      if (s.referrer_id) referred++
      perEvent.set(s.event_id, (perEvent.get(s.event_id) ?? 0) + 1)
    }
    recent.push(
      ...subs.slice(0, 5).map((s) => ({
        name: s.name ?? 'Someone',
        event: s.eventName,
        at: s.created_at,
      })),
    )
  }

  return {
    events: events.map((e) => ({ ...e, signups: perEvent.get(e.id) ?? 0 })),
    totalSignups,
    weekSignups,
    referred,
    liveEvents: events.filter((e) => e.status === 'live').length,
    hype: hypeScore({ total: totalSignups, week: weekSignups, referred }),
    recent,
  }
}
