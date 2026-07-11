"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import WeatherStrip from "@/components/WeatherStrip";
import { useI18n } from "@/i18n/I18nProvider";
import { LangCode } from "@/i18n/dictionaries";
import { TINT_HEX } from "@/lib/data";
import { districtLoc, loc, WellnessEntry } from "@/lib/types";
import {
  matchWellness,
  WELLNESS_MOODS,
  wellnessEntries,
  type WellnessMatch,
} from "@/lib/wellness";
import { isRainy, type SeasonKey } from "@/lib/weather";
import { useNanWeather } from "@/lib/useWeather";
import seasonsData from "@/data/seasons.json";

type ResultItem = { entry: WellnessEntry; reason?: string; hits: string[] };

export default function WellnessPage() {
  const { t, lang } = useI18n();
  const weather = useNanWeather();

  const [moods, setMoods] = useState<string[]>([]);
  const [pace, setPace] = useState<"slow" | "active" | undefined>();
  const [season, setSeason] = useState<SeasonKey | "now">("now");
  const [state, setState] = useState<"idle" | "matching" | "ai" | "rule">("idle");
  const [results, setResults] = useState<ResultItem[]>([]);

  const currentSeason = (weather?.season.key ?? "green") as SeasonKey;
  const rainyToday = isRainy(weather?.days[0]);

  const seasonOptions = useMemo(
    () =>
      (Object.entries(seasonsData.seasons) as [SeasonKey, { name: { th: string; en: string } }][]).map(
        ([key, s]) => ({ key, name: s.name })
      ),
    []
  );

  const toggleMood = (key: string) => {
    setMoods((m) => (m.includes(key) ? m.filter((x) => x !== key) : [...m, key]));
    setState("idle");
  };

  const ruleResults = (): ResultItem[] =>
    matchWellness({ moods, pace, season }, currentSeason, rainyToday).map(
      (m: WellnessMatch) => ({ entry: m.entry, hits: m.hits })
    );

  const runMatch = async () => {
    if (!moods.length) return;
    setState("matching");
    try {
      const resp = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moods, pace, season, lang }),
      });
      const data = await resp.json();
      if (!data?.fallback && Array.isArray(data?.matches) && data.matches.length) {
        const items: ResultItem[] = [];
        for (const m of data.matches as { id: string; reason?: string }[]) {
          const entry = wellnessEntries.find((e) => e.id === m.id);
          if (entry) items.push({ entry, reason: m.reason, hits: [] });
        }
        setResults(items);
        setState("ai");
        return;
      }
    } catch {
      // fall through to rules
    }
    setResults(ruleResults());
    setState("rule");
  };

  return (
    <>
      <AppHeader title={t("wellness.title")} showBack />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-8 pt-4 lg:px-8 lg:pb-10 lg:pt-8">
        {/* Hero */}
        <div className="plan-lanna-hero overflow-hidden rounded-2xl border border-gold/25 bg-navy text-cream shadow-sm">
          <div className="lanna-strip h-2 bg-navy" />
          <div className="relative p-5 lg:p-6">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-25 lanna-watermark" />
            <div className="relative flex items-center gap-2">
              <i className="ti ti-heart-handshake text-xl text-gold lg:text-2xl" aria-hidden />
              <h1 className="text-xl font-bold lg:text-2xl">{t("wellness.title")}</h1>
            </div>
            <p className="relative mt-1 text-sm text-cream/75 lg:text-base">{t("wellness.sub")}</p>
          </div>
        </div>

        <div className="mt-4">
          <WeatherStrip />
        </div>

        {/* Quiz */}
        <section className="mt-5 rounded-2xl border border-line bg-white p-4 lg:p-5">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-navy">
            <i className="ti ti-mood-smile-beam text-gold" aria-hidden /> {t("wellness.q.mood")}
          </h2>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {WELLNESS_MOODS.map((m) => {
              const active = moods.includes(m.key);
              return (
                <button
                  key={m.key}
                  onClick={() => toggleMood(m.key)}
                  aria-pressed={active}
                  className={`lanna-plan-action flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                    active ? "border-navy bg-navy text-cream" : "border-line bg-white text-navy hover:border-gold/60"
                  }`}
                >
                  <i className={`ti ${m.icon} text-base ${active ? "text-gold" : "text-muted"}`} aria-hidden />
                  {loc(m.label, lang)}
                </button>
              );
            })}
          </div>

          <h2 className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-navy">
            <i className="ti ti-walk text-gold" aria-hidden /> {t("wellness.q.pace")}
          </h2>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {(["slow", "active"] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPace((v) => (v === p ? undefined : p));
                  setState("idle");
                }}
                aria-pressed={pace === p}
                className={`lanna-plan-action rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                  pace === p ? "border-navy bg-navy text-cream" : "border-line bg-white text-navy hover:border-gold/60"
                }`}
              >
                {t(`wellness.pace.${p}`)}
              </button>
            ))}
          </div>

          <h2 className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-navy">
            <i className="ti ti-calendar text-gold" aria-hidden /> {t("wellness.q.season")}
          </h2>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSeason("now");
                setState("idle");
              }}
              aria-pressed={season === "now"}
              className={`lanna-plan-action rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                season === "now" ? "border-navy bg-navy text-cream" : "border-line bg-white text-navy hover:border-gold/60"
              }`}
            >
              {t("wellness.season.now")}
            </button>
            {seasonOptions.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setSeason(s.key);
                  setState("idle");
                }}
                aria-pressed={season === s.key}
                className={`lanna-plan-action rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                  season === s.key ? "border-navy bg-navy text-cream" : "border-line bg-white text-navy hover:border-gold/60"
                }`}
              >
                {loc(s.name, lang)}
              </button>
            ))}
          </div>

          <button
            onClick={runMatch}
            disabled={state === "matching" || !moods.length}
            className="lanna-plan-action mt-5 flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-cream hover:bg-navy-600 disabled:opacity-60"
          >
            <i
              className={`ti ${state === "matching" ? "ti-loader-2 animate-spin" : "ti-sparkles"} text-base text-gold`}
              aria-hidden
            />
            {state === "matching" ? t("wellness.matching") : t("wellness.match")}
          </button>
          {!moods.length && state === "idle" && (
            <p className="mt-2 text-xs text-muted">{t("wellness.empty")}</p>
          )}
        </section>

        {/* Results */}
        {(state === "ai" || state === "rule") && (
          <section className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-navy">
                <i className="ti ti-heart text-gold" aria-hidden /> {t("wellness.results")}
              </h2>
              <span className="rounded-full bg-cream-200 px-2.5 py-1 text-[11px] font-medium text-gold-700">
                {state === "ai" ? t("wellness.aiPicked") : t("wellness.rulePicked")}
              </span>
            </div>
            <div className="stagger mt-3 grid gap-3 lg:grid-cols-2">
              {results.map(({ entry, reason, hits }) => (
                <WellnessCard
                  key={entry.id}
                  entry={entry}
                  reason={reason}
                  hits={hits}
                  lang={lang as LangCode}
                  t={t}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

function WellnessCard({
  entry,
  reason,
  hits,
  lang,
  t,
}: {
  entry: WellnessEntry;
  reason?: string;
  hits: string[];
  lang: LangCode;
  t: (k: string) => string;
}) {
  const tint = TINT_HEX[entry.tint] ?? TINT_HEX.navy;
  return (
    <div className="plan-recommend-card flex gap-3 rounded-xl border border-line bg-white p-3.5 transition hover:border-gold/60">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: tint.bg }}
      >
        <i className={`ti ${entry.icon} text-2xl`} style={{ color: tint.fg }} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[11px] text-muted">{districtLoc(entry.district, lang)}</span>
          <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[10px] font-medium text-gold-700">
            {entry.price > 0 ? `${entry.price} ${t("common.baht")}` : t("wellness.free")}
          </span>
          {entry.duration ? (
            <span className="text-[10px] text-muted">
              {entry.duration} {t("common.minutes")}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 font-semibold text-navy">{loc(entry.name, lang)}</div>
        <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
          {reason ?? loc(entry.summary, lang)}
        </p>
        {!reason && hits.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {hits.map((h) => (
              <span
                key={h}
                className="rounded-full bg-cream-200 px-2 py-0.5 text-[10px] text-gold-700"
              >
                {t(`wellness.reason.${h}`)}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/place/${entry.placeId}`}
          className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-navy hover:underline"
        >
          {t("wellness.viewPlace")} <i className="ti ti-chevron-right text-xs" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
