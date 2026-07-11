"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { loc } from "@/lib/types";
import { conditionLabel } from "@/lib/weather";
import { useNanWeather } from "@/lib/useWeather";

const DAY_LABEL: Record<string, string[]> = {
  th: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

function dayShort(date: string, lang: string): string {
  const labels = DAY_LABEL[lang] ?? DAY_LABEL.en;
  return labels[new Date(`${date}T00:00:00`).getDay()];
}

/** Live Nan forecast + season banner. `variant="full"` (home) adds the
 *  season pitch and this month's highlights; `compact` (plan) is one row. */
export default function WeatherStrip({ variant = "compact" }: { variant?: "full" | "compact" }) {
  const { t, lang } = useI18n();
  const weather = useNanWeather();
  if (!weather || !weather.days.length) return null;

  const today = weather.days[0];
  const label = conditionLabel(today.condition);

  return (
    <section
      aria-label={t("weather.today")}
      className="overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <i className={`ti ${label.icon} text-2xl text-gold`} aria-hidden />
          <div>
            <div className="text-[11px] text-muted">{t("weather.today")}</div>
            <div className="text-sm font-semibold text-navy">
              {loc(label, lang)} · {today.tempMin}–{today.tempMax}°C
              {today.rainChance > 0 && (
                <span className="ml-1.5 font-normal text-muted">
                  {t("weather.rainChance")} {today.rainChance}%
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="rounded-full bg-cream-200 px-2.5 py-1 text-[11px] font-medium text-gold-700">
          {loc(weather.season.name, lang)}
        </span>
        <div className="no-scrollbar ml-auto flex gap-1 overflow-x-auto" aria-label={t("weather.forecast")}>
          {weather.days.slice(1, 7).map((d) => {
            const c = conditionLabel(d.condition);
            return (
              <div
                key={d.date}
                title={`${loc(c, lang)} ${d.tempMin}–${d.tempMax}°C`}
                className="flex shrink-0 flex-col items-center rounded-lg px-1.5 py-1 text-center"
              >
                <span className="text-[10px] text-muted">{dayShort(d.date, lang)}</span>
                <i className={`ti ${c.icon} text-base ${d.rainChance >= 60 ? "text-navy" : "text-gold"}`} aria-hidden />
                <span className="text-[10px] text-navy">{d.tempMax}°</span>
              </div>
            );
          })}
        </div>
      </div>

      {variant === "full" && (
        <div className="border-t border-line bg-cream px-4 py-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gold-700">
            <i className="ti ti-calendar-heart" aria-hidden /> {t("weather.thisMonth")}
          </div>
          <p className="mt-0.5 text-sm text-navy">{loc(weather.season.pitch, lang)}</p>
          <ul className="mt-1.5 flex flex-col gap-1">
            {(weather.month.highlights[lang === "th" ? "th" : "en"] ?? weather.month.highlights.en).map(
              (h, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[12px] text-muted">
                  <i className="ti ti-leaf mt-0.5 shrink-0 text-gold" aria-hidden /> {h}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
