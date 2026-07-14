# Demo Role Session Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Start every new Nan Game On visit at `/login` by retaining demo roles only in the current React session.

**Architecture:** `RoleProvider` begins unauthenticated and stores a selected role only in component state. Existing `RoleGate` continues to redirect a missing role to `/login`; no route or navigation component changes.

**Tech Stack:** Next.js App Router, React context, Node test runner, TypeScript.

## Global Constraints

- Keep exactly `user`, `organizer`, and `admin` as credential-free demo roles.
- Do not persist roles to localStorage, session storage, Supabase, or an API.
- Preserve existing role route allow-list and role selection UI.

---

### Task 1: Make demo roles session-only

**Files:**
- Modify: `src/lib/RoleStore.tsx`
- Modify: `tests/role-session.test.mts`
- Modify: `scripts/test-public-navigation.mjs`

**Interfaces:**
- Consumes: `useRoleSession()` with `loading`, `role`, `selectRole`, and `logout`.
- Produces: a provider whose initial role is `null` after every full page load.

- [x] **Step 1: Write the failing test**

```ts
test("keeps demo roles only in the open app session", () => {
  const storeSource = readFileSync("src/lib/RoleStore.tsx", "utf8");
  assert.match(storeSource, /useState<DemoRole \| null>\(null\)/);
  assert.doesNotMatch(storeSource, /localStorage|sessionStorage/);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL because `RoleStore.tsx` reads and writes `localStorage`.

- [x] **Step 3: Write minimal implementation**

```tsx
const [role, setRole] = useState<DemoRole | null>(null);
const loading = false;

const selectRole = (nextRole: DemoRole) => setRole(nextRole);
const logout = () => setRole(null);
```

Remove the storage key, storage parser import, and hydration effect.

- [x] **Step 4: Run verification**

Run: `npm test; npx tsc --noEmit; npm run build`

Expected: all tests pass, TypeScript passes, and the production build lists `/login` and the existing role routes.

- [x] **Step 5: Commit**

```bash
git add src/lib/RoleStore.tsx tests/role-session.test.mts scripts/test-public-navigation.mjs
git commit -m "fix: start new visits at demo role login"
```
