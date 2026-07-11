"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import LangSwitcher from "@/components/LangSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { districtLoc, loc } from "@/lib/types";
import {
  daysUntil,
  eventStatus,
  fmtRange,
  getEvent,
  SEASON_ACCENT,
  SPORT_TYPE_LABEL,
} from "@/lib/sports";
import { fallbackRacePlan, type RacePlan } from "@/lib/raceplan";
import { conditionLabel, isRainy } from "@/lib/weather";
import { useNanWeather } from "@/lib/useWeather";
import seasonsData from "@/data/seasons.json";

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t, lang } = useI18n();
  const router = useRouter();
  const weather = useNanWeather();

  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const [plan, setPlan] = useState<RacePlan | null>(null);
  const [planState, setPlanState] = useState<"idle" | "loading" | "ai" | "rule">("idle");

  const event = getEvent(id);

  const buildPlan = useCallback(async () => {
    if (!event) return;
    setPlanState("loading");
    try {
      const resp = await fetch("/api/raceplan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, lang }),
      });
      const data = await resp.json();
      if (!data?.fallback && Array.isArray(data?.days) && data.days.length) {
        setPlan({ days: data.days, tips: data.tips ?? [] });
        setPlanState("ai");
        return;
      }
    } catch {
      // fall through
    }
    setPlan(fallbackRacePlan(event, lang, isRainy(weather?.days[0])));
    setPlanState("rule");
  }, [event, lang, weather]);

  if (!event) return notFound();

  const accent = SEASON_ACCENT[event.season];
  const status = now ? eventStatus(event, now) : "upcoming";
  const days = now ? daysUntil(event, now) : null;
  const forecast = weather?.days.find(
    (d) => d.date >= event.dates.start && d.date <= event.dates.end
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${event.venue.lat},${event.venue.lon}`;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-pitch/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <button
            onClick={() => router.back()}
            aria-label={t("common.back")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-steel transition hover:bg-white/10 hover:text-frost"
          >
            <i className="ti ti-arrow-left text-xl" aria-hidden />
          </button>
          <LangSwitcher dark />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-10 pt-5 lg:px-8">
        {/* Event hero */}
        <section className={`sport-card anim-rise rounded-3xl p-5 lg:p-7 ${accent.flag}`}>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {status === "live" && (
              <span className="flex items-center gap-1.5 rounded-full bg-[#e5484d] px-2.5 py-1 font-bold text-white">
                <span className="sport-live-dot h-2 w-2 rounded-full bg-white" /> {t("sport.liveNow")}
              </span>
            )}
            <span className={`rounded-full bg-white/10 px-2.5 py-1 font-medium ${accent.text}`}>
              {loc(seasonsData.seasons[event.season].name, lang)}
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-steel">
              {loc(SPORT_TYPE_LABEL[event.sportType] ?? { th: event.sportType, en: event.sportType }, lang)}
            </span>
            {event.mode.map((m) => (
              <span key={m} className="rounded-full bg-volt/12 px-2.5 py-1 font-medium text-volt">
                {t(`sport.${m}`)}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
            <h1 className="max-w-xl text-2xl font-extrabold leading-snug text-frost lg:text-3xl">
              {loc(event.name, lang)}
            </h1>
            {status === "upcoming" && days !== null && (
              <div className="text-center">
                <div className="sport-num text-4xl text-volt lg:text-5xl" suppressHydrationWarning>{days}</div>
                <div className="text-[10px] font-medium uppercase tracking-widest text-steel">
                  {days === 0 ? t("sport.today") : t("sport.days")}
                </div>
              </div>
            )}
          </div>

          <dl className="mt-3 flex flex-col gap-1.5 text-sm text-steel">
            <div className="flex items-start gap-2">
              <dt className="sr-only">{t("sport.when")}</dt>
              <i className="ti ti-calendar-event mt-0.5 text-volt" aria-hidden />
              <dd>
                {fmtRange(event, lang)}
                <span className="ml-2 text-xs text-steel/70">({loc(event.monthLabel, lang)})</span>
              </dd>
            </div>
            <div className="flex items-start gap-2">
              <dt className="sr-only">{t("sport.venue")}</dt>
              <i className="ti ti-map-pin mt-0.5 text-volt" aria-hidden />
              <dd>
                {loc(event.venue.name, lang)} · {districtLoc(event.venue.district, lang)}{" "}
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-volt underline-offset-2 hover:underline">
                  {t("common.openMap")}
                </a>
              </dd>
            </div>
            {forecast && (
              <div className="flex items-start gap-2">
                <dt className="sr-only">{t("sport.raceDay")}</dt>
                <i className={`ti ${conditionLabel(forecast.condition).icon} mt-0.5 text-volt`} aria-hidden />
                <dd>
                  {t("sport.raceDay")}: {loc(conditionLabel(forecast.condition), lang)} {forecast.tempMin}–{forecast.tempMax}°C ·{" "}
                  {t("weather.rainChance")} {forecast.rainChance}%
                </dd>
              </div>
            )}
          </dl>

          <p className="mt-3 text-sm leading-relaxed text-steel lg:text-base">{loc(event.desc, lang)}</p>
          <p className="mt-2 flex items-start gap-1.5 text-sm text-frost">
            <i className="ti ti-star text-volt" aria-hidden /> {loc(event.highlight, lang)}
          </p>
          {!event.verified && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] text-steel">
              <i className="ti ti-info-circle" aria-hidden /> {t("sport.unverified")}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={buildPlan}
              disabled={planState === "loading"}
              className="flex items-center gap-1.5 rounded-full bg-volt px-5 py-2.5 text-sm font-bold text-pitch transition hover:bg-volt-600 disabled:opacity-60"
            >
              <i
                className={`ti ${planState === "loading" ? "ti-loader-2 animate-spin" : "ti-sparkles"} text-base`}
                aria-hidden
              />
              {planState === "loading" ? t("sport.planning") : t("sport.planTrip")}
            </button>
            <Link
              href={`/checkin/${event.id}`}
              className="flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-frost transition hover:border-volt hover:text-volt"
            >
              <i className="ti ti-qrcode text-base" aria-hidden /> {t("sport.checkin")}
            </Link>
          </div>
        </section>

        {/* Race-cation itinerary */}
        {plan && (
          <section className="anim-slide-up mt-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-frost">
                <i className="ti ti-route text-volt" aria-hidden /> {t("sport.tripAround")}
              </h2>
              <span className="rounded-full bg-volt/12 px-2.5 py-1 text-[11px] font-medium text-volt">
                {planState === "ai" ? t("wellness.aiPicked") : t("plan.aiFallback")}
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-4">
              {plan.days.map((day, di) => (
                <div key={di} className="sport-card rounded-2xl p-4 lg:p-5">
                  <h3 className="font-bold text-volt">{day.label || `Day ${di + 1}`}</h3>
                  <div className="mt-2.5 flex flex-col gap-2.5">
                    {day.stops.map((s, si) => (
                      <div key={si} className="flex gap-3">
                        <span className="sport-num w-14 shrink-0 pt-0.5 text-sm text-volt">{s.time}</span>
                        <div className="min-w-0 flex-1 border-l border-white/10 pl-3">
                          {s.placeId ? (
                            <Link href={`/place/${s.placeId}`} className="font-semibold text-frost hover:text-volt hover:underline">
                              {s.title}
                            </Link>
                          ) : (
                            <div className="font-semibold text-frost">{s.title}</div>
                          )}
                          {s.note && <p className="mt-0.5 text-[12px] text-steel">{s.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {plan.tips.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1.5">
                {plan.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-steel">
                    <i className="ti ti-bulb mt-0.5 shrink-0 text-volt" aria-hidden /> {tip}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </>
  );
}
