import type { LangCode } from "@/i18n/dictionaries";

export type LocalizedText = { en: string; th?: string };

export function loc(value: LocalizedText | undefined, lang: LangCode): string {
  if (!value) return "";
  return lang === "th" ? value.th ?? value.en : value.en;
}

export function districtLoc(value: string, _lang: LangCode): string {
  return value;
}

/** Local destination context used only by Game On chat and Racecation plans. */
export type Destination = {
  id: string;
  name: LocalizedText;
  district: string;
  type: "culture" | "food" | "heritage" | "museum" | "outdoor";
  lat: number;
  lon: number;
  summary: LocalizedText;
};
