-- Event catalogue and public-read event media for Nan Game On.
-- Write access is deliberately server-only: the service role bypasses RLS
-- when publishing curated events and their generated images.

create table if not exists public.events (
  id text primary key,
  event_data jsonb not null,
  image_path text,
  owner_id uuid references auth.users(id) on delete set null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

grant select on table public.events to anon, authenticated;

drop policy if exists "public can read events" on public.events;
create policy "public can read events"
  on public.events
  for select
  to anon, authenticated
  using (true);

-- A public bucket permits direct image delivery from the CDN. Uploading is
-- intentionally left without anon/authenticated policies; the publisher uses
-- a server-only service key instead.
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public can read event images" on storage.objects;
create policy "public can read event images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'event-images');
