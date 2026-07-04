import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'

// One-click unsubscribe. Marks the subscription as unsubscribed and redirects
// to a friendly confirmation page.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const sub = await db
    .selectFrom('subscriptions')
    .innerJoin('events', 'events.id', 'subscriptions.event_id')
    .select(['subscriptions.id as id', 'subscriptions.unsubscribed_at as off', 'events.name as eventName'])
    .where('subscriptions.id', '=', id)
    .executeTakeFirst()

  if (sub && !sub.off) {
    await db
      .updateTable('subscriptions')
      .set({ unsubscribed_at: new Date().toISOString() })
      .where('id', '=', id)
      .execute()
  }

  const url = new URL('/unsubscribed', _req.nextUrl.origin)
  if (sub?.eventName) url.searchParams.set('event', sub.eventName)
  else url.searchParams.set('missing', '1')
  return NextResponse.redirect(url)
}
