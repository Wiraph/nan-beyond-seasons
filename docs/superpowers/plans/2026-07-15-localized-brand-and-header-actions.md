# Localized Brand and Header Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Localize the visible brand and place language and logout controls as a rightmost pair.

**Architecture:** Add a reusable client brand-wordmark component that reads the existing locale. Split logout confirmation into a dedicated client control so `GameOnHeaderActions` can render language and logout adjacently.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4.

## Global Constraints

- Thai: “ฤดูม่วนน่าน” / “ม่วนได้ทุกฤดู ที่น่าน”; English: “Ruedu Muan Nan” / “Joyful Every Season in Nan”.
- The language and icon-only logout controls must be adjacent at the far right.
- Confirmed logout must retain its current behavior; do not modify JSON/data.

---

### Task 1: Localize brand and group header actions

**Files:**
- Create: `src/components/BrandWordmark.tsx`
- Create: `src/components/LogoutButton.tsx`
- Modify: `src/components/GameOnHeaderActions.tsx`, `src/components/RoleAccountMenu.tsx`, visible header/footer TSX files, `tests/role-session.test.mts`

- [ ] Add a failing source test requiring the localized brand component and dedicated logout control.
- [ ] Implement the two focused components and update headers to use the brand component.
- [ ] Render `RoleAccountMenu`, then an adjacent language/logout action pair in `GameOnHeaderActions`.
- [ ] Run focused tests, lint, and production build.
