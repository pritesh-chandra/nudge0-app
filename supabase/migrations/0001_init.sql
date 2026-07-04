-- nudgeo initial schema (Supabase Postgres)
-- Better Auth core tables + app tables (events, subscriptions, notifications, email_templates)
-- Apply via Supabase SQL editor, `supabase db push`, or the Supabase MCP.

-- ============ Better Auth ============

create table if not exists "user" (
  "id" text not null primary key,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" boolean not null default false,
  "image" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "session" (
  "id" text not null primary key,
  "expiresAt" timestamptz not null,
  "token" text not null unique,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references "user" ("id") on delete cascade
);
create index if not exists "session_userId_idx" on "session" ("userId");

create table if not exists "account" (
  "id" text not null primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references "user" ("id") on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope" text,
  "password" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index if not exists "account_userId_idx" on "account" ("userId");

-- Holds email OTP codes for signup verification, among other tokens
create table if not exists "verification" (
  "id" text not null primary key,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now()
);
create index if not exists "verification_identifier_idx" on "verification" ("identifier");

-- ============ App tables ============

create table if not exists events (
  id text not null primary key,
  user_id text not null references "user" ("id") on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  category text,
  brand_color text not null default '#FFD43B',
  launch_at timestamptz,
  status text not null default 'live', -- draft | live | ended
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists events_user_id_idx on events (user_id);

create table if not exists subscriptions (
  id text not null primary key,
  event_id text not null references events (id) on delete cascade,
  email text not null,
  name text,
  source text, -- tiktok | instagram | x | direct | newsletter | ...
  referrer_id text references subscriptions (id),
  verified boolean not null default false,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (event_id, email)
);
create index if not exists subscriptions_event_id_idx on subscriptions (event_id);

create table if not exists notifications (
  id text not null primary key,
  event_id text not null references events (id) on delete cascade,
  user_id text not null references "user" ("id") on delete cascade,
  template_key text, -- welcome | update | launch | reminder | null for custom
  subject text not null,
  body text not null,
  status text not null default 'draft', -- draft | queued | sent
  recipient_count integer not null default 0,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_event_id_idx on notifications (event_id);

create table if not exists email_templates (
  id text not null primary key,
  event_id text not null references events (id) on delete cascade,
  template_key text not null, -- welcome | update | launch | reminder
  subject text not null,
  body text not null,
  updated_at timestamptz not null default now(),
  unique (event_id, template_key)
);

-- The app talks to Postgres server-side only. Enable RLS with no policies so
-- the Supabase Data API (anon/authenticated roles) cannot touch these tables.
alter table "user" enable row level security;
alter table "session" enable row level security;
alter table "account" enable row level security;
alter table "verification" enable row level security;
alter table events enable row level security;
alter table subscriptions enable row level security;
alter table notifications enable row level security;
alter table email_templates enable row level security;
