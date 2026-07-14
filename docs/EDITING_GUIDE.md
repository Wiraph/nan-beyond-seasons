# Nan Game On editing guide

| Change | Files |
|---|---|
| Sport events | `src/data/sportsEvents.json`, `src/lib/sports.ts` |
| Seasonal calendar and weather labels | `src/data/seasons.json`, `src/lib/weather.ts` |
| Event detail, check-in, passport, rewards, chat | `src/app/(sport)/**` |
| Racecation plan and local destination context | `src/app/api/raceplan/route.ts`, `src/lib/raceplan.ts`, `src/lib/destination-reference.ts`, `src/data/places.json` |
| Sport chat prompts | `src/app/api/chat/route.ts` |
| Feed, profile, check-ins, and kudos | `src/lib/FeedStore.tsx`, `src/lib/ProfileStore.tsx`, `src/lib/PassportStore.tsx`, `src/lib/supabase.ts` |
| Organizer and administrator workspaces | `src/app/organizer/**`, `src/app/admin/**`, `src/components/ManagementShell.tsx` |
| Thai and English labels | `src/i18n/dictionaries.ts` |
| Global styling and public navigation | `src/app/globals.css`, `src/components/SportNav.tsx`, `src/components/PublicFooter.tsx`, `src/components/PublicBackButton.tsx` |

`places.json` is deliberately limited to neutral local destination data for chat cards and Racecation. It is not a standalone visitor-content catalogue.
