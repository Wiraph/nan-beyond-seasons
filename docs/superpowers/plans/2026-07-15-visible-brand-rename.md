# Visible Brand Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace visible product name copy with “ฤดูม่วนน่าน” and “ม่วนได้ทุกฤดู ที่น่าน” without modifying JSON or internal data.

**Architecture:** Update only JSX/TSX text rendered to users, preserving routes, API identifiers, JSON, and data models.

**Tech Stack:** Next.js 16, React 19, TypeScript.

## Global Constraints

- Do not edit `.json` files, route/API identifiers, or internal data.
- Change only visible product-name text.

---

### Task 1: Replace visible brand copy

**Files:**
- Modify: only `src/**/*.tsx` files containing rendered “Nan Game On” text.
- Test: `tests/role-session.test.mts`

- [ ] Locate rendered product-name literals in TSX files; exclude comments and backend/API files.
- [ ] Replace visible header and helper copy with “ฤดูม่วนน่าน”, using “ม่วนได้ทุกฤดู ที่น่าน” as the brand subline where the header supports one.
- [ ] Run focused tests and a production build.
