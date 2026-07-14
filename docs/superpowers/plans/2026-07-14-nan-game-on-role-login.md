# Nan Game On Role Login and Nan Connect Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Make Nan Game On the only product in the app, with a no-credential demo role picker for tourists, organizers, and administrators; remove the overlapping Nan Connect product completely.

**Architecture:** A client-side `RoleProvider` persists the selected demo role in local storage and supplies a role guard, role-aware header account control, and deterministic redirect rules. Nan Game On’s existing public sport routes become the tourist experience, while focused organizer and admin workspaces provide separate management menus. The retained sport event, reward, passport, check-in, feed, weather, AI, and Supabase event-image paths remain isolated from deleted tourism/product-management code.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, Supabase client/storage integration, Node test runner with TypeScript compilation.

## Global Constraints

- `/login` is a demo-only role selection screen with exactly `user`, `organizer`, and `admin`; it must not request a name, email, or password.
- A role selected in this demo is not authentication or authorization. Server-side data writes and Supabase service-role access must not be added to it.
- Keep the existing Nan Game On event image URLs and Supabase-backed image generation/storage behavior intact.
- Retain the public footer/back-navigation work, but simplify it to Nan Game On destinations only.
- Preserve Thai and English UI, official tourist-assistance contact information, and 44px minimum interactive targets.
- Delete Nan Connect code, routes, dependencies, sample data, and branding rather than hiding them. Keep only destination data genuinely required by Nan Game On race-planning and chat, and document that dependency in code.

## Task 1: Establish role-routing logic with tests first

**Files:**
- Create: `src/lib/role-access.ts`
- Create: `tests/role-access.test.mts`
- Modify: `scripts/test-public-navigation.mjs`
- Modify: `tests/public-navigation.test.mts`
- Modify: `src/lib/public-navigation.ts`

1. Write isolated tests for the three permitted roles, each role's home route, and anonymous/wrong-role redirect behavior.
2. Add a pure `DemoRole` type, `ROLE_HOME` map, role display data, management/user route allow-list, and helpers that map an invalid path to the current role's home.
3. Update public navigation fallback behavior so the retained sport pages use only Nan Game On routes: event detail → calendar, check-in → event detail, and calendar/passport/rewards/chat → home.
4. Expand the Node test build script to compile/run both test modules; run the focused tests and keep them green before connecting UI state.

## Task 2: Build a reusable demo-role session and account controls

**Files:**
- Create: `src/lib/RoleStore.tsx`
- Create: `src/components/RoleGate.tsx`
- Create: `src/components/RoleAccountMenu.tsx`
- Create: `src/components/GameOnHeaderActions.tsx`
- Create: `src/app/login/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

1. Implement a browser-only provider backed by a single namespaced local-storage key. It exposes loading state, selected role, select-role, and logout operations.
2. Implement `RoleGate` so anonymous visitors are sent to `/login`, while a valid but incorrect role is sent to that role's home. Avoid rendering protected content during redirect.
3. Create an account control that shows the current demo role, has a clearly sized “change role” action to `/login`, and a logout action that clears the key and returns to `/login`.
4. Add a dedicated `/login` selection page with three accessible, large role cards. Each card describes what the role can do and routes to `/`, `/organizer`, or `/admin` after selection.
5. Add the provider at the root beside the retained i18n/passport/profile/feed providers and add shared styles for the role picker and management navigation.

## Task 3: Make the public Nan Game On experience user-only and role-aware

**Files:**
- Modify: `src/app/(sport)/layout.tsx`
- Modify: `src/app/(sport)/page.tsx`
- Modify: `src/app/(sport)/calendar/page.tsx`
- Modify: `src/app/(sport)/chat/page.tsx`
- Modify: `src/app/(sport)/checkin/[eventId]/page.tsx`
- Modify: `src/app/(sport)/events/[id]/page.tsx`
- Modify: `src/app/(sport)/passport/page.tsx`
- Modify: `src/app/(sport)/rewards/page.tsx`
- Modify: `src/components/SportNav.tsx`
- Modify: `src/components/PublicFooter.tsx`
- Modify: `src/i18n/dictionaries.ts`

1. Wrap all sport pages in a user-only `RoleGate`; `/` remains the user role’s home.
2. Add the common account control to every authenticated sport header alongside the language switcher, without reducing its 44px touch target.
3. Remove `/explore` from sport navigation and replace it with a retained Nan Game On shortcut (Rewards). Confirm desktop and mobile menus have only Feed, Calendar, Passport, Rewards, and AI.
4. Simplify the shared footer to a single Nan Game On variant with Home, Calendar, Passport, Rewards, and AI links. Retain the approved assistance phone, fax, official Thai organization name, and safety reminder.
5. Prune/replace translation keys that describe Nan Connect’s visitor product while retaining all keys consumed by sport pages and the new role UI.

## Task 4: Replace the old admin shell with distinct organizer and administrator workspaces

**Files:**
- Create: `src/components/ManagementShell.tsx`
- Create: `src/app/organizer/layout.tsx`
- Create: `src/app/organizer/page.tsx`
- Create: `src/app/organizer/events/page.tsx`
- Create: `src/app/organizer/events/new/page.tsx`
- Create: `src/app/organizer/checkins/page.tsx`
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/app/admin/page.tsx`
- Create: `src/app/admin/events/page.tsx`
- Create: `src/app/admin/users/page.tsx`
- Delete: `src/components/admin/AdminNav.tsx`
- Delete: `src/lib/adminAuth.tsx`
- Delete: old `src/app/admin/businesses/**`, `src/app/admin/places/**`, and `src/app/admin/posts/**` routes/components.

1. Create one responsive management shell that shows product branding, current role controls, and role-specific navigation with 44px targets.
2. Restrict `/organizer/**` to the organizer role. Provide Overview, My Events, Create Event, and Event Check-ins views based on the existing sport-event data. The new/edit/upload controls are clearly labelled demo-management placeholders and must not imply that client-selected roles can write to Supabase.
3. Restrict `/admin/**` to the admin role. Provide Overview, All Events, and Organizers/Users pages with aggregate cards and review lists based on sport/event mock data.
4. Remove the former two-role admin login and Nan Connect business/place/post management flows instead of redirecting them.

## Task 5: Remove Nan Connect routes, stores, APIs, components, and unused dependencies

**Files and folders to delete:**
- `src/app/(tourist)/**`
- `src/app/dashboard/**`
- `src/app/s/[qrId]/page.tsx`
- `src/app/api/match/route.ts`
- `src/app/api/plan/route.ts`
- `src/components/AppHeader.tsx`, `BottomNav.tsx`, `BusinessCard.tsx`, `PlaceCard.tsx`, `PlaceIllustration.tsx`, `PlaceThumb.tsx`, `WeatherStrip.tsx`, `DashboardNav.tsx`, `components/dashboard/**`, `components/admin/**`
- `src/lib/DataStore.tsx`, `PlanStore.tsx`, `PostStore.tsx`, `adminAuth.tsx`, `data.ts`, `search.ts`, and tourist-only planning/search helpers
- Tourist-only data files: categories, craft types, hotels, operators, districts, dashboard, wellness, post seed data, and the old post-image folder.

**Files to modify/retain:**
- `src/app/api/chat/route.ts`
- `src/app/api/raceplan/route.ts`
- `src/lib/raceplan.ts`
- `src/lib/types.ts`
- `src/data/places.json`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `package.json`, `package-lock.json`

1. Remove tourist route groups, dashboards, QR visitor landing, their context providers, content utilities, management forms, and mock APIs with `apply_patch` deletions.
2. Refactor sport chat and race-planning to consume only the retained destination reference data. Strip Nan Connect title/header strings and tourism-navigation guidance from their API prompts.
3. Reduce `types.ts` to the localization and destination shape still consumed by sport pages/chat/race-planning; remove business/category/wellness types. Keep `places.json` only as a neutral local-destination reference for Racecation recommendations and make that purpose explicit near the import.
4. Remove Leaflet, Recharts, and Leaflet type dependencies after confirming no retained source file imports them; remove Leaflet global CSS.
5. Search source, package files, and route maps for `Nan Connect`, `explore`, `wellness`, `DataStore`, and deleted-route imports. Resolve every hit unless it is a deliberate generic/non-product dependency documented above.

## Task 6: Validate, review, and hand off

**Files:** all changed files; no new runtime secrets.

1. Run `npm install` after dependency changes, then `npm test` and `npm run build`.
2. Run `npm run lint`; separate pre-existing framework/lint issues from introduced issues and fix any regression in changed code.
3. Use a browser/local run to verify Thai and English role picker labels, user/organizer/admin redirection, logout, direct protected-route fallbacks, the footer phone `tel:` link, no duplicate footer, and mobile width/target behavior.
4. Run final removal searches and inspect the change set for accidental deletions of sport event images, Supabase migration/client files, or public footer/back navigation.
5. Commit the verified implementation on `codex/game-on-roles-login`; do not merge or push without explicit user authorization.
