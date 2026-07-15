import destinationJson from "@/data/places.json";
import type { Destination } from "@/lib/types";

// places.json is intentionally retained as a small, local destination reference
// for Nan Game On chat cards and Racecation recommendations only.
export const destinations = destinationJson as Destination[];

/** Attach a place card only when the destination is actually named in the text
 *  (the user question + the AI answer), matching the Thai or English name as a
 *  whole. This keeps the cards to things that were really mentioned instead of
 *  loosely matching a shared word like "Nan". */
export function matchDestinations(query: string, max = 4): Destination[] {
  // Strip whitespace so spacing differences (e.g. "แห่งชาติ น่าน" vs
  // "แห่งชาติน่าน") still match the full place name.
  const hay = query.toLowerCase().replace(/\s+/g, "");
  return destinations
    .filter((destination) =>
      [destination.name.th, destination.name.en].some((name) => {
        const needle = name?.toLowerCase().replace(/\s+/g, "");
        return needle && hay.includes(needle);
      })
    )
    .slice(0, max);
}

export function fallbackSportReply(lang: "th" | "en") {
  return lang === "th"
    ? "ดูปฏิทินเพื่อเลือกงานกีฬา แล้วใช้ Racecation บนหน้างานเพื่อจัดแผนรอบสนามแข่งได้เลย"
    : "Choose an event in the calendar, then use Racecation on its event page to plan nearby stops.";
}
