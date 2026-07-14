"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LangSwitcher from "@/components/LangSwitcher";
import PublicBackButton from "@/components/PublicBackButton";
import { useI18n } from "@/i18n/I18nProvider";
import { LangCode } from "@/i18n/dictionaries";
import { loc, districtLoc } from "@/lib/types";
import {
  daysUntil,
  eventsBySeason,
  eventStatus,
  fmtRange,
  nextEvent,
  SEASON_ACCENT,
  SPORT_TYPE_LABEL,
  type SportEvent,
} from "@/lib/sports";
import { conditionLabel, type SeasonKey } from "@/lib/weather";
import { useNanWeather } from "@/lib/useWeather";
import seasonsData from "@/data/seasons.json";

export default function CalendarPage() {
  const { t, lang } = useI18n();
  const weather = useNanWeather();
  // Countdown depends on the client clock — render after mount to avoid
  // SSR/client hydration mismatch.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const hero = nextEvent(now ?? new Date("2026-07-11"));
  const heroStatus = now ? eventStatus(hero, now) : "upcoming";
  const heroDays = now ? daysUntil(hero, now) : null;
  const seasons = eventsBySeason();

  // Live forecast for the hero event when it's inside the 7-day window.
  const heroForecast = weather?.days.find((d) => d.date >= hero.dates.start && d.date <= hero.dates.end)
    ?? weather?.days.find((d) => d.date === hero.dates.start);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-pitch/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <PublicBackButton fallbackHref="/" variant="sport" />
            <Link href="/" className="flex min-w-0 items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-volt text-pitch">
                <i className="ti ti-bolt text-xl" aria-hidden />
              </span>
              <span className="truncate text-lg font-bold tracking-tight text-frost">
                NAN <span className="text-volt">GAME ON</span>
              </span>
            </Link>
          </div>
          <LangSwitcher dark />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-10 pt-5 lg:px-8">
        <p className="anim-rise text-sm text-steel lg:text-base">{t("sport.tagline")}</p>

        {/* Hero: next event + countdown */}
        <section
          aria-label={t("sport.nextEvent")}
          className={`sport-card anim-rise mt-4 rounded-md p-5 lg:p-8 ${SEASON_ACCENT[hero.season].flag}`}
        >
          <div className="flex flex-wrap items-center gap-2 text-[11px] lg:text-xs">
            {heroStatus === "live" ? (
              <span className="flex items-center gap-1.5 rounded bg-[#e5484d] px-2.5 py-1 font-bold text-white">
                <span className="sport-live-dot h-2 w-2 rounded-full bg-white" /> {t("sport.liveNow")}
              </span>
            ) : (
              <span className="rounded bg-volt/15 px-2.5 py-1 font-semibold text-volt">
                {t("sport.nextEvent")}
              </span>
            )}
            <span className={`rounded bg-black/5 px-2.5 py-1 font-medium ${SEASON_ACCENT[hero.season].text}`}>
              {loc(seasonsData.seasons[hero.season].name, lang)}
            </span>
            <span className="rounded-full bg-black/5 px-2.5 py-1 text-steel">
              {loc(SPORT_TYPE_LABEL[hero.sportType] ?? { th: hero.sportType, en: hero.sportType }, lang)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
            <div className="min-w-0 max-w-2xl">
              <h1 className="text-2xl font-bold leading-snug text-frost lg:text-4xl">
                {loc(hero.name, lang)}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-steel">
                <span className="inline-flex items-center gap-1">
                  <i className="ti ti-calendar-event text-volt" aria-hidden /> {fmtRange(hero, lang)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <i className="ti ti-map-pin text-volt" aria-hidden />
                  {districtLoc(hero.venue.district, lang)}
                </span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-steel lg:text-base">{loc(hero.desc, lang)}</p>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-4">
              {heroStatus !== "live" && (
                <div className="text-center" aria-label={`${t("sport.daysLeft")} ${heroDays ?? "—"} ${t("sport.days")}`}>
                  <div className="sport-num text-5xl text-volt lg:text-7xl" suppressHydrationWarning>
                    {heroDays ?? "—"}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-widest text-steel">
                    {heroDays === 0 ? t("sport.today") : t("sport.days")}
                  </div>
                </div>
              )}
              {(heroForecast || weather) && (
                <div className="rounded-md bg-black/5 px-4 py-3 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-steel">{t("sport.raceDay")}</div>
                  {heroForecast ? (
                    <>
                      <i className={`ti ${conditionLabel(heroForecast.condition).icon} mt-1 text-2xl text-volt`} aria-hidden />
                      <div className="text-sm font-semibold text-frost">
                        {heroForecast.tempMin}–{heroForecast.tempMax}°C
                      </div>
                      <div className="text-[10px] text-steel">
                        {t("weather.rainChance")} {heroForecast.rainChance}%
                      </div>
                    </>
                  ) : (
                    <div className="mt-1 max-w-36 text-xs text-steel">
                      {weather ? loc(seasonsData.months.find((m) => m.month === new Date(hero.dates.start).getMonth() + 1)?.weather ?? { th: "", en: "" }, lang) : ""}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`/events/${hero.id}`}
              className="flex items-center gap-1.5 rounded bg-volt px-5 py-2.5 text-sm font-bold text-pitch transition hover:bg-volt-600"
            >
              <i className="ti ti-flag-bolt text-base" aria-hidden /> {t("sport.viewEvent")}
            </Link>
            <Link
              href={`/checkin/${hero.id}`}
              className="flex items-center gap-1.5 rounded border border-black/15 px-5 py-2.5 text-sm font-semibold text-frost transition hover:border-volt hover:text-volt"
            >
              <i className="ti ti-qrcode text-base" aria-hidden /> {t("sport.checkin")}
            </Link>
          </div>
        </section>

        <div className="sport-ticker mt-6 h-1.5 rounded-full" aria-hidden />

        {/* 12-month calendar grouped by season */}
        <section className="mt-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-frost lg:text-xl">
            <i className="ti ti-calendar-bolt text-volt" aria-hidden /> {t("sport.calendar")}
          </h2>

          <div className="mt-4 flex flex-col gap-6">
            {seasons.map(({ season, events }) => (
              <SeasonBlock key={season} season={season} events={events} lang={lang as LangCode} t={t} now={now} />
            ))}
          </div>
        </section>

        {/* Passport CTA */}
        <Link
          href="/passport"
          className="sport-card mt-8 flex items-center gap-4 rounded-md p-4 transition hover:border-volt/40 lg:p-5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-volt/15 text-volt">
            <i className="ti ti-id-badge-2 text-2xl" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold text-frost">{t("sport.passport")}</span>
            <span className="block text-sm text-steel">
              {lang === "th"
                ? "เช็คอินที่งานกีฬา สะสมแบดจ์ทุกฤดู แลกส่วนลดร้านชุมชน"
                : "Check in at events, collect season badges, redeem local perks"}
            </span>
          </span>
          <i className="ti ti-chevron-right text-steel" aria-hidden />
        </Link>
      </main>
    </>
  );
}

function SeasonBlock({
  season,
  events,
  lang,
  t,
  now,
}: {
  season: SeasonKey;
  events: SportEvent[];
  lang: LangCode;
  t: (k: string) => string;
  now: Date | null;
}) {
  const info = seasonsData.seasons[season];
  const accent = SEASON_ACCENT[season];
  if (!events.length) return null;

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className={`text-base font-bold ${accent.text}`}>{loc(info.name, lang)}</h3>
        <p className="text-xs text-steel">{loc(info.pitch, lang)}</p>
      </div>
      <div className="stagger mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => {
          const status = now ? eventStatus(e, now) : "upcoming";
          const days = now ? daysUntil(e, now) : null;
          return (
            <Link
              key={e.id}
              href={`/events/${e.id}`}
              className={`sport-card hover-lift rounded-md p-4 ${accent.flag}`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-black/5 ${accent.text}`}>
                  <i className={`ti ${e.icon} text-2xl`} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-frost">{loc(e.name, lang)}</div>
                  <div className="mt-0.5 text-[11px] text-steel">
                    {loc(e.monthLabel, lang)} · {districtLoc(e.venue.district, lang)}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px]" suppressHydrationWarning>
                    {status === "live" ? (
                      <span className="flex items-center gap-1 font-bold text-[#e5484d]">
                        <span className="sport-live-dot h-1.5 w-1.5 rounded-full bg-[#e5484d]" /> {t("sport.liveNow")}
                      </span>
                    ) : status === "past" ? (
                      <span className="text-steel">{t("sport.pastEvent")}</span>
                    ) : (
                      <span className="font-semibold text-volt">
                        {t("sport.daysLeft")} {days} {t("sport.days")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
