# Supabase Events, Hero Images, and Demo Roles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Supabase the live source for the 16 sporting events and their hero images, while adding clearly labelled visitor, organizer, and administrator demonstration experiences.

**Architecture:** The existing JSON remains an offline fallback. A validated server route maps Supabase `events` rows into the current `SportEvent` shape, and a client provider supplies that shared list to sport-facing screens. Event images are public Storage objects and are uploaded exactly once with a server-only service key. Demo-role state is client-side and visibly marked as non-production authorization.

**Tech Stack:** Next.js 16.2 App Router route handlers, React 19 context, TypeScript, Supabase Postgres/Storage, Vitest, built-in image generation.

## Global Constraints

- Use the `Nan Game On` Supabase project `vdfxdbuvrrnvoxfotnse` in `ap-southeast-1`.
- Keep `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` browser-safe; never expose `SUPABASE_SERVICE_ROLE_KEY`.
- Generate one photorealistic 16:9, no-text/no-logo/no-watermark JPEG for each of the 16 documented events.
- The Vercel client must still render the bundled event JSON when remote data is unavailable.
- Demo roles are UX-only, not a security boundary; UI must say so.
- Do not add to the 12 pre-existing ESLint errors.

---

### Task 1: Create tested event-row mapping and fallback selection

**Files:**
- Create: `src/lib/events/mapper.ts`
- Create: `src/lib/events/mapper.test.ts`
- Modify: `package.json`
- Modify: `src/lib/sports.ts`

**Interfaces:**
- Consumes: `EventRow = { id: string; event_data: unknown; image_path: string | null; display_order: number }`.
- Produces: `mapEventRow(row, imageUrl): SportEvent | null` and `chooseEvents(remote, fallback): SportEvent[]`.

- [ ] **Step 1: Add Vitest and a test command**

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 2: Write the failing mapping tests**

```ts
import { describe, expect, it } from "vitest";
import { chooseEvents, mapEventRow } from "./mapper";

const payload = { id: "boat-race-festival", name: { th: "เรือ", en: "Boat" }, sportType: "boat-race", icon: "ti-sailboat", season: "green", dates: { start: "2026-09-19", end: "2026-10-31" }, monthLabel: { th: "ก.ย.", en: "Sep" }, venue: { name: { th: "น่าน", en: "Nan" }, district: "เมือง", lat: 18.7, lon: 100.7 }, mode: ["spectate"], desc: { th: "", en: "" }, highlight: { th: "", en: "" }, outdoor: true, verified: false };

describe("mapEventRow", () => {
  it("adds a Storage URL to a valid event row", () => {
    expect(mapEventRow({ id: payload.id, event_data: payload, image_path: "boat-race-festival.jpg", display_order: 3 }, "https://cdn.example/boat-race-festival.jpg")?.image).toBe("https://cdn.example/boat-race-festival.jpg");
  });

  it("rejects a malformed remote record and preserves fallback data", () => {
    expect(mapEventRow({ id: "bad", event_data: { name: "bad" }, image_path: null, display_order: 99 }, null)).toBeNull();
    expect(chooseEvents([], [payload] as never[])).toEqual([payload]);
  });
});
```

- [ ] **Step 3: Run the test and confirm it fails because mapper exports do not exist**

Run: `npm test -- src/lib/events/mapper.test.ts`

- [ ] **Step 4: Implement the mapper**

```ts
export type EventRow = { id: string; event_data: unknown; image_path: string | null; display_order: number };

export function mapEventRow(row: EventRow, imageUrl: string | null): SportEvent | null {
  const event = row.event_data as Partial<SportEvent>;
  if (event.id !== row.id || !event.name?.th || !event.name?.en || !event.dates?.start || !event.dates?.end || !event.season) return null;
  return { ...(event as SportEvent), image: imageUrl ?? undefined };
}

export function chooseEvents(remote: SportEvent[], fallback: SportEvent[]): SportEvent[] {
  return remote.length ? remote : fallback;
}
```

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- src/lib/events/mapper.test.ts`

```bash
git add package.json package-lock.json src/lib/events/mapper.ts src/lib/events/mapper.test.ts src/lib/sports.ts
git commit -m "feat: add validated remote event mapping"
```

### Task 2: Create and seed the Supabase event source and image bucket

**Files:**
- Create: `supabase/events.sql`
- Create: `scripts/seed-events.mjs`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `src/data/sportsEvents.json` and `SUPABASE_SERVICE_ROLE_KEY`.
- Produces: `public.events` rows and public `event-images/<id>.jpg` object keys.

- [ ] **Step 1: Write a failing seed validation test**

```ts
import events from "@/data/sportsEvents.json";
import { describe, expect, it } from "vitest";

describe("event seed", () => {
  it("has exactly 16 unique event ids", () => {
    expect(events).toHaveLength(16);
    expect(new Set(events.map((event) => event.id)).size).toBe(16);
  });
});
```

- [ ] **Step 2: Run the test and confirm it passes as a data invariant**

Run: `npm test -- src/lib/events/seed.test.ts`

- [ ] **Step 3: Add the migration SQL and apply it through the Supabase plugin**

```sql
create table if not exists public.events (
  id text primary key,
  event_data jsonb not null,
  image_path text,
  owner_id text,
  display_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "public read events" on public.events for select using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-images', 'event-images', true, 5242880, array['image/jpeg'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg'];
```

Apply with `mcp__codex_apps__supabase_apply_migration` using `project_id: "vdfxdbuvrrnvoxfotnse"` and name `create_events_and_event_images`.

- [ ] **Step 4: Implement and run the idempotent seed script**

```js
const events = JSON.parse(readFileSync(new URL("../src/data/sportsEvents.json", import.meta.url)));
await supabase.from("events").upsert(events.map((event, index) => ({ id: event.id, event_data: event, image_path: `${event.id}.jpg`, display_order: index + 1 })), { onConflict: "id" });
```

Run: `node scripts/seed-events.mjs`

- [ ] **Step 5: Verify the remote rows and commit**

Run with the Supabase plugin: `select count(*) from public.events;`

Expected: `16` rows.

```bash
git add supabase/events.sql scripts/seed-events.mjs .env.example src/lib/events/seed.test.ts
git commit -m "feat: add Supabase event source"
```

### Task 3: Deliver the 16 generated Hero images to Supabase Storage

**Files:**
- Create: `scripts/upload-event-images.mjs`
- Create: `docs/event-image-prompts.used.md`

**Interfaces:**
- Consumes: the 16 prompts in `docs/event-image-prompts.md`, generated local JPEG files, and a service-role key.
- Produces: one public object at `event-images/<event-id>.jpg` for every seeded event.

- [ ] **Step 1: Generate each asset with the built-in image tool**

Use one call per documented event prompt, with this common suffix:

```text
Use case: photorealistic-natural.
Asset type: 16:9 website event hero.
Style: documentary sports photography, natural light, consistent cinematic teal-and-orange grade.
Constraints: no text, no logos, no watermarks, culturally respectful Northern Thai setting, no identifiable real faces.
Avoid: deformed hands, extra limbs, blur, cartoon styling.
```

- [ ] **Step 2: Inspect every generated image and retain only a valid 16:9 result**

Acceptance per asset: correct sport, Nan/Lanna context where relevant, no text/logo/watermark, no visible anatomy defect.

- [ ] **Step 3: Implement the server-only uploader**

```js
for (const event of events) {
  const bytes = await readFile(`assets/events/${event.id}.jpg`);
  const { error } = await supabase.storage.from("event-images").upload(`${event.id}.jpg`, bytes, { contentType: "image/jpeg", cacheControl: "31536000", upsert: true });
  if (error) throw error;
}
```

- [ ] **Step 4: Run the uploader and verify all remote objects**

Run: `node scripts/upload-event-images.mjs`

Verify with the Supabase plugin:

```sql
select count(*) from storage.objects where bucket_id = 'event-images';
```

Expected: `16` objects.

- [ ] **Step 5: Record final prompts and commit source-only changes**

```bash
git add scripts/upload-event-images.mjs docs/event-image-prompts.used.md
git commit -m "feat: add event hero image publishing"
```

### Task 4: Read Supabase events through one Vercel-safe API and provider

**Files:**
- Create: `src/lib/supabase-server.ts`
- Create: `src/app/api/events/route.ts`
- Create: `src/lib/EventsProvider.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/lib/sports.ts`
- Modify: sport pages that call `sportEvents`, `getEvent`, `nextEvent`, or `eventsBySeason`

**Interfaces:**
- Consumes: `GET /api/events -> { events: SportEvent[], source: "supabase" | "fallback" }`.
- Produces: `useEvents(): { events: SportEvent[]; source: "loading" | "supabase" | "fallback"; getEvent(id: string): SportEvent | undefined }`.

- [ ] **Step 1: Write the failing route-mapping test using mocked `EventRow` values**

```ts
it("uses fallback events when the database response is empty", () => {
  expect(chooseEvents([], fallbackEvents)).toBe(fallbackEvents);
});
```

- [ ] **Step 2: Run it and confirm the mapper test suite is RED until the route helper exists**

Run: `npm test -- src/lib/events/mapper.test.ts`

- [ ] **Step 3: Implement the server route with a dynamic GET response**

```ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await readEventRows();
  const remote = rows.flatMap((row) => {
    const url = publicEventImageUrl(row.image_path);
    const event = mapEventRow(row, url);
    return event ? [event] : [];
  });
  const events = chooseEvents(remote, sportEvents);
  return Response.json({ events, source: remote.length ? "supabase" : "fallback" }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
```

- [ ] **Step 4: Implement the provider and replace static event reads in client pages**

```tsx
const EventsContext = createContext<EventsValue | null>(null);
export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<EventsValue>({ events: sportEvents, source: "loading" });
  useEffect(() => { fetch("/api/events").then((res) => res.ok ? res.json() : null).then((data) => data && setValue({ events: data.events, source: data.source })); }, []);
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}
```

- [ ] **Step 5: Run event tests, build, and commit**

Run: `npm test -- src/lib/events/mapper.test.ts`

Run: `npm run build`

```bash
git add src/lib/supabase-server.ts src/app/api/events/route.ts src/lib/EventsProvider.tsx src/app/layout.tsx src/lib/sports.ts src/app
git commit -m "feat: load events from Supabase"
```

### Task 5: Add role-aware demo interfaces

**Files:**
- Create: `src/lib/DemoRoleStore.tsx`
- Create: `src/components/DemoRoleSwitcher.tsx`
- Create: `src/app/(sport)/manage-events/page.tsx`
- Create: `src/components/events/EventEditor.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/SportNav.tsx`
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/app/admin/page.tsx`

**Interfaces:**
- Produces: `useDemoRole(): { role: "user" | "organizer" | "admin"; setRole(role): void; canManage(event): boolean }`.
- Consumes: event provider data and public `events` rows.

- [ ] **Step 1: Write failing role-store tests**

```ts
it("only allows organizers to manage assigned events", () => {
  expect(canManage("organizer", "demo-organizer", "demo-organizer")).toBe(true);
  expect(canManage("organizer", "demo-organizer", "other-organizer")).toBe(false);
  expect(canManage("user", "demo-user", "demo-user")).toBe(false);
  expect(canManage("admin", "demo-admin", "other-organizer")).toBe(true);
});
```

- [ ] **Step 2: Run the test and confirm it fails before the helper exists**

Run: `npm test -- src/lib/demo-role.test.ts`

- [ ] **Step 3: Implement the local demo role store and visible role switcher**

```ts
export type DemoRole = "user" | "organizer" | "admin";
export function canManage(role: DemoRole, viewerId: string, ownerId: string | null) {
  return role === "admin" || (role === "organizer" && ownerId === viewerId);
}
```

The switcher labels every selected role as `Demo mode` and offers `นักท่องเที่ยว`, `ผู้จัดงาน`, and `ผู้ดูแล`.

- [ ] **Step 4: Implement role-tailored screens**

User: keep current sport nav and hide management links.

Organizer: add `จัดการกิจกรรม` navigation and list only rows with `owner_id = "demo-organizer"`.

Admin: retain `/admin`, add event count and links to all event management.

- [ ] **Step 5: Run role tests, build, and commit**

Run: `npm test -- src/lib/demo-role.test.ts`

Run: `npm run build`

```bash
git add src/lib/DemoRoleStore.tsx src/components/DemoRoleSwitcher.tsx src/app/'(sport)'/manage-events/page.tsx src/components/events/EventEditor.tsx src/components/SportNav.tsx src/app/admin
git commit -m "feat: add demo roles for event management"
```

### Task 6: Validate deployment configuration and production boundaries

**Files:**
- Modify: `.env.example`
- Modify: `README.md`

**Interfaces:**
- Documents: Vercel public variables, local-only uploader variable, and the demo-role security boundary.

- [ ] **Step 1: Write a failing environment validation test**

```ts
it("does not require a service role key to serve fallback events", () => {
  expect(readEventConfig({ NEXT_PUBLIC_SUPABASE_URL: "", NEXT_PUBLIC_SUPABASE_ANON_KEY: "" })).toEqual({ enabled: false });
});
```

- [ ] **Step 2: Run test to confirm the configuration helper is absent**

Run: `npm test -- src/lib/events/config.test.ts`

- [ ] **Step 3: Implement `readEventConfig` and document variables**

```ts
export function readEventConfig(env: Record<string, string | undefined>) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { enabled: true, url, key } : { enabled: false };
}
```

Document Vercel variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; document `SUPABASE_SERVICE_ROLE_KEY` as local/upload-only and never as `NEXT_PUBLIC_`.

- [ ] **Step 4: Run the focused tests, build, advisor, and commit**

Run: `npm test -- src/lib/events/config.test.ts src/lib/events/mapper.test.ts src/lib/demo-role.test.ts`

Run: `npm run build`

Run with Supabase plugin: `mcp__codex_apps__supabase_get_advisors({ project_id: "vdfxdbuvrrnvoxfotnse", type: "security" })`

```bash
git add .env.example README.md src/lib/events/config.ts src/lib/events/config.test.ts
git commit -m "docs: explain Supabase event deployment"
```
