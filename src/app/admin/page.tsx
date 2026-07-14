"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { managementEventMetrics } from "@/lib/management-events";
import { eventsByUrgency, fmtRange, sportEvents } from "@/lib/sports";

export default function AdminOverviewPage() {
  const { t, lang } = useI18n();
  const locale = lang === "en" ? "en" : "th";
  const metrics = managementEventMetrics(sportEvents);
  const reviewEvents = eventsByUrgency().slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="sport-card rounded-md p-5 sm:p-7">
        <h1 className="text-2xl font-bold sm:text-3xl">{t("adm.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">
          {t("adm.intro")}
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label={t("adm.title")}>
        <Metric label={t("adm.metric.allRecords")} value={metrics.total} icon="ti-calendar-event" />
        <Metric label={t("org.metric.needsReview")} value={metrics.needsReview} icon="ti-clipboard-check" />
        <Metric label={t("adm.metric.competition")} value={metrics.compete} icon="ti-trophy" />
        <Metric label={t("adm.metric.spectator")} value={metrics.spectate} icon="ti-users" />
      </section>

      <section className="sport-card rounded-md p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">{t("adm.review.title")}</h2>
            <p className="mt-1 text-sm text-steel">{t("adm.review.sub")}</p>
          </div>
          <Link href="/admin/events" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-black/10 px-3 text-sm font-semibold hover:border-volt hover:text-volt">
            {t("mgmt.nav.allEvents")} <i className="ti ti-arrow-right" aria-hidden />
          </Link>
        </div>
        <div className="mt-4 divide-y divide-black/10">
          {reviewEvents.map((event) => (
            <div key={event.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-volt/10 text-volt"><i className={`ti ${event.icon} text-xl`} aria-hidden /></span>
              <div className="min-w-48 flex-1">
                <p className="font-semibold">{event.name[locale]}</p>
                <p className="text-xs text-steel">{fmtRange(event, locale)} · {event.venue.name[locale]}</p>
              </div>
              <span className="rounded-full bg-[#fff3ed] px-3 py-1 text-xs font-semibold text-[#b54708]">{event.verified ? t("org.verified") : t("org.metric.needsReview")}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="sport-card rounded-md p-4">
      <i className={`ti ${icon} text-xl text-volt`} aria-hidden />
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-steel">{label}</p>
    </div>
  );
}
