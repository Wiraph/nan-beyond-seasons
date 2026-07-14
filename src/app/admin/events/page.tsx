"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { managementEventMetrics } from "@/lib/management-events";
import { fmtRange, sportEvents } from "@/lib/sports";

export default function AdminEventsPage() {
  const { t, lang } = useI18n();
  const locale = lang === "en" ? "en" : "th";
  const metrics = managementEventMetrics(sportEvents);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("mgmt.nav.allEvents")}</h1>
        <p className="mt-1 text-sm text-steel">{metrics.total} {t("adm.events.subSuffix")}</p>
      </div>
      <div className="sport-card overflow-hidden rounded-md">
        <div className="grid grid-cols-[minmax(13rem,2fr)_minmax(8rem,1fr)_minmax(8rem,1fr)] gap-4 border-b border-black/10 bg-black/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-steel sm:px-5">
          <span>{t("adm.events.colEvent")}</span><span>{t("adm.events.colSeason")}</span><span>{t("adm.events.colReview")}</span>
        </div>
        {sportEvents.map((event) => (
          <article key={event.id} className="grid grid-cols-[minmax(13rem,2fr)_minmax(8rem,1fr)_minmax(8rem,1fr)] gap-4 border-b border-black/10 px-4 py-4 last:border-b-0 sm:px-5">
            <div className="min-w-0">
              <p className="truncate font-semibold">{event.name[locale]}</p>
              <p className="mt-1 text-xs text-steel">{fmtRange(event, locale)} · {event.venue.name[locale]}</p>
            </div>
            <span className="self-start rounded-full bg-black/5 px-2 py-1 text-xs font-semibold text-steel">{t(`season.${event.season}.short`)}</span>
            <span className="self-start rounded-full bg-[#fff3ed] px-2 py-1 text-xs font-semibold text-[#b54708]">{event.verified ? t("org.verified") : t("org.metric.needsReview")}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
