# Nan Game On Role Login and Nan Connect Removal Design

## Goal

Make Nan Game On the only product in this repository. Visitors select one of
three demo roles on a login page, then see only the navigation and screens
appropriate to that role.

## Scope

- Remove the Nan Connect visitor product and its routes, data, components, and
  navigation: Explore, map, route planner, wellness matching, places,
  businesses, posts, QR tourist landing, and the Nan Connect dashboard.
- Preserve the Nan Game On sport product, event image storage, event data,
  passport, rewards, check-in, calendar, and sport AI chat.
- Replace the current two-role `/admin` mock login with a single `/login` role
  picker. It has exactly three choices: `user`, `organizer`, and `admin`.
- Do not ask for a name, email address, password, or any other credential.
- Treat this as a demo role selector, not authentication. The selected role is
  stored only in browser local storage and cannot protect production data.

## Entry and Navigation

1. A visitor with no selected role is redirected to `/login`.
2. `/login` presents three clearly labelled role cards:
   - นักท่องเที่ยว / User → `/`
   - ผู้จัดงาน / Organizer → `/organizer`
   - ผู้ดูแลระบบ / Admin → `/admin`
3. Every authenticated demo screen includes a compact account control with the
   current role, `เปลี่ยนบทบาท` (returns to `/login`), and `ออกจากระบบ`
   (clears the role and returns to `/login`).
4. A role accessing a route outside its scope is redirected to its own home.

## Role Areas

| Role | Home | Available menu |
| --- | --- | --- |
| User | `/` | Feed, calendar, passport, rewards, AI assistant |
| Organizer | `/organizer` | Overview, my events, create event, event check-ins |
| Admin | `/admin` | Overview, all events, organizers/users |

The organizer and admin areas are first-release management shells. They show
the relevant current event data and role-specific menu structure, but do not
introduce a real user-account backend in this change.

## Architecture

- Add a focused `RoleProvider` and role guard for the demo role session. It
  exposes `role`, `selectRole`, and `logout` to client components.
- Add a reusable `RoleAccountMenu` used in public sport, organizer, and admin
  headers.
- Keep authorization decisions client-side and explicit through a route-to-role
  access map. Do not use the Supabase service role key in the browser.
- Rebuild the shared public footer as Nan Game On only. Its links are Home,
  Calendar, Passport, Rewards, and AI assistant; tourist-support contact and
  safety information remain.
- Remove the tourist route group and all imports that only support Nan Connect.
  Delete obsolete code rather than leaving hidden routes or unused product
  branding.

## Nan Connect Removal Completeness

- Delete, rather than redirect or hide, the Nan Connect route group and its
  route-specific components, data stores, APIs, mock AI matching, and static
  data when they have no Nan Game On consumer.
- Remove shared-looking code only when it is Nan Connect-specific. Keep generic
  primitives and the sport event-image/Supabase code that Nan Game On still
  uses.
- Replace or remove references from headers, mobile navigation, footers, role
  guards, route maps, TypeScript imports, and `package.json` dependencies when
  they become unused.
- Before delivery, search the source tree for `Nan Connect`, `explore`,
  `wellness`, `DataStore`, and removed route imports; each remaining result
  must be a deliberate Nan Game On usage or be deleted.

## Data and Security Boundaries

- Existing Supabase event image storage remains unchanged.
- The demo role selector may not grant database privileges. The later
  production-auth phase will use Supabase Auth, a `profiles` role column, and
  Row Level Security policies.
- No role picker choice is sent to Supabase in this phase.

## Visual and Accessibility Requirements

- Role cards and account-menu actions have 44px minimum interactive targets.
- The login page uses Nan Game On branding only; no `Nan Connect` text,
  navigation, or visual treatment remains in visitor-facing screens.
- Preserve the existing Thai/English language switcher.
- Preserve the public footer and the clear 44px Back control on non-hub sport
  pages.

## Verification

- Unit-test role-route access and fallback destinations.
- Verify role selection routes User, Organizer, and Admin to their stated
  homes; verify logout and role switching clear or replace the stored role.
- Verify direct navigation to a disallowed area redirects to the correct role
  home.
- Run `npm test` and `npm run build`.
- Check desktop and narrow mobile layouts for the login page, each role menu,
  footer, and the absence of Nan Connect labels/routes.
- Confirm deleted Nan Connect routes return the normal not-found page and
  TypeScript reports no import references to removed modules.

## Out of Scope

- Email/password, magic-link, Google, or other real authentication.
- Persisting user, organizer, or admin records in Supabase.
- Supabase RLS role enforcement.
- Creating a production-grade event editing workflow beyond the first-release
  role-specific management shell.
