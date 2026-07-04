import { db, type PlanRow } from './db'

/**
 * Resolve a user's current plan: the plan of their most recent active
 * subscription, else Free. Razorpay webhooks will keep user_subscriptions
 * up to date once checkout ships.
 */
export async function getUserPlan(userId: string): Promise<PlanRow> {
  const active = await db
    .selectFrom('user_subscriptions')
    .innerJoin('plans', 'plans.key', 'user_subscriptions.plan_key')
    .selectAll('plans')
    .where('user_subscriptions.user_id', '=', userId)
    .where('user_subscriptions.status', '=', 'active')
    .orderBy('user_subscriptions.created_at', 'desc')
    .executeTakeFirst()

  if (active) return active

  const free = await db
    .selectFrom('plans')
    .selectAll()
    .where('key', '=', 'free')
    .executeTakeFirstOrThrow()
  return free
}
