# Nan Game On route map

## Public sport routes

| Route | Source | Purpose |
|---|---|---|
| `/` | `src/app/(sport)/page.tsx` | Community feed and leaderboard |
| `/calendar` | `src/app/(sport)/calendar/page.tsx` | Seasonal sport-event calendar |
| `/events/[id]` | `src/app/(sport)/events/[id]/page.tsx` | Event detail and Racecation plan |
| `/checkin/[eventId]` | `src/app/(sport)/checkin/[eventId]/page.tsx` | Event check-in |
| `/passport` | `src/app/(sport)/passport/page.tsx` | Profile, points, badges, and check-in history |
| `/rewards` | `src/app/(sport)/rewards/page.tsx` | Prototype reward redemption |
| `/chat` | `src/app/(sport)/chat/page.tsx` | Sport Buddy and Game On Help |

## Role routes

| Route | Source | Purpose |
|---|---|---|
| `/login` | `src/app/login/page.tsx` | Demo role picker |
| `/organizer/**` | `src/app/organizer/**` | Organizer workspace |
| `/admin/**` | `src/app/admin/**` | Administrator workspace |

## API routes

| Route | Purpose |
|---|---|
| `/api/chat` | Streaming sport chat |
| `/api/raceplan` | Racecation plan generation |
| `/api/weather` | Seven-day Nan forecast |

## Data retained for Game On

`sportsEvents.json`, `seasons.json`, `rewards.json`, and `feedSeed.json` power the sport app. `places.json` is a compact local destination reference used only by sport chat and Racecation recommendations.

## Supabase

`supabase/schema.sql` and `supabase/storage.sql` define the feed, check-in, kudos, profile, and post-image prototype data. The browser client remains in `src/lib/supabase.ts`.
