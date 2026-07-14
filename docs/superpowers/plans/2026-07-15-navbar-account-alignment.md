# Navbar Account Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display the active role, change-role action, and logout action on one horizontal row in the Nan Game On navbar.

**Architecture:** Keep the existing `RoleAccountMenu` client component and its role-session actions. Replace its vertical heading/action layout with a single flex row; use visual separators and responsive text hiding to preserve header width.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node built-in test runner.

## Global Constraints

- Retain the existing `/login` navigation and `logout()` session behavior.
- Keep a 44px minimum touch target and visible keyboard focus.
- Do not modify unrelated user changes in the dirty worktree.

---

### Task 1: Align the role account controls in one row

**Files:**
- Modify: `src/components/RoleAccountMenu.tsx`
- Modify: `tests/role-session.test.mts`

**Interfaces:**
- Consumes: `useRoleSession(): { loading: boolean; role: DemoRole | null; logout: () => void }` and `useRouter().push/replace`.
- Produces: a single-row `role-account-menu` with role label, change-role action, and logout action.

- [ ] **Step 1: Write the failing test**

```ts
test("lays account controls out on a single navbar row", () => {
  const menuSource = readFileSync("src/components/RoleAccountMenu.tsx", "utf8");
  assert.match(menuSource, /role-account-menu[^`]*flex[^`]*items-center/);
  assert.doesNotMatch(menuSource, /flex border-t border-current\/15/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/role-session.test.mts`

Expected: FAIL because `RoleAccountMenu` still uses a second `flex border-t` row for actions.

- [ ] **Step 3: Write minimal implementation**

```tsx
<div className={`role-account-menu flex items-center ${tone}`} aria-label="Account controls">
  <p className="min-w-0 truncate px-3 text-xs font-semibold">...</p>
  <button className="role-account-action border-l border-current/15 ...">...</button>
  <button className="role-account-action border-l border-current/15 font-bold text-volt ...">...</button>
</div>
```

Remove the nested top and bottom row wrappers. Keep the existing event handlers unchanged, and retain `whitespace-nowrap` on the action labels.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/role-session.test.mts`

Expected: PASS for both the session-store test and the single-row source assertion.

- [ ] **Step 5: Run focused quality checks**

Run: `npm run lint -- src/components/RoleAccountMenu.tsx && npm run build`

Expected: both commands exit with code 0.

- [ ] **Step 6: Commit**

```powershell
git add -- src/components/RoleAccountMenu.tsx tests/role-session.test.mts
git commit -m "fix: align navbar account controls"
```
