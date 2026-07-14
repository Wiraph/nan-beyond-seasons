"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { fmtRange, sportEvents } from "@/lib/sports";

export default function OrganizerCheckinsPage() {
  const { t, lang } = useI18n();
  const locale = lang === "en" ? "en" : "th";
  const [openEvent, setOpenEvent] = useState<string | null>(null);
  const events = sportEvents.filter((event) => event.mode.includes("compete"));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("mgmt.nav.checkins")}</h1>
        <p className="mt-1 text-sm text-steel">{t("org.checkins.sub")}</p>
      </div>
      <div className="space-y-3">
        {events.map((event) => {
          const expanded = openEvent === event.id;
          return (
            <section key={event.id} className="sport-card rounded-md p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-volt/10 text-volt"><i className="ti ti-qrcode text-2xl" aria-hidden /></span>
                <div className="min-w-48 flex-1">
                  <h2 className="font-bold">{event.name[locale]}</h2>
                  <p className="text-sm text-steel">{fmtRange(event, locale)} · {event.venue.name[locale]}</p>
                </div>
                <button type="button" onClick={() => setOpenEvent(expanded ? null : event.id)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-black/10 px-3 text-sm font-semibold hover:border-volt hover:text-volt" aria-expanded={expanded}>
                  {expanded ? t("org.checkins.close") : t("org.checkins.view")} <i className={`ti ${expanded ? "ti-chevron-up" : "ti-chevron-down"}`} aria-hidden />
                </button>
              </div>
              {expanded && <p className="mt-4 rounded-lg bg-black/5 p-3 text-sm text-steel">{t("org.checkins.note")}</p>}
            </section>
          );
        })}
      </div>
    </div>
  );
}
