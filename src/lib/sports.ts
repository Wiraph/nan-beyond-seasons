import eventsJson from "@/data/sportsEvents.json";
import type { SeasonKey } from "./weather";

export type SportEvent = {
  id: string;
  name: { th: string; en: string };
  sportType: string;
  icon: string;
  season: SeasonKey;
  dates: { start: string; end: string }; // ISO YYYY-MM-DD
  monthLabel: { th: string; en: string };
  venue: {
    name: { th: string; en: string };
    district: string;
    lat: number;
    lon: number;
  };
  mode: ("spectate" | "compete")[];
  desc: { th: string; en: string };
  highlight: { th: string; en: string };
  /** Optional promo/real photo (path under /public). Falls back to a
   *  branded season-gradient banner when absent. */
  image?: string;
  outdoor: boolean;
  verified: boolean;
};

/** Season-tinted gradient for event hero banners (used when no photo). */
export const SEASON_HERO: Record<SeasonKey, string> = {
  green: "linear-gradient(135deg, #16a34a, #14532d)",
  cool: "linear-gradient(135deg, #0ea5e9, #075985)",
  hot: "linear-gradient(135deg, #f97316, #9a3412)",
};

export const sportEvents = eventsJson as SportEvent[];

export function getEvent(id: string): SportEvent | undefined {
  return sportEvents.find((e) => e.id === id);
}

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export type EventStatus = "live" | "upcoming" | "past";

export function eventStatus(e: SportEvent, now = new Date()): EventStatus {
  const today = startOfDay(now);
  const start = startOfDay(new Date(`${e.dates.start}T00:00:00`));
  const end = startOfDay(new Date(`${e.dates.end}T00:00:00`));
  if (today >= start && today <= end) return "live";
  return today < start ? "upcoming" : "past";
}

/** Whole days until the event starts (0 while it's running). */
export function daysUntil(e: SportEvent, now = new Date()): number {
  const start = startOfDay(new Date(`${e.dates.start}T00:00:00`));
  return Math.max(0, Math.round((start - startOfDay(now)) / DAY_MS));
}

/** Events sorted soonest-first: live events lead, then upcoming, then past. */
export function eventsByUrgency(now = new Date()): SportEvent[] {
  const rank: Record<EventStatus, number> = { live: 0, upcoming: 1, past: 2 };
  return [...sportEvents].sort((a, b) => {
    const ra = rank[eventStatus(a, now)];
    const rb = rank[eventStatus(b, now)];
    if (ra !== rb) return ra - rb;
    return a.dates.start.localeCompare(b.dates.start);
  });
}

/** The hero event: currently live, or the next upcoming. */
export function nextEvent(now = new Date()): SportEvent {
  return eventsByUrgency(now)[0];
}

/** Events grouped by season key in green → cool → hot order (the pitch:
 *  Green Season first, because that's the story of the hackathon). */
export function eventsBySeason(): { season: SeasonKey; events: SportEvent[] }[] {
  const order: SeasonKey[] = ["green", "cool", "hot"];
  return order.map((season) => ({
    season,
    events: sportEvents
      .filter((e) => e.season === season)
      .sort((a, b) => a.dates.start.localeCompare(b.dates.start)),
  }));
}

export const SEASON_ACCENT: Record<SeasonKey, { text: string; bg: string; flag: string }> = {
  green: { text: "text-season-green", bg: "bg-season-green", flag: "season-flag-green" },
  cool: { text: "text-season-cool", bg: "bg-season-cool", flag: "season-flag-cool" },
  hot: { text: "text-season-hot", bg: "bg-season-hot", flag: "season-flag-hot" },
};

const MONTH_TH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const MONTH_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(iso: string, lang: string): string {
  // Date-only strings (event dates like "2026-09-19") are shown literally.
  // Full timestamps (check-ins, stored as UTC ISO) are converted to the
  // viewer's LOCAL date so a check-in just after Thai midnight shows today,
  // not yesterday's UTC date.
  const d = iso.includes("T") ? new Date(iso) : new Date(`${iso}T00:00:00`);
  const months = lang === "th" ? MONTH_TH : MONTH_EN;
  const year = lang === "th" ? d.getFullYear() + 543 : d.getFullYear();
  return `${d.getDate()} ${months[d.getMonth()]} ${year}`;
}

export function fmtRange(e: SportEvent, lang: string): string {
  return e.dates.start === e.dates.end
    ? fmtDate(e.dates.start, lang)
    : `${fmtDate(e.dates.start, lang)} – ${fmtDate(e.dates.end, lang)}`;
}

export const SPORT_TYPE_LABEL: Record<string, { th: string; en: string }> = {
  "boat-race": { th: "แข่งเรือยาว", en: "Longboat racing" },
  run: { th: "วิ่ง", en: "Running" },
  trail: { th: "วิ่งเทรล", en: "Trail running" },
  cycling: { th: "จักรยาน", en: "Cycling" },
  rafting: { th: "ล่องแก่ง", en: "Rafting" },
  folk: { th: "กีฬาพื้นบ้าน", en: "Folk sport" },
  takraw: { th: "เซปักตะกร้อ", en: "Sepak takraw" },
  woodball: { th: "วู้ดบอล", en: "Woodball" },
  multi: { th: "วิ่ง+ปั่น", en: "Run + ride" },
};

/** Loose keywords per event so chat can attach event cards to answers. */
const EVENT_KEYWORDS: Record<string, string[]> = {
  "wa-upper-rafting": ["น้ำว้าตอนบน", "ล่องแก่ง", "rafting", "upper wa"],
  "wa-middle-rafting": ["น้ำว้าตอนกลาง", "น้ำว้า", "ล่องแก่ง", "rafting", "แก่ง", "wa river"],
  "boat-race-festival": ["แข่งเรือ", "เรือยาว", "boat race", "longboat", "ตานก๋วยสลาก", "กฐิน"],
  "kwang-fighting-festival": ["กว่าง", "ด้วง", "kwang", "beetle", "นักสู้แห่งขุนเขา"],
  "nan-mountain-trail": ["nmt", "mountain trail", "ขุนสถาน", "เทรล 100", "วิ่งเทรล"],
  "amazing-nan-marathon": ["มาราธอน", "marathon", "amazing nan", "ข่วงเมือง"],
  "sepak-takraw-t20": ["ตะกร้อ", "takraw", "t20"],
  "golden-orange-games": ["เรือบก", "ส้มสีทอง", "หน้าไม้", "ไทยภูเขา", "golden orange", "crossbow"],
  "rak-pa-nan-trail": ["รักษ์ป่า", "เม้าเท่นรัน", "พญาผานอง", "mountain run"],
  "doi-phu-kha-cycling": ["ปั่น", "จักรยาน", "ดอยภูคา", "1715", "cycling", "bike"],
  "nan-open-woodball": ["วู้ดบอล", "woodball", "nan open"],
  "walk-run-bike-pua": ["walk run bike", "คู่เสี่ยว", "อ่างเก็บน้ำ", "ร.ศ. 200"],
  "klong-pu-ja-contest": ["ก๋องปูจา", "กลองสะบัดชัย", "ตีกลอง", "drum", "วัดสวนตาล"],
  "songkran-folk-games": ["สงกรานต์", "ก่อเจดีย์ทราย", "ชักเย่อ", "songkran", "foam"],
  "muterun-nan": ["muterun", "มูเตรัน", "สายมู", "mutelu"],
  "wa-lower-rafting": ["น้ำว้าตอนล่าง", "ล่องแก่งครอบครัว", "family rafting"],
};

/** Events mentioned in a chunk of text (user question + AI answer). */
export function matchEvents(text: string, max = 2): SportEvent[] {
  const hay = text.toLowerCase();
  const hits: SportEvent[] = [];
  for (const e of sportEvents) {
    const words = [e.name.th, e.name.en.toLowerCase(), ...(EVENT_KEYWORDS[e.id] ?? [])];
    if (words.some((w) => w && hay.includes(w.toLowerCase()))) hits.push(e);
    if (hits.length >= max) break;
  }
  return hits;
}
