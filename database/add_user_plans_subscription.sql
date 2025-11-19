-- Subscription: user_plans table and policies
-- This migration creates the user_plans table used by the subscription system
-- and wires it up to Supabase auth + RLS. Run this in your Supabase SQL editor
-- or apply it via your usual migration process.

-- 1) user_plans table
create table if not exists public.user_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  -- If you already use a license_category enum, you can change this to that type.
  category    text not null,
  -- PLAN_A, PLAN_B, PLAN_C (kept as text for flexibility)
  plan_tier   text not null,
  start_date  timestamptz not null,
  end_date    timestamptz not null,
  status      text not null default 'active',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2) Ensure at most one row per (user, category) as expected by upsert
create unique index if not exists user_plans_user_category_key
  on public.user_plans (user_id, category);

-- Helpful indexes
create index if not exists user_plans_user_id_idx
  on public.user_plans (user_id);

create index if not exists user_plans_status_idx
  on public.user_plans (status);

create index if not exists user_plans_category_idx
  on public.user_plans (category);

-- 3) Optional: updated_at trigger
-- If you already have a generic "set_current_timestamp" / "trigger_set_timestamp"
-- function in your database, you can reuse it here. Otherwise, you can leave
-- this commented out or adapt it to your existing pattern.

-- create or replace function public.set_current_timestamp()
-- returns trigger as $$
-- begin
--   new.updated_at = now();
--   return new;
-- end;
-- $$ language plpgsql;

-- drop trigger if exists set_timestamp_user_plans on public.user_plans;
-- create trigger set_timestamp_user_plans
--   before update on public.user_plans
--   for each row
--   execute procedure public.set_current_timestamp();

-- 4) Row Level Security: users can only see and change their own plans
alter table public.user_plans enable row level security;

drop policy if exists "Users can view own plans" on public.user_plans;
drop policy if exists "Users can insert own plans" on public.user_plans;
drop policy if exists "Users can update own plans" on public.user_plans;

create policy "Users can view own plans"
  on public.user_plans
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own plans"
  on public.user_plans
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own plans"
  on public.user_plans
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admin flows (e.g. /admin/subscriptions) go through the same RLS rules,
-- since admins are represented as normal Supabase users but with extra
-- permissions enforced at the application layer (isAdmin flag).
