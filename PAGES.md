# แผนผังหน้า — Nan Game On

## แอปหลัก (ธีมกีฬา, กลุ่ม route `(sport)`)

| Route | ไฟล์ | หน้าที่ |
|---|---|---|
| `/` | `src/app/(sport)/page.tsx` | ฟีด social แบบ Strava + แถบงานถัดไป · desktop เป็น dashboard 3 คอลัมน์ (โปรไฟล์ / ฟีด / งานถัดไป+อันดับ) |
| `/calendar` | `src/app/(sport)/calendar/page.tsx` | ปฏิทินกีฬา 12 เดือนตามฤดู + countdown + อากาศวันงาน |
| `/events/[id]` | `src/app/(sport)/events/[id]/page.tsx` | รายละเอียดงาน + AI Race-cation Planner |
| `/checkin/[eventId]` | `src/app/(sport)/checkin/[eventId]/page.tsx` | เช็คอิน (จำลองสแกน QR ณ งาน) → แต้ม+แบดจ์+แชร์ลงฟีด |
| `/passport` | `src/app/(sport)/passport/page.tsx` | โปรไฟล์ (ตั้งชื่อ/สี avatar) · แต้ม · แบดจ์ · ประวัติเช็คอิน |
| `/rewards` | `src/app/(sport)/rewards/page.tsx` | แลกแต้มรับสิทธิ์ร้านชุมชน + โค้ดส่วนลด (mockup) |
| `/chat` | `src/app/(sport)/chat/page.tsx` | AI 2 บอท: คู่หูสายกีฬา / ผู้ช่วยแอป |

## API routes

| Route | หน้าที่ |
|---|---|
| `/api/chat` | แชท streaming (SSE) — `mode: "sport" | "help"` |
| `/api/raceplan` | AI จัดทริป 2 วันรอบงานแข่ง (STRICT JSON + validate) |
| `/api/plan` | AI จัดเส้นทาง 1 วัน (ฝั่ง explore) |
| `/api/match` | AI จับคู่ประสบการณ์ wellness (ฝั่ง explore) |
| `/api/weather` | พยากรณ์น่าน 7 วัน (Open-Meteo, cache 30 นาที) |

## ส่วนเสริม (คอนเทนต์ท่องเที่ยว, กลุ่ม route `(tourist)`)

`/explore` สำรวจสถานที่ · `/plan` จัดเส้นทางเที่ยว · `/wellness` จับคู่ประสบการณ์ ·
`/map` แผนที่ · `/place/[id]` รายละเอียดสถานที่ · `/search` ค้นหา ·
`/dashboard*` แดชบอร์ดสถิติ · `/admin*` ระบบหลังบ้านผู้ประกอบการ (mock)

## ข้อมูล (`src/data/`)

`sportsEvents.json` เทศกาลกีฬาจริง 16 งานครบ 3 ฤดู · `seasons.json` ปฏิทินฤดู 12 เดือน · `feedSeed.json` โพสต์ตัวอย่าง ·
`places.json` สถานที่ 15 แห่ง · `wellness.json` ประสบการณ์ 15 รายการ · `hotels/operators.json` ผู้ประกอบการจริง 300+ ราย

## Supabase (`supabase/schema.sql` + `supabase/storage.sql`)

`profiles` · `checkins` · `posts` (มี `image_url`) · `kudos` — RLS เปิด (anon policy สำหรับ prototype)
Storage bucket `post-images` (public) สำหรับรูปในฟีด — โพสต์รูปผ่าน `src/lib/uploadImage.ts` (บีบอัด client → อัปโหลด / fallback dataURL)
