# Navbar account menu design

## Goal

Make the account controls in the Nan Game On navbar compact, legible, and visually aligned with the light navy-and-orange sport theme.

## Chosen approach

Replace the persistent two-row account panel with one account trigger in the navbar. The trigger shows the active demo role and a chevron. Selecting it opens a compact right-aligned menu.

Alternatives considered:

1. Keep the current panel and only recolor it. This leaves the navbar crowded.
2. Keep logout always visible as a separate orange text action. This is fast to find, but competes with navigation at narrow widths.
3. Use an account trigger with a menu (chosen). It preserves both actions while keeping the header clean.

## Components and behavior

`RoleAccountMenu` remains a client component because it reads role session state and handles navigation. It will contain:

- An accessible button trigger with the role name, account icon, and expanded state.
- A popover menu with `Change role` and `Log out` actions.
- An outside-click backdrop that closes the menu.

`GameOnHeaderActions` remains unchanged as the composition point beside `LangSwitcher`. The menu should align to the right edge of its trigger, avoid wrapping in the header, and preserve usable touch targets on small screens.

## Visual treatment

The trigger uses a white surface, subtle neutral border, navy text, and orange icon accent. The menu uses the same surface with a restrained shadow. `Log out` is a full-width orange action with a logout icon; `Change role` remains navy/neutral. Hover and visible-focus states use the existing orange accent.

## Accessibility and verification

The trigger exposes `aria-expanded` and `aria-haspopup`. All controls retain descriptive accessible names and a minimum 44px touch target. Verification will cover the existing role-session behavior and a production build/type check; logout must still clear the role and route to `/login`, while changing role still routes to `/login` without clearing the session first.
