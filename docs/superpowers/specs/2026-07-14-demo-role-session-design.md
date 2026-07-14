# Demo Role Session Design

## Goal

Every fresh visit to Nan Game On starts at `/login`. A visitor selects one of
the three credential-free demo roles before opening any role-specific page.

## Behavior

- The selected `user`, `organizer`, or `admin` role lives only in React memory.
- Selecting a role routes the visitor to that role's existing home page and
  preserves access while the current app session stays open.
- Refreshing the browser, reopening the site, or opening a URL directly starts
  with no active role; `RoleGate` redirects the visitor to `/login`.
- Logging out still clears the in-memory role immediately and routes to login.
- No role value is written to or read from `localStorage`, session storage,
  Supabase, or an API. This remains a credential-free UI demonstration, not
  authentication.

## Implementation

- Simplify `RoleProvider` to finish loading immediately with `role: null`.
- Keep its `selectRole` and `logout` public API so the login page, role gates,
  and account controls need no behavior changes.
- Remove the legacy local-storage key and parser dependency from the provider.
- Update role tests to state that persisted role parsing is no longer part of
  the app session model, while retaining route-access checks.

## Validation

- Add a regression test for the session-only role model.
- Run `npm test`, `npx tsc --noEmit`, and `npm run build`.
- Manually confirm a role can navigate within one browser session and a fresh
  visit to `/admin` lands on `/login`.
