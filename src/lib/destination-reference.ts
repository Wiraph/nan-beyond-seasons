import destinationJson from "@/data/places.json";
import type { Destination } from "@/lib/types";

// places.json is intentionally retained as a small, local destination reference
// for Nan Game On chat cards and Racecation recommendations only.
export const destinations = destinationJson as Destination[];

const DEFAULT_DESTINATIONS = ["wat-phumin", "kad-khuang-walking-street", "doi-phu-kha"];

export function matchDestinations(query: string): Destination[] {
  const words = query.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const matches = destinations.filter((destination) =>
    words.some((word) =>
      `${destination.name.en} ${destination.district} ${destination.type} ${destination.summary.en}`
        .toLowerCase()
        .includes(word)
    )
  );
  const selected = matches.length ? matches : destinations.filter((destination) => DEFAULT_DESTINATIONS.includes(destination.id));
  return selected.slice(0, 3);
}

export function fallbackSportReply(lang: "th" | "en") {
  return lang === "th"
    ? "ดูปฏิทินเพื่อเลือกงานกีฬา แล้วใช้ Racecation บนหน้างานเพื่อจัดแผนรอบสนามแข่งได้เลย"
    : "Choose an event in the calendar, then use Racecation on its event page to plan nearby stops.";
}
