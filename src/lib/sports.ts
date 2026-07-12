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
  outdoor: boolean;
  verified: boolean;
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
  const d = new Date(`${iso}T00:00:00`);
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
};

/** Loose keywords per event so chat can attach event cards to answers. */
const EVENT_KEYWORDS: Record<string, string[]> = {
  "boat-race-opening": ["แข่งเรือ", "เรือยาว", "boat race", "longboat", "เปิดสนาม"],
  "boat-race-royal-cup": ["แข่งเรือ", "เรือยาว", "ถ้วยพระราชทาน", "boat race", "longboat", "royal cup"],
  "nan-marathon": ["มาราธอน", "marathon", "วิ่งเมือง"],
  "doi-phu-kha-trail": ["เทรล", "trail", "ดอยภูคา", "phu kha"],
  "cycling-route-1715": ["ปั่น", "จักรยาน", "1715", "cycling", "bike"],
  "wa-river-rafting": ["ล่องแก่ง", "น้ำว้า", "rafting", "แก่ง", "wa river"],
  "songkran-fun-run": ["สงกรานต์", "สาดน้ำ", "songkran", "splash"],
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
