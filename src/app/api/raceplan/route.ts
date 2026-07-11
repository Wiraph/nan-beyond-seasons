import type { NextRequest } from "next/server";
import { getEvent } from "@/lib/sports";
import { placesNearVenue } from "@/lib/raceplan";
import { buildWeatherContext, getNanForecast } from "@/lib/weather";

export const runtime = "nodejs";
export const maxDuration = 30;

const LANG_NAME: Record<string, string> = {
  th: "Thai",
  en: "English",
  zh: "Chinese",
  ja: "Japanese",
  lo: "Lao",
  id: "Indonesian",
  vi: "Vietnamese",
  my: "Burmese",
};

function fallback(reason: string) {
  return Response.json({ fallback: true, reason }, { status: 200 });
}

function extractJson(text: string): unknown | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return fallback("no-key");

  let body: { eventId?: string; lang?: string };
  try {
    body = await req.json();
  } catch {
    return fallback("bad-request");
  }

  const event = getEvent(body.eventId ?? "");
  if (!event) return fallback("no-event");

  const lang = body.lang ?? "th";
  const langName = LANG_NAME[lang] ?? "Thai";

  const nearby = placesNearVenue(event, 8);
  const placeContext = nearby
    .map(
      (p) =>
        `- id:${p.id} | ${p.name.en} (${p.name.th}) | ${p.district} | ${p.craftType} | ${p.km.toFixed(1)} km from venue | ${p.summary.en}`
    )
    .join("\n");

  const forecast = await getNanForecast();
  const weatherContext = buildWeatherContext(forecast, new Date(`${event.dates.start}T00:00:00`).getMonth() + 1);

  const system = `You are a "race-cation" trip planner for Nan province, Thailand — you build short trips around sports events so visitors stay longer and spend with local communities.

Event:
${event.name.en} (${event.name.th}) | ${event.dates.start} to ${event.dates.end} | venue: ${event.venue.name.en}, ${event.venue.district} | ${event.desc.en}

Build a 2-day plan: Day 1 is the event day (attend the event, then nearby stops), Day 2 explores attractions near the venue. Adapt to the weather below — indoor stops for wet afternoons, outdoor beauty when clear. Favour community businesses (markets, weaving houses, local food).
Reply with STRICT JSON ONLY, no prose, no markdown fences:
{"days":[{"label":"<short day label in ${langName}>","stops":[{"time":"HH:MM","title":"<stop title in ${langName}>","placeId":"<id from list or null for the event itself>","note":"<one short ${langName} sentence>"}]}],"tips":["<short ${langName} practical tip>"]}
2 days, 3-4 stops each, max 2 tips. placeId must be an id from the list below or null.

${weatherContext}

Nearby places:
${placeContext}`;

  const DEFAULT_CHAIN = [
    "google/gemma-4-26b-a4b-it:free",
    "google/gemma-4-31b-it:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "openai/gpt-oss-120b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen3-next-80b-a3b-instruct:free",
  ];
  const envModels = (process.env.OPENROUTER_MODEL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const candidates = [...new Set([...envModels, ...DEFAULT_CHAIN])];

  for (const model of candidates) {
    let upstream: Response;
    try {
      upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
          "X-Title": process.env.OPENROUTER_APP_NAME ?? "Nan Game On",
        },
        body: JSON.stringify({
          model,
          stream: false,
          temperature: 0.5,
          max_tokens: 2500,
          reasoning: { effort: "low" },
          messages: [{ role: "system", content: system }],
        }),
      });
    } catch {
      continue;
    }

    if (!upstream.ok) continue;

    let data: { choices?: { message?: { content?: string } }[] };
    try {
      data = await upstream.json();
    } catch {
      continue;
    }

    const content = data.choices?.[0]?.message?.content ?? "";
    const parsed = extractJson(content) as
      | {
          days?: { label?: string; stops?: { time?: string; title?: string; placeId?: string | null; note?: string }[] }[];
          tips?: string[];
        }
      | null;

    const validIds = new Set(nearby.map((p) => p.id));
    const days = (parsed?.days ?? [])
      .map((d) => ({
        label: typeof d.label === "string" ? d.label : "",
        stops: (d.stops ?? [])
          .filter((s) => s && typeof s.title === "string")
          .map((s) => ({
            time: typeof s.time === "string" ? s.time : "",
            title: s.title as string,
            placeId: s.placeId && validIds.has(s.placeId) ? s.placeId : null,
            note: typeof s.note === "string" ? s.note : "",
          })),
      }))
      .filter((d) => d.stops.length);

    if (days.length) {
      return Response.json({
        days,
        tips: Array.isArray(parsed?.tips) ? parsed!.tips.slice(0, 3) : [],
        model,
      });
    }
  }

  return fallback("all-models-busy");
}
