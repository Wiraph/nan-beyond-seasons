"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { managementEventMetrics } from "@/lib/management-events";
import { fmtRange, sportEvents } from "@/lib/sports";

export default function AdminEventsPage() {
  const { lang } = useI18n();
  const locale = lang === "en" ? "en" : "th";
  const metrics = managementEventMetrics(sportEvents);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-volt">Administrator demo preview</span>
        <h1 className="mt-1 text-2xl font-bold">All events / งานทั้งหมด</h1>
        <p className="mt-1 text-sm text-steel">{metrics.total} published sport-event records, shown without editing controls or persistence.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-pitch/10 bg-white">
        <div className="grid grid-cols-[minmax(13rem,2fr)_minmax(8rem,1fr)_minmax(8rem,1fr)] gap-4 border-b border-pitch/10 bg-pitch/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-steel sm:px-5">
          <span>Event / งาน</span><span>Season / ฤดูกาล</span><span>Review / ตรวจสอบ</span>
        </div>
        {sportEvents.map((event) => (
          <article key={event.id} className="grid grid-cols-[minmax(13rem,2fr)_minmax(8rem,1fr)_minmax(8rem,1fr)] gap-4 border-b border-pitch/10 px-4 py-4 last:border-b-0 sm:px-5">
            <div className="min-w-0">
              <p className="truncate font-semibold">{event.name[locale]}</p>
              <p className="mt-1 text-xs text-steel">{fmtRange(event, locale)} · {event.venue.name[locale]}</p>
            </div>
            <span className="self-start rounded-full bg-pitch/5 px-2 py-1 text-xs font-semibold capitalize text-steel">{event.season}</span>
            <span className="self-start rounded-full bg-[#fff3ed] px-2 py-1 text-xs font-semibold text-[#b54708]">{event.verified ? "Verified" : "Demo review"}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
