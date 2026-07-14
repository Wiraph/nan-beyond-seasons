import { destinations } from "./destination-reference";
import { isOutdoorPlace } from "./weather";
import type { SportEvent } from "./sports";
import type { Destination } from "./types";

export type RacePlanStop = {
  time: string;
  title: string;
  placeId: string | null;
  note: string;
};

export type RacePlanDay = {
  label: string;
  stops: RacePlanStop[];
};

export type RacePlan = {
  days: RacePlanDay[];
  tips: string[];
};

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Places nearest to the event venue, mixed craft types, for AI context
 *  and the rule-based fallback. */
export function placesNearVenue(event: SportEvent, max = 8): (Destination & { km: number })[] {
  return destinations
    .map((p) => ({ ...p, km: haversineKm(event.venue, p) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, max);
}

/** Rule-based 2-day race-cation used when the AI route is unavailable:
 *  Day 1 = event day (event in the morning slot, nearby food/culture after),
 *  Day 2 = three nearest attractions, indoor-first when it's rainy. */
export function fallbackRacePlan(
  event: SportEvent,
  lang: string,
  rainy: boolean
): RacePlan {
  const th = lang === "th";
  const nearby = placesNearVenue(event, 8);
  const pick = (pred: (p: Destination & { km: number }) => boolean, n: number) =>
    nearby.filter(pred).slice(0, n);

  const day1After = pick((p) => !isOutdoorPlace(p), 2);
  const day2Pool = nearby.filter((p) => !day1After.some((x) => x.id === p.id));
  const day2 = rainy
    ? [...day2Pool.filter((p) => !isOutdoorPlace(p)), ...day2Pool.filter(isOutdoorPlace)].slice(0, 3)
    : day2Pool.slice(0, 3);

  return {
    days: [
      {
        label: th ? "วันงานแข่ง" : "Race day",
        stops: [
          {
            time: "08:30",
            title: th ? `ร่วมงาน ${event.name.th}` : `Join ${event.name.en}`,
            placeId: null,
            note: th ? event.highlight.th : event.highlight.en,
          },
          ...day1After.map((p, i) => ({
            time: i === 0 ? "14:30" : "17:00",
            title: th ? p.name.th ?? p.name.en : p.name.en,
            placeId: p.id,
            note: th
              ? `ห่างจากงาน ${p.km.toFixed(1)} กม.`
              : `${p.km.toFixed(1)} km from the venue`,
          })),
        ],
      },
      {
        label: th ? "วันเที่ยวต่อ" : "Day after",
        stops: day2.map((p, i) => ({
          time: ["09:00", "11:30", "14:30"][i] ?? "16:00",
          title: th ? p.name.th ?? p.name.en : p.name.en,
          placeId: p.id,
          note: th ? p.summary.th ?? p.summary.en : p.summary.en,
        })),
      },
    ],
    tips: rainy
      ? [
          th
            ? "ช่วงนี้ฝนตกบ่อย พกเสื้อกันฝน และเผื่อเวลาเดินทางบนถนนภูเขา"
            : "Rain is frequent — pack a rain jacket and allow extra time on mountain roads",
        ]
      : [],
  };
}
