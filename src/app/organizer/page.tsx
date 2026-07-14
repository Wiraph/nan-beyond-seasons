"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { managementEventMetrics } from "@/lib/management-events";
import { eventsByUrgency, fmtRange, sportEvents } from "@/lib/sports";

export default function OrganizerOverviewPage() {
  const { t, lang } = useI18n();
  const locale = lang === "en" ? "en" : "th";
  const metrics = managementEventMetrics(sportEvents);
  const managedEvents = eventsByUrgency().filter((event) => event.mode.includes("compete")).slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="sport-card rounded-md p-5 sm:p-7">
        <h1 className="text-2xl font-bold sm:text-3xl">{t("org.title")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">
          {t("org.intro")}
        </p>
        <Link href="/organizer/events/new" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-volt px-4 text-sm font-bold text-pitch hover:bg-volt-600">
          <i className="ti ti-plus" aria-hidden /> {t("org.createCta")}
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label={t("org.metric.published")}>
        <Metric label={t("org.metric.published")} value={metrics.total} icon="ti-calendar-event" />
        <Metric label={t("org.metric.competitionReady")} value={metrics.compete} icon="ti-trophy" />
        <Metric label={t("org.metric.needsReview")} value={metrics.needsReview} icon="ti-clipboard-check" />
      </section>

      <section className="sport-card rounded-md p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">{t("org.queue.title")}</h2>
            <p className="mt-1 text-sm text-steel">{t("org.queue.sub")}</p>
          </div>
          <Link href="/organizer/events" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-black/10 px-3 text-sm font-semibold hover:border-volt hover:text-volt">
            {t("org.viewAll")} <i className="ti ti-arrow-right" aria-hidden />
          </Link>
        </div>
        <div className="mt-4 divide-y divide-black/10">
          {managedEvents.map((event) => (
            <div key={event.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-volt/10 text-volt"><i className={`ti ${event.icon} text-xl`} aria-hidden /></span>
              <div className="min-w-48 flex-1">
                <p className="font-semibold">{event.name[locale]}</p>
                <p className="text-xs text-steel">{fmtRange(event, locale)} · {event.venue.name[locale]}</p>
              </div>
              <i className="ti ti-chevron-right text-steel" aria-hidden />
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
