-- Subscription billing (Razorpay): plan catalog, per-user subscriptions, payments.

create table if not exists plans (
  key text not null primary key, -- free | creator | studio
  name text not null,
  price_usd_monthly numeric(10, 2) not null default 0,
  price_usd_yearly numeric(10, 2) not null default 0,
  events_limit integer, -- null = unlimited
  signups_per_event integer, -- null = unlimited
  email_sends_monthly integer not null default 0, -- 0 = pay-as-you-go only
  live_count_enabled boolean not null default false,
  razorpay_plan_id_monthly text, -- filled in once plans exist in Razorpay
  razorpay_plan_id_yearly text,
  created_at timestamptz not null default now()
);

insert into plans
  (key, name, price_usd_monthly, price_usd_yearly, events_limit, signups_per_event, email_sends_monthly, live_count_enabled)
values
  ('free', 'Free', 0, 0, 1, 100, 0, false),
  ('creator', 'Creator', 15, 144, 5, 2500, 10000, true),
  ('studio', 'Studio', 49, 470, null, 25000, 100000, true)
on conflict (key) do nothing;

-- Named user_subscriptions because `subscriptions` already holds waitlist fans.
create table if not exists user_subscriptions (
  id text not null primary key,
  user_id text not null references "user" ("id") on delete cascade,
  plan_key text not null references plans (key),
  status text not null default 'created', -- created | active | past_due | cancelled | expired
  billing_cycle text not null default 'monthly', -- monthly | yearly
  razorpay_subscription_id text unique,
  razorpay_customer_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists user_subscriptions_user_id_idx on user_subscriptions (user_id);

create table if not exists payments (
  id text not null primary key,
  user_id text not null references "user" ("id") on delete cascade,
  user_subscription_id text references user_subscriptions (id) on delete set null,
  razorpay_payment_id text unique,
  razorpay_order_id text,
  amount integer not null, -- smallest currency unit (paise / cents)
  currency text not null default 'INR',
  status text not null default 'created', -- created | authorized | captured | refunded | failed
  method text, -- upi | card | netbanking | wallet | ...
  purpose text not null default 'subscription', -- subscription | email_credits
  created_at timestamptz not null default now()
);
create index if not exists payments_user_id_idx on payments (user_id);

alter table plans enable row level security;
alter table user_subscriptions enable row level security;
alter table payments enable row level security;
