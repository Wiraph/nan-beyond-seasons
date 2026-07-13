import type { NextRequest } from "next/server";
import { wellnessEntries, WELLNESS_MOODS } from "@/lib/wellness";
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

  let body: { moods?: string[]; pace?: string; season?: string; lang?: string };
  try {
    body = await req.json();
  } catch {
    return fallback("bad-request");
  }

  const lang = body.lang ?? "th";
  const langName = LANG_NAME[lang] ?? "Thai";
  const moods = Array.isArray(body.moods) ? body.moods : [];
  if (!moods.length) return fallback("no-moods");

  const moodLabels = moods
    .map((m) => WELLNESS_MOODS.find((x) => x.key === m)?.label.en ?? m)
    .join(", ");

  const catalogue = wellnessEntries
    .map(
      (e) =>
        `- id:${e.id} | ${e.name.en} (${e.name.th}) | ${e.district} | type:${e.type} | moods:${e.moods.join("/")} | pace:${e.pace} | bestSeasons:${e.bestSeasons.join("/") || "all-year"} | ${e.indoor ? "indoor" : "outdoor"} | ${e.summary.en}`
    )
    .join("\n");

  const forecast = await getNanForecast();
  const weatherContext = buildWeatherContext(forecast, new Date().getMonth() + 1);

  const system = `You are a wellness & experience matchmaker for Nan province, Thailand.
The visitor wants: ${moodLabels}. Trip pace: ${body.pace ?? "any"}. Visiting season: ${body.season ?? "now"}.
Pick the 5 best-fitting experiences from the catalogue for this visitor, considering their interests, the season and the real weather below (prefer indoor picks for rainy slots, and proactively surface Green Season magic when relevant).
Reply with STRICT JSON ONLY, no prose, no markdown fences:
{"matches":[{"id":"<experience id>","reason":"<one personal sentence in ${langName}, max 20 words, why this fits THIS visitor now>"}]}
Use only ids from the catalogue. Order best-first.

${weatherContext}

Catalogue:
${catalogue}`;

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

  // Shared 9s budget across attempts — clean fallback before a gateway 504.
  const budget = AbortSignal.timeout(9000);

  for (const model of candidates) {
    if (budget.aborted) break;
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
          max_tokens: 2000,
          reasoning: { effort: "low" },
          messages: [{ role: "system", content: system }],
        }),
        signal: budget,
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
      | { matches?: { id: string; reason?: string }[] }
      | null;

    const validIds = new Set(wellnessEntries.map((e) => e.id));
    const matches = (parsed?.matches ?? []).filter((m) => m && validIds.has(m.id));
    if (matches.length) {
      return Response.json({ matches: matches.slice(0, 6), model });
    }
  }

  return fallback("all-models-busy");
}
