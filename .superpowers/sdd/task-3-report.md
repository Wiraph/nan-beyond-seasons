# Task 3 report

## Implementation

- Mounted `RoleGate` around the `(sport)` layout shell. This covers `/`, calendar, chat, passport, rewards, dynamic event, and dynamic check-in pages while preserving `/` as the allowed user home.
- Replaced each sport header's standalone language switcher with `GameOnHeaderActions`, including the check-in page header. Existing back controls and their fallback destinations are unchanged.
- Replaced the mobile sport shortcut to `/explore` with `/rewards`; the five sport navigation destinations are now Feed, Calendar, Passport, Rewards, and AI.
- Simplified `PublicFooter` to one Nan Game On variant with Home, Calendar, Passport, Rewards, and AI links. It retains the required telephone `tel:+6654716000` / visible `0-5471-6000`, fax `0-5471-6365`, exact Thai organization name, safety reminder, and 44px minimum shortcut touch targets.
- Replaced the active Thai/English footer copy and removed obsolete footer Explore/Map/route-planning keys from every dictionary. Added retained Game On reward labels.

## Verification

- `npm test` — passed: 10 tests, 0 failures.
- `npx tsc --noEmit` — passed.
- `npx eslint 'src/app/(sport)/layout.tsx' src/components/PublicFooter.tsx src/components/SportNav.tsx src/i18n/dictionaries.ts` — passed.
- `git diff --check` — passed.
- Focused source scan found no Explore, Map, or route-planning destinations/translation keys in the sport navigation, sport layout/pages, shared footer, or dictionaries.

## Full-lint limitation

`npm run lint` currently fails with 12 pre-existing `react-hooks/set-state-in-effect` / `react-hooks/purity` errors. The errors include pre-existing lines in `src/app/(sport)/page.tsx`, `calendar/page.tsx`, `events/[id]/page.tsx`, and `rewards/page.tsx`, plus existing store files. The Task 3 diff changes only the sport header imports/rendering in those pages; no lint suppressions or unrelated refactors were added.

## Manual validation required

There is no automated browser/UI test harness. Later validation should confirm:

1. An anonymous visit to each sport route redirects to `/login`; an organizer/admin session redirects from each sport route to its own home; a user session stays on the route.
2. Each sport header (feed, calendar, chat, event, check-in, passport, rewards) shows both the language selector and account controls, and each account action remains at least 44px tall.
3. Back buttons retain their existing fallback behavior; event images and Supabase-backed feed uploads/check-ins still behave as before.
4. Desktop and mobile sport navigation show only Feed, Calendar, Passport, Rewards, and AI. Footer links are Home, Calendar, Passport, Rewards, and AI, with one footer only.
