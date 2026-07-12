-- Nan Game On — photo posting migration.
-- Run in Supabase Dashboard -> SQL Editor AFTER schema.sql.

-- 1. Posts can carry an image URL.
alter table public.posts add column if not exists image_url text;

-- 2. Public bucket for feed photos.
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- 3. Anon can read (public bucket) and upload into post-images (prototype).
drop policy if exists "anon read post-images" on storage.objects;
drop policy if exists "anon upload post-images" on storage.objects;
create policy "anon read post-images" on storage.objects
  for select using (bucket_id = 'post-images');
create policy "anon upload post-images" on storage.objects
  for insert with check (bucket_id = 'post-images');
