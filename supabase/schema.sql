-- Nan Game On — Supabase schema (hackathon prototype)
-- Run this in the Supabase Dashboard -> SQL Editor -> New query -> Run.
--
-- Identity model: no login. Each browser generates a uuid (localStorage
-- "ngo-uid") and sends it as the uid column. RLS is enabled with
-- permissive anon policies — acceptable for a judged prototype, noted
-- in the README as a production hardening point.

create table if not exists public.profiles (
  uid uuid primary key,
  name text not null default '',
  color text not null default '#fc5200',
  updated_at timestamptz not null default now()
);

create table if not exists public.checkins (
  id bigserial primary key,
  uid uuid not null,
  event_id text not null,
  season text not null,
  at timestamptz not null default now(),
  unique (uid, event_id)
);

create table if not exists public.posts (
  id bigserial primary key,
  uid uuid not null,
  author_name text not null default '',
  author_color text not null default '#fc5200',
  kind text not null default 'text',
  event_id text,
  text text,
  badge_ids jsonb not null default '[]'::jsonb,
  points int not null default 0,
  at timestamptz not null default now()
);

create table if not exists public.kudos (
  uid uuid not null,
  post_id text not null,
  primary key (uid, post_id)
);

-- RLS: on, with permissive read/write for the anon role (prototype).
alter table public.profiles enable row level security;
alter table public.checkins enable row level security;
alter table public.posts enable row level security;
alter table public.kudos enable row level security;

drop policy if exists "anon read profiles" on public.profiles;
drop policy if exists "anon write profiles" on public.profiles;
drop policy if exists "anon update profiles" on public.profiles;
create policy "anon read profiles" on public.profiles for select using (true);
create policy "anon write profiles" on public.profiles for insert with check (true);
create policy "anon update profiles" on public.profiles for update using (true);

drop policy if exists "anon read checkins" on public.checkins;
drop policy if exists "anon write checkins" on public.checkins;
create policy "anon read checkins" on public.checkins for select using (true);
create policy "anon write checkins" on public.checkins for insert with check (true);

drop policy if exists "anon read posts" on public.posts;
drop policy if exists "anon write posts" on public.posts;
create policy "anon read posts" on public.posts for select using (true);
create policy "anon write posts" on public.posts for insert with check (true);

drop policy if exists "anon read kudos" on public.kudos;
drop policy if exists "anon write kudos" on public.kudos;
drop policy if exists "anon delete kudos" on public.kudos;
create policy "anon read kudos" on public.kudos for select using (true);
create policy "anon write kudos" on public.kudos for insert with check (true);
create policy "anon delete kudos" on public.kudos for delete using (true);
