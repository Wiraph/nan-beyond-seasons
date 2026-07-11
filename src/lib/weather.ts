import seasonsData from "@/data/seasons.json";
import { Place } from "./types";

/** Mueang Nan city centre — used for the whole province forecast. */
const NAN_LAT = 18.7756;
const NAN_LON = 100.773;

export type WeatherCondition =
  | "clear"
  | "partly"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "storm";

export type DailyForecast = {
  date: string; // YYYY-MM-DD
  condition: WeatherCondition;
  tempMax: number;
  tempMin: number;
  rainChance: number; // 0-100
};

export type SeasonKey = "cool" | "hot" | "green";

export type MonthProfile = {
  month: number;
  season: SeasonKey;
  weather: { th: string; en: string };
  highlights: { th: string[]; en: string[] };
};

const CONDITION_LABEL: Record<WeatherCondition, { th: string; en: string; icon: string }> = {
  clear: { th: "แดดใส", en: "Clear", icon: "ti-sun" },
  partly: { th: "มีเมฆบางส่วน", en: "Partly cloudy", icon: "ti-sun-low" },
  cloudy: { th: "เมฆมาก", en: "Cloudy", icon: "ti-cloud" },
  fog: { th: "หมอกลง", en: "Foggy", icon: "ti-mist" },
  drizzle: { th: "ฝนปรอยๆ", en: "Drizzle", icon: "ti-cloud-rain" },
  rain: { th: "ฝนตก", en: "Rain", icon: "ti-cloud-rain" },
  storm: { th: "ฝนฟ้าคะนอง", en: "Thunderstorm", icon: "ti-cloud-storm" },
};

export function conditionLabel(c: WeatherCondition) {
  return CONDITION_LABEL[c];
}

/** WMO weather interpretation codes → simple buckets. */
function codeToCondition(code: number): WeatherCondition {
  if (code === 0) return "clear";
  if (code <= 2) return "partly";
  if (code === 3) return "cloudy";
  if (code <= 48) return "fog";
  if (code <= 57) return "drizzle";
  if (code <= 67) return "rain";
  if (code <= 77) return "rain"; // snow codes — never in Nan, treat as rain
  if (code <= 82) return "rain";
  return "storm";
}

// Module-level cache: Open-Meteo asks apps to avoid hammering the API, and
// the forecast only changes a few times a day.
let cache: { at: number; days: DailyForecast[] } | null = null;
const CACHE_MS = 30 * 60 * 1000;

/** 7-day Nan forecast from Open-Meteo (free, no key). Returns [] on failure
 *  so callers can degrade to season-profile-only behaviour. */
export async function getNanForecast(): Promise<DailyForecast[]> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.days;

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${NAN_LAT}&longitude=${NAN_LON}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=Asia%2FBangkok&forecast_days=7`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return cache?.days ?? [];
    const data = (await res.json()) as {
      daily?: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_probability_max: (number | null)[];
      };
    };
    const d = data.daily;
    if (!d?.time?.length) return cache?.days ?? [];
    const days: DailyForecast[] = d.time.map((date, i) => ({
      date,
      condition: codeToCondition(d.weather_code[i] ?? 3),
      tempMax: Math.round(d.temperature_2m_max[i] ?? 0),
      tempMin: Math.round(d.temperature_2m_min[i] ?? 0),
      rainChance: Math.round(d.precipitation_probability_max[i] ?? 0),
    }));
    cache = { at: Date.now(), days };
    return days;
  } catch {
    return cache?.days ?? [];
  }
}

export function getMonthProfile(month: number): MonthProfile {
  const m = seasonsData.months.find((x) => x.month === month) ?? seasonsData.months[0];
  return m as MonthProfile;
}

export function getSeason(month: number) {
  const profile = getMonthProfile(month);
  const season = seasonsData.seasons[profile.season];
  return { key: profile.season as SeasonKey, ...season };
}

/** Nature spots are rain-sensitive; temples, museums, weaving houses and
 *  markets work in any weather. */
export function isOutdoorPlace(place: Place): boolean {
  return place.craftType === "nature";
}

export function isRainy(day: DailyForecast | undefined): boolean {
  if (!day) return false;
  return day.condition === "rain" || day.condition === "storm" || day.rainChance >= 60;
}

/** Compact English weather+season block for AI system prompts. */
export function buildWeatherContext(days: DailyForecast[], month: number): string {
  const profile = getMonthProfile(month);
  const season = getSeason(month);
  const lines: string[] = [
    `Current season: ${season.name.en} (${season.key}). ${profile.weather.en}.`,
    `Season highlights: ${profile.highlights.en.join("; ")}.`,
  ];
  if (days.length) {
    lines.push("7-day forecast for Nan:");
    for (const d of days) {
      lines.push(
        `- ${d.date}: ${conditionLabel(d.condition).en}, ${d.tempMin}-${d.tempMax}C, rain chance ${d.rainChance}%`
      );
    }
  }
  return lines.join("\n");
}
