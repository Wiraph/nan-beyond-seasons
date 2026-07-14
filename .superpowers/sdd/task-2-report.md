# Task 2 report

## Changed files

- `src/lib/role-access.ts` — added `parseStoredDemoRole`, a pure JSON parser that accepts only the three supported demo roles and treats malformed/unsupported storage values as anonymous.
- `tests/role-access.test.mts` — added coverage for null, malformed JSON, unsupported values, and a valid stored role.
- `src/lib/RoleStore.tsx` — added the browser-only `RoleProvider` and `useRoleSession` hook using the single `nan-game-on:demo-role` local-storage key.
- `src/components/RoleGate.tsx` — added client-side redirects using the existing pure route-access rules, with a non-protected loading/redirect screen.
- `src/components/RoleAccountMenu.tsx` — added the current demo-role display, change-role action, and logout action.
- `src/components/GameOnHeaderActions.tsx` — added a reusable language-switcher/account-controls header action group for later route-shell integration.
- `src/app/login/page.tsx` — added the dedicated three-role, Thai/English-compatible demo selector.
- `src/app/layout.tsx` — composed `RoleProvider` beside the retained application providers.
- `src/app/globals.css` — added shared role-picker, account-action, and management-navigation styles, including 44px minimum controls.

## Test evidence

### Red

Command: `npm test`

Result: exited `1` before the parser implementation, with the expected TypeScript failure:

```text
tests/role-access.test.mts(10,3): error TS2305: Module '"../src/lib/role-access.js"' has no exported member 'parseStoredDemoRole'.
```

### Green

Command: `npm test`

Result: exited `0`; Node reported `tests 10`, `pass 10`, `fail 0`, including:

```text
✔ treats malformed or unsupported stored roles as anonymous
```

Command: `npx eslint src/lib/RoleStore.tsx && npm test && npm run build`

Result: exited `0`. The focused lint command produced no violations; tests again reported `10` passing and `0` failing; `next build` compiled successfully, completed TypeScript, generated all 30 static pages, and finished with exit `0`.

### Lint note

`npm run lint` was run before and after the focused correction. The initial full run reported 13 errors, including the newly introduced `RoleStore.tsx` hydration-effect error. After changing that hydration to the established deferred callback pattern, focused lint passed. The remaining full-project errors are pre-existing, in untouched sport pages and existing stores: `src/app/(sport)/calendar/page.tsx`, `src/app/(sport)/events/[id]/page.tsx`, `src/app/(sport)/page.tsx`, `src/app/(sport)/rewards/page.tsx`, `src/lib/DataStore.tsx`, `src/lib/FeedStore.tsx` (two), `src/lib/PassportStore.tsx`, `src/lib/PlanStore.tsx`, `src/lib/PostStore.tsx`, `src/lib/ProfileStore.tsx`, and `src/lib/adminAuth.tsx`.
