import { Kysely, PostgresDialect } from 'kysely'
import { pool } from './pool'

export interface EventRow {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  category: string | null
  brand_color: string
  launch_at: string | null
  status: 'draft' | 'live' | 'ended'
  cover_url: string | null
  product_links: string // jsonb: [{ label, url }]
  socials: string // jsonb: { instagram?, tiktok?, x?, youtube?, website? }
  signup_goal: number | null
  referrals_enabled: boolean
  live_count_enabled: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionRow {
  id: string
  event_id: string
  email: string
  name: string | null
  source: string | null
  referrer_id: string | null
  verified: boolean
  unsubscribed_at: string | null
  created_at: string
}

export interface NotificationRow {
  id: string
  event_id: string
  user_id: string
  template_key: string | null
  subject: string
  body: string
  status: 'draft' | 'queued' | 'sent'
  recipient_count: number
  sent_at: string | null
  created_at: string
}

export interface EmailTemplateRow {
  id: string
  event_id: string
  template_key: string
  subject: string
  body: string
  updated_at: string
}

export interface PlanRow {
  key: 'free' | 'creator' | 'studio'
  name: string
  price_usd_monthly: string
  price_usd_yearly: string
  events_limit: number | null
  signups_per_event: number | null
  email_sends_monthly: number
  live_count_enabled: boolean
  razorpay_plan_id_monthly: string | null
  razorpay_plan_id_yearly: string | null
  created_at: string
}

export interface UserSubscriptionRow {
  id: string
  user_id: string
  plan_key: 'free' | 'creator' | 'studio'
  status: 'created' | 'active' | 'past_due' | 'cancelled' | 'expired'
  billing_cycle: 'monthly' | 'yearly'
  razorpay_subscription_id: string | null
  razorpay_customer_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface PaymentRow {
  id: string
  user_id: string
  user_subscription_id: string | null
  razorpay_payment_id: string | null
  razorpay_order_id: string | null
  amount: number
  currency: string
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed'
  method: string | null
  purpose: 'subscription' | 'email_credits'
  created_at: string
}

export interface UserRow {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
}

interface DB {
  user: UserRow
  events: EventRow
  subscriptions: SubscriptionRow
  notifications: NotificationRow
  email_templates: EmailTemplateRow
  plans: PlanRow
  user_subscriptions: UserSubscriptionRow
  payments: PaymentRow
}

// Same Supabase Postgres pool as the auth layer
export const db = new Kysely<DB>({ dialect: new PostgresDialect({ pool }) })
