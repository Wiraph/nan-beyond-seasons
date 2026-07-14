# Event media, Supabase data, and demo roles

## Goal

Move the 16 sports events from the bundled JSON data into Supabase, store each
event hero image in Supabase Storage, and present a tailored demo experience
for visitor, organizer, and administrator roles. The deployed Vercel app must
continue to work when Supabase is unavailable by using the existing JSON data
as a read-only fallback.

## Scope

- Generate a consistent 16:9 hero image for each event and store it in the
  `event-images` Storage bucket.
- Add an `events` table as the remote source of truth, seeded from
  `src/data/sportsEvents.json`.
- Read remote events through one validated API/provider boundary, with the
  bundled data as the resilience fallback.
- Add a clearly labelled demo-role selector and role-aware navigation/pages.

This phase intentionally uses demo roles rather than real authentication. The
browser-selected role is not an authorization boundary. The database schema
will nevertheless retain `owner_id` so it can later be protected with
Supabase Auth and RLS without migrating event data again.

## Data model

`public.events` has a stable text `id`, an `event_data jsonb` payload matching
the current `SportsEvent` shape, a nullable `image_path`, nullable `owner_id`,
display order, and timestamps. The JSON payload preserves the existing nested
translations, dates, venue, modes, and descriptive data without a lossy
one-time conversion.

`storage.buckets` contains a public `event-images` bucket accepting JPEG
images only. Generated objects use the deterministic key
`<event-id>.jpg`. Browser clients read public images but do not receive a
client-side write UI in this phase. The one-time asset upload runs with a
server-only service-role key; it is never exposed to the browser or committed.

## Application architecture

An `/api/events` route reads the remote rows, validates their shapes, maps
them to the existing `SportsEvent` type, and derives each public image URL.
`EventsProvider` fetches that route once after hydration and exposes the
remote-or-fallback event list. Existing event lookup helpers become provider
aware so calendar, feed, chat, details, check-in, passport, and planner pages
show the same data.

The API responds with the bundled events when the Supabase configuration or
remote request is unavailable. A malformed remote record is omitted rather
than breaking the whole event list.

## Demo roles and user experience

| Role | Intended experience | Event access |
| --- | --- | --- |
| `user` | Explore, plan, chat, check in, rewards, and feed | Read only |
| `organizer` | User experience plus an organizer workspace | Edit events assigned to the demo organizer |
| `admin` | User experience plus administration workspace | Review and edit every event; assign owners |

The role selector offers three clearly named demonstration profiles and a
visible demo-mode badge. It persists the selected role locally so it survives
refreshes and works without email delivery or an external identity provider on
Vercel. Organizer and admin screens explicitly describe their demo status.

## Deployment and future hardening

Vercel needs `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` for reads. The local one-time uploader also
needs `SUPABASE_SERVICE_ROLE_KEY`; it is intentionally absent from committed
files and is not required by the deployed client.

To convert this demonstration to production authorization, replace the demo
role store with Supabase Auth sessions, populate `owner_id` from `auth.uid()`,
and enforce owner/admin policies on `events` and `storage.objects`.

## Verification

- Unit tests cover remote event mapping, malformed rows, image URL handling,
  and fallback selection.
- Database migration is applied through the Supabase plugin and generated
  TypeScript types match the table.
- A deployed-style build completes using only public environment variables.
- The existing lint failures are recorded as pre-existing baseline failures;
  this work must not add new lint errors.
