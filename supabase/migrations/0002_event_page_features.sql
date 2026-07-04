-- Event page features: cover photo, product links, social links,
-- signup goal, referral leaderboard, live visitor count (pro).

alter table events add column if not exists cover_url text;
alter table events add column if not exists product_links jsonb not null default '[]'::jsonb;
alter table events add column if not exists socials jsonb not null default '{}'::jsonb;
alter table events add column if not exists signup_goal integer;
alter table events add column if not exists referrals_enabled boolean not null default false;
alter table events add column if not exists live_count_enabled boolean not null default false;
