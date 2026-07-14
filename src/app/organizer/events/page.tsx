"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { fmtRange, sportEvents } from "@/lib/sports";

export default function OrganizerEventsPage() {
  const { t, lang } = useI18n();
  const locale = lang === "en" ? "en" : "th";
  const events = sportEvents.filter((event) => event.mode.includes("compete"));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("mgmt.nav.myEvents")}</h1>
          <p className="mt-1 text-sm text-steel">{t("org.events.sub")}</p>
        </div>
        <Link href="/organizer/events/new" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-volt px-4 text-sm font-bold text-pitch hover:bg-volt-600">
          <i className="ti ti-plus" aria-hidden /> {t("org.createCta")}
        </Link>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {events.map((event) => (
          <article key={event.id} className="sport-card rounded-md p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-volt/10 text-volt"><i className={`ti ${event.icon} text-2xl`} aria-hidden /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold">{event.name[locale]}</h2>
                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-semibold text-steel">{t(`season.${event.season}.short`)}</span>
                </div>
                <p className="mt-1 text-sm text-steel">{fmtRange(event, locale)} · {event.venue.name[locale]}</p>
                <p className="mt-3 text-sm leading-6 text-steel">{event.highlight[locale]}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-black/10 pt-3">
              <span className="text-xs font-semibold text-steel">{event.verified ? t("org.verified") : t("org.awaitingReview")}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
