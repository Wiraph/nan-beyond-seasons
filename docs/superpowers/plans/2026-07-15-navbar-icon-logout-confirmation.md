# Navbar Icon Logout Confirmation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use an icon-only logout control next to the language picker and require confirmation before ending the demo session.

**Architecture:** Extend the existing client-side `RoleAccountMenu` with local confirmation state and render an accessible overlay dialog. Preserve `GameOnHeaderActions` as the right-aligned flex grouping.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Node test runner.

## Global Constraints

- Keep language and logout controls horizontally grouped at the far right.
- Only confirmed logout calls `logout()` then `router.replace("/login")`.
- Keep 44px touch targets and accessible names.

---

### Task 1: Add icon logout confirmation

**Files:**
- Modify: `src/components/RoleAccountMenu.tsx`
- Modify: `tests/role-session.test.mts`

- [ ] Add a failing source test that requires `showLogoutConfirm` state, an icon-only logout trigger, and a `role="dialog"` confirmation UI.
- [ ] Run `node --test tests/role-session.test.mts` and observe the expected failure.
- [ ] Implement the local confirmation dialog, Escape/backdrop cancellation, icon-only trigger, and confirmed logout handler.
- [ ] Re-run the focused test, `npm run lint -- src/components/RoleAccountMenu.tsx`, and `npm run build`.
- [ ] Commit only the component and test.
