import type { NextRequest } from "next/server";
import { places } from "@/lib/data";
import { sportEvents } from "@/lib/sports";
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

// Compact ground-truth list of Nan places injected into the system prompt.
const PLACE_CONTEXT = places
  .map(
    (p) =>
      `- ${p.name.en} (${p.name.th}) | ${p.district} | ${p.craftType} | ${p.summary.en}`
  )
  .join("\n");

// Sports festival calendar — the core of Nan Game On.
const EVENT_CONTEXT = sportEvents
  .map(
    (e) =>
      `- ${e.name.en} (${e.name.th}) | ${e.dates.start} to ${e.dates.end} | ${e.venue.district} | season:${e.season} | ${e.desc.en}`
  )
  .join("\n");

type ChatMessage = { role: "user" | "assistant"; content: string };

function fallback(reason: string) {
  return Response.json({ fallback: true, reason }, { status: 200 });
}

// App knowledge for the "help" bot — kept next to the real rules so it
// never drifts from what the app actually does.
const APP_GUIDE = `Nan Game On app guide (ground truth):
- Home (/) is a Strava-style community feed: post updates, give kudos (flame button), see demo community posts. "Ranking" tab = points leaderboard.
- Calendar (/calendar): 12-month sports festival calendar grouped by season (Green/Cool/Hot) with countdowns and live race-day weather.
- Each event page: details, real weather, "Plan a trip around this" = AI builds a 2-day race-cation (event + nearby attractions, weather-adaptive).
- Check-in: scan the QR at an event (or open /checkin/<event>) -> +50 points, auto-shares to the feed. One check-in per event.
- Passport (/passport): set your display name + avatar colour, see points, badges, check-in history.
- Badges (7): "Game On!" first check-in; "Green Season Raider" check in at a green-season event; "Cool Season Chaser" cool season; "Hot Season Hero" hot season; "Longboat Superfan" any longboat race; "Nan All-Season Athlete" all 3 seasons; "Nan Full House" every event on the calendar.
- Points can be redeemed for discounts with participating local businesses (prototype).
- No login needed — identity is anonymous per browser.
- Explore (/explore): general Nan travel content and AI trip tools.`;

export async function POST(req: NextRequest) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return fallback("no-key");

  let body: { messages?: ChatMessage[]; lang?: string; mode?: string };
  try {
    body = await req.json();
  } catch {
    return fallback("bad-request");
  }

  const lang = body.lang ?? "th";
  const langName = LANG_NAME[lang] ?? "Thai";
  const history = (body.messages ?? [])
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .slice(-8);

  const forecast = await getNanForecast();
  const weatherContext = buildWeatherContext(forecast, new Date().getMonth() + 1);

  const system = body.mode === "help"
    ? `You are the Nan Game On app helper.
Rules:
- Answer questions about how to use the app: feed, kudos, calendar, check-ins, points, badges, passport, AI trip planner.
- Treat the guide below as ground truth. Do not invent features that are not listed.
- Be short, friendly and practical (2-4 sentences; use a small list when listing badges or steps).
- If asked about actual events or travel, give a one-line answer and suggest switching to the Sport Buddy bot.
- Always reply in ${langName}, regardless of the language of the question.

${APP_GUIDE}`
    : `You are the Nan Game On AI concierge — the sports-tourism guide for Nan province, Northern Thailand.
Rules:
- Help with Nan's sports festivals (dates, what to expect, spectating vs competing, how to prepare) and travelling in Nan (places, food, stays, routes, culture).
- Treat the lists below as ground truth. Recommend real events and places by name. Do not invent events or places that are not listed. If dates are asked, note they may await official announcement.
- Nan plays all year: use the season and weather context to tailor advice — longboat racing and rafting shine in Green Season, trails and cycling in the cool months. On rainy days steer to indoor culture and food.
- Be warm, energetic and friendly. For simple questions, answer in 2-4 sentences.
- When the user asks for an itinerary or multi-day plan, give a clear day-by-day plan: label each day, list real event/place names grouped sensibly by area, one-line reason each, each item on its own line.
- Always reply in ${langName}, regardless of the language of the question.

${weatherContext}

Sports festivals in Nan:
${EVENT_CONTEXT}

Places in Nan:
${PLACE_CONTEXT}`;

  // Try several free models in order — free endpoints are often rate-limited
  // (HTTP 429), so fall through to the next until one returns 200.
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
          "HTTP-Referer":
            process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
          "X-Title": process.env.OPENROUTER_APP_NAME ?? "Nan Connect",
        },
        body: JSON.stringify({
          model,
          stream: true,
          temperature: 0.6,
          max_tokens: 900,
          messages: [{ role: "system", content: system }, ...history],
        }),
      });
    } catch {
      continue; // network hiccup — try next model
    }

    if (upstream.ok && upstream.body) {
      // Proxy the OpenAI-compatible SSE stream straight to the client.
      return new Response(upstream.body, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "x-nc-model": model,
        },
      });
    }
    // 429 / other error → try the next candidate
  }

  return fallback("all-models-busy");
}
