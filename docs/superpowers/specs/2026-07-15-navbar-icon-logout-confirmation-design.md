# Navbar icon logout confirmation design

## Goal

Make the language and logout controls visually consistent and compact while preventing accidental logout.

## Chosen design

Keep the existing language pill. Replace the visible logout label with a square icon-only button using the existing orange logout icon. `GameOnHeaderActions` continues to group language and account controls in one horizontal flex row at the far right of each header.

When the logout icon is selected, `RoleAccountMenu` shows a centered confirmation dialog with a dimmed backdrop. The dialog explains that the current demo session will end, offers a neutral Cancel action, and offers an orange Confirm logout action. Cancel, backdrop selection, and Escape close the dialog without changing the session. Only confirmation calls `logout()` and then `router.replace("/login")`.

## Scope and accessibility

The role label and change-role action remain unchanged. The icon-only logout control has an explicit Thai/translated accessible label and title. The dialog uses `role="dialog"`, `aria-modal="true"`, a labelled heading, keyboard Escape support, visible focus, and 44px touch targets.

## Verification

Add source-level regression coverage for icon-only logout markup and confirmation state. Run the focused role session test, lint the modified component, and run a production build.
