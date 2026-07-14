# คู่มือแก้ไข — อยากแก้อะไร ไปไฟล์ไหน

จัดกลุ่มตาม "อยากแก้อะไร" → ไฟล์ที่ต้องเปิด ไม่ใช่ไล่ทุกไฟล์ในโปรเจกต์

---

## 🏠 แอปหลัก (ธีมกีฬา — ที่ demo/pitch จริง)

| อยากแก้... | ไปที่ไฟล์ |
|---|---|
| **ข้อมูลงานกีฬา** (ชื่อ วันที่ สถานที่ คำอธิบาย รูป) | [`src/data/sportsEvents.json`](../src/data/sportsEvents.json) |
| **หน้าฟีด** (โพสต์/kudos/leaderboard) — โครง+ดีไซน์ | [`src/app/(sport)/page.tsx`](../src/app/(sport)/page.tsx) |
| **โพสต์ตัวอย่างในฟีด** (seed) | [`src/data/feedSeed.json`](../src/data/feedSeed.json) |
| **ปฏิทินกีฬา 12 เดือน** (หน้าที่โชว์ตามฤดู) | [`src/app/(sport)/calendar/page.tsx`](../src/app/(sport)/calendar/page.tsx) |
| **ข้อมูลฤดูกาล** (ชื่อฤดู คำโปรย ไฮไลต์รายเดือน) | [`src/data/seasons.json`](../src/data/seasons.json) |
| **หน้ารายละเอียดงาน** (hero, ปุ่ม AI planner, เช็คอิน) | [`src/app/(sport)/events/[id]/page.tsx`](../src/app/(sport)/events/[id]/page.tsx) |
| **หน้าเช็คอิน** (จำลอง QR, ข้อความ anti-fake) | [`src/app/(sport)/checkin/[eventId]/page.tsx`](../src/app/(sport)/checkin/[eventId]/page.tsx) |
| **หน้า Passport** (โปรไฟล์ แต้ม แบดจ์ ประวัติ) | [`src/app/(sport)/passport/page.tsx`](../src/app/(sport)/passport/page.tsx) |
| **กติกาแบดจ์ / แต้มต่อเช็คอิน** | [`src/lib/PassportStore.tsx`](../src/lib/PassportStore.tsx) |
| **หน้าแลกแต้ม + รายการรางวัล** | [`src/app/(sport)/rewards/page.tsx`](../src/app/(sport)/rewards/page.tsx) + [`src/data/rewards.json`](../src/data/rewards.json) |
| **หน้าแชท 2 บอท** (UI, suggestion chips) | [`src/app/(sport)/chat/page.tsx`](../src/app/(sport)/chat/page.tsx) |
| **คำตอบ/system prompt ของ AI แชท** | [`src/app/api/chat/route.ts`](../src/app/api/chat/route.ts) |
| **AI จัดทริปรอบงานแข่ง (race-cation)** | [`src/app/api/raceplan/route.ts`](../src/app/api/raceplan/route.ts) (prompt) · [`src/lib/raceplan.ts`](../src/lib/raceplan.ts) (fallback) |
| **เมนูล่าง (bottom nav) ของแอปกีฬา** | [`src/components/SportNav.tsx`](../src/components/SportNav.tsx) |
| **สี/ธีม/ตัวอักษร** (โทนส้ม Strava, มุมการ์ด ฯลฯ) | [`src/app/globals.css`](../src/app/globals.css) (ค้นหา `sport-`) |
| **คำแปลไทย/อังกฤษ ทุกข้อความในแอป** | [`src/i18n/dictionaries.ts`](../src/i18n/dictionaries.ts) |
| **ระบบโปรไฟล์ผู้ใช้** (ชื่อ สี avatar) | [`src/lib/ProfileStore.tsx`](../src/lib/ProfileStore.tsx) |
| **ระบบเชื่อม Supabase** (sync ฟีด/เช็คอิน/kudos) | [`src/lib/FeedStore.tsx`](../src/lib/FeedStore.tsx) · [`src/lib/supabase.ts`](../src/lib/supabase.ts) |
| **โครงสร้างตาราง Supabase** | [`supabase/schema.sql`](../supabase/schema.sql) + [`supabase/storage.sql`](../supabase/storage.sql) |
| **อัปโหลด/บีบอัดรูปโพสต์** | [`src/lib/uploadImage.ts`](../src/lib/uploadImage.ts) |
| **พยากรณ์อากาศ (Open-Meteo)** | [`src/lib/weather.ts`](../src/lib/weather.ts) · [`src/app/api/weather/route.ts`](../src/app/api/weather/route.ts) |
| **Type / keyword จับคำของ event** (ใช้ในแชท) | [`src/lib/sports.ts`](../src/lib/sports.ts) |

---

## 🗺️ ส่วนเสริม: เที่ยวน่าน (`/explore`, `/wellness`, `/plan`, `/map`)

| อยากแก้... | ไปที่ไฟล์ |
|---|---|
| ข้อมูลสถานที่ท่องเที่ยว (15 แห่ง) | [`src/data/places.json`](../src/data/places.json) |
| ข้อมูลประสบการณ์ wellness | [`src/data/wellness.json`](../src/data/wellness.json) |
| หน้าแรกสำรวจสถานที่ | [`src/app/(tourist)/explore/page.tsx`](../src/app/(tourist)/explore/page.tsx) |
| หน้าจับคู่ wellness | [`src/app/(tourist)/wellness/page.tsx`](../src/app/(tourist)/wellness/page.tsx) |
| หน้าจัดเส้นทาง 1 วัน (AI plan) | [`src/app/(tourist)/plan/page.tsx`](../src/app/(tourist)/plan/page.tsx) + [`src/app/api/plan/route.ts`](../src/app/api/plan/route.ts) |
| แผนที่ | [`src/app/(tourist)/map/page.tsx`](../src/app/(tourist)/map/page.tsx) |
| รายละเอียดสถานที่ | [`src/app/(tourist)/place/[id]/page.tsx`](../src/app/(tourist)/place/[id]/page.tsx) |

---

## 📊 ส่วนเสริม: Dashboard + Admin (mock)

| อยากแก้... | ไปที่ไฟล์ |
|---|---|
| ตัวเลข KPI แดชบอร์ด | [`src/data/dashboard.json`](../src/data/dashboard.json) |
| หน้า Dashboard ภาพรวม | [`src/app/dashboard/page.tsx`](../src/app/dashboard/page.tsx) |
| ข้อมูลโรงแรม/ผู้ประกอบการ | [`src/data/hotels.json`](../src/data/hotels.json) · [`src/data/operators.json`](../src/data/operators.json) |
| ระบบหลังบ้านจัดการสถานที่/ธุรกิจ/โพสต์ | [`src/app/admin/`](../src/app/admin/) (แยกโฟลเดอร์ตามประเภท) |

---

## 📄 เอกสารส่งงาน (ไม่ใช่โค้ด)

| อยากแก้... | ไปที่ไฟล์ |
|---|---|
| README หลัก (concept, feature, วิธีรัน) | [`README.md`](../README.md) |
| คำอธิบายผลงานส่งกรรมการ | [`docs/SUBMISSION.md`](SUBMISSION.md) |
| Script วิดีโอ demo | [`docs/VIDEO_SCRIPT.md`](VIDEO_SCRIPT.md) |
| Prompt เจนภาพ hero แต่ละงาน | [`docs/event-image-prompts.md`](event-image-prompts.md) |
| แผนผังหน้าเว็บทั้งหมด (route map) | [`PAGES.md`](../PAGES.md) |
| ตัวแปร env ที่ต้องตั้ง | [`.env.example`](../.env.example) |

---

## 💡 เคล็ดลับ

- **อยากแก้แค่ข้อความ/ข้อมูล** (ชื่องาน วันที่ คำอธิบาย) → ไปที่ไฟล์ `.json` ใน `src/data/` เกือบทุกครั้ง ไม่ต้องแตะโค้ด `.tsx`
- **อยากแก้หน้าตา/ดีไซน์** → ไฟล์ `.tsx` ในหน้านั้น + สี/ธีมรวมอยู่ที่ `src/app/globals.css`
- **อยากแก้คำแปล** → `src/i18n/dictionaries.ts` มีทุกข้อความ ค้นด้วย `Ctrl+F` จากคำภาษาไทยที่เห็นในแอป
- ทุกครั้งที่แก้แล้วอยากเช็คว่าพังไหม รัน `npm run build` ก่อน commit
