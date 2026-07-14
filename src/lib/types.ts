import type { LangCode } from "@/i18n/dictionaries";

export type LocalizedText = { en: string; th?: string };

export function loc(value: LocalizedText | undefined, lang: LangCode): string {
  if (!value) return "";
  return lang === "th" ? value.th ?? value.en : value.en;
}

/** Districts are stored inconsistently across the data files — sportsEvents.json
 *  uses Thai ("อ.ปัว") while places.json uses English ("Pua"). Map both forms to a
 *  canonical pair so either source renders in the reader's language. */
const DISTRICTS: readonly { th: string; en: string }[] = [
  { th: "อ.เมืองน่าน", en: "Mueang Nan" },
  { th: "อ.ภูเพียง", en: "Phu Phiang" },
  { th: "อ.บ่อเกลือ", en: "Bo Kluea" },
  { th: "อ.ปัว", en: "Pua" },
  { th: "อ.นาน้อย", en: "Na Noi" },
  { th: "อ.ท่าวังผา", en: "Tha Wang Pha" },
  { th: "อ.แม่จริม", en: "Mae Charim" },
  { th: "อ.สันติสุข–อ.แม่จริม", en: "Santi Suk–Mae Charim" },
];

const DISTRICT_BY_TH = new Map(DISTRICTS.map((d) => [d.th, d]));
const DISTRICT_BY_EN = new Map(DISTRICTS.map((d) => [d.en, d]));

export function districtLoc(value: string, lang: LangCode): string {
  const entry = DISTRICT_BY_TH.get(value) ?? DISTRICT_BY_EN.get(value);
  if (!entry) return value;
  return lang === "th" ? entry.th : entry.en;
}

/** Local destination context used only by the chat cards and Racecation plans. */
export type Destination = {
  id: string;
  name: LocalizedText;
  district: string;
  type: "culture" | "food" | "heritage" | "museum" | "outdoor";
  lat: number;
  lon: number;
  summary: LocalizedText;
};
