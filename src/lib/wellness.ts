import wellnessJson from "@/data/wellness.json";
import { WellnessEntry } from "./types";
import type { SeasonKey } from "./weather";

export const wellnessEntries = wellnessJson as WellnessEntry[];

export function getWellness(id: string): WellnessEntry | undefined {
  return wellnessEntries.find((e) => e.id === id);
}

export type WellnessQuiz = {
  moods: string[];
  pace?: "slow" | "active";
  /** season the visitor is coming in; "now" = current month */
  season?: SeasonKey | "now";
};

export type WellnessMood = {
  key: string;
  icon: string;
  label: { th: string; en: string };
};

export const WELLNESS_MOODS: WellnessMood[] = [
  { key: "relax", icon: "ti-zzz", label: { th: "ผ่อนคลาย ฮีลใจ", en: "Relax & heal" } },
  { key: "spirit", icon: "ti-yoga", label: { th: "สายบุญ จิตใจสงบ", en: "Spiritual & calm" } },
  { key: "hands-on", icon: "ti-hand-finger", label: { th: "ลงมือทำ งานคราฟต์", en: "Hands-on crafts" } },
  { key: "nature", icon: "ti-trees", label: { th: "แช่ตัวในธรรมชาติ", en: "Into nature" } },
  { key: "taste", icon: "ti-tools-kitchen-2", label: { th: "สายกิน ของพื้นเมือง", en: "Local flavours" } },
  { key: "focus", icon: "ti-device-laptop", label: { th: "Workation ทำงานไปเที่ยวไป", en: "Workation" } },
];

export type WellnessMatch = {
  entry: WellnessEntry;
  score: number;
  /** rule keys that fired, for reason chips: mood / pace / season / rain */
  hits: string[];
};

/** Rule-based matcher — also the fallback when the AI route is unavailable.
 *  Weights: shared mood 3 each, pace 2, season 2, year-round 1,
 *  indoor +2 when it's raining. */
export function matchWellness(
  quiz: WellnessQuiz,
  currentSeason: SeasonKey,
  rainy: boolean,
  max = 6
): WellnessMatch[] {
  const season = quiz.season === "now" || !quiz.season ? currentSeason : quiz.season;

  return wellnessEntries
    .map((entry) => {
      let score = 0;
      const hits: string[] = [];

      const moodOverlap = entry.moods.filter((m) => quiz.moods.includes(m)).length;
      if (moodOverlap) {
        score += moodOverlap * 3;
        hits.push("mood");
      }
      if (quiz.pace && entry.pace === quiz.pace) {
        score += 2;
        hits.push("pace");
      }
      if (entry.bestSeasons.length === 0) {
        score += 1;
      } else if (entry.bestSeasons.includes(season)) {
        score += 2;
        hits.push("season");
      }
      if (rainy && entry.indoor) {
        score += 2;
        hits.push("rain");
      }

      return { entry, score, hits };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
}
