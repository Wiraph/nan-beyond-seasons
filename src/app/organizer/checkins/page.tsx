"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { fmtRange, sportEvents } from "@/lib/sports";

export default function OrganizerCheckinsPage() {
  const { lang } = useI18n();
  const locale = lang === "en" ? "en" : "th";
  const [openEvent, setOpenEvent] = useState<string | null>(null);
  const events = sportEvents.filter((event) => event.mode.includes("compete"));

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-volt">Demo management preview</span>
        <h1 className="mt-1 text-2xl font-bold">Event check-ins / เช็กอินงาน</h1>
        <p className="mt-1 text-sm text-steel">Stations reference the existing sport schedule; no attendee information is stored in this demo.</p>
      </div>
      <div className="space-y-3">
        {events.map((event) => {
          const expanded = openEvent === event.id;
          return (
            <section key={event.id} className="rounded-2xl border border-pitch/10 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-volt/10 text-volt"><i className="ti ti-qrcode text-2xl" aria-hidden /></span>
                <div className="min-w-48 flex-1">
                  <h2 className="font-bold">{event.name[locale]}</h2>
                  <p className="text-sm text-steel">{fmtRange(event, locale)} · {event.venue.name[locale]}</p>
                </div>
                <button type="button" onClick={() => setOpenEvent(expanded ? null : event.id)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-pitch/15 px-3 text-sm font-semibold hover:border-volt hover:text-volt" aria-expanded={expanded}>
                  {expanded ? "Close preview" : "View check-in preview"} <i className={`ti ${expanded ? "ti-chevron-up" : "ti-chevron-down"}`} aria-hidden />
                </button>
              </div>
              {expanded && <p className="mt-4 rounded-lg bg-pitch/5 p-3 text-sm text-steel">Demo preview only: no attendee roster or check-in scans are loaded, created, or saved.</p>}
            </section>
          );
        })}
      </div>
    </div>
  );
}
