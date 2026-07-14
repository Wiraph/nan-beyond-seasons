-- A public bucket already permits object delivery by public URL.  Do not add a
-- broad SELECT policy: that would also reveal the complete object listing.
drop policy if exists "public can read event images" on storage.objects;
