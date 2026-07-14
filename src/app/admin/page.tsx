"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { managementEventMetrics } from "@/lib/management-events";
import { eventsByUrgency, fmtRange, sportEvents } from "@/lib/sports";

export default function AdminOverviewPage() {
  const { lang } = useI18n();
  const locale = lang === "en" ? "en" : "th";
  const metrics = managementEventMetrics(sportEvents);
  const reviewEvents = eventsByUrgency().slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-pitch p-5 text-frost sm:p-7">
        <span className="inline-flex rounded-full bg-volt/15 px-3 py-1 text-xs font-bold text-volt">Administrator demo / ตัวอย่างผู้ดูแล</span>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Event operations overview / ภาพรวมการดำเนินงาน</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">
          Aggregate review information is derived from the existing Nan Game On sport events. This is a read-only demo workspace with no identity, event, or Supabase mutations.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Administrator event metrics">
        <Metric label="All event records / งานทั้งหมด" value={metrics.total} icon="ti-calendar-event" />
        <Metric label="Needs review / รอตรวจสอบ" value={metrics.needsReview} icon="ti-clipboard-check" />
        <Metric label="Competition mode / แข่งขัน" value={metrics.compete} icon="ti-trophy" />
        <Metric label="Spectator mode / เข้าชม" value={metrics.spectate} icon="ti-users" />
      </section>

      <section className="rounded-2xl border border-pitch/10 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Review list / รายการตรวจสอบ</h2>
            <p className="mt-1 text-sm text-steel">Upcoming and recent event records from the shared read model.</p>
          </div>
          <Link href="/admin/events" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-pitch/15 px-3 text-sm font-semibold hover:border-volt hover:text-volt">
            All events / งานทั้งหมด <i className="ti ti-arrow-right" aria-hidden />
          </Link>
        </div>
        <div className="mt-4 divide-y divide-pitch/10">
          {reviewEvents.map((event) => (
            <div key={event.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-volt/10 text-volt"><i className={`ti ${event.icon} text-xl`} aria-hidden /></span>
              <div className="min-w-48 flex-1">
                <p className="font-semibold">{event.name[locale]}</p>
                <p className="text-xs text-steel">{fmtRange(event, locale)} · {event.venue.name[locale]}</p>
              </div>
              <span className="rounded-full bg-[#fff3ed] px-3 py-1 text-xs font-semibold text-[#b54708]">{event.verified ? "Verified" : "Review demo"}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-pitch/10 bg-white p-4">
      <i className={`ti ${icon} text-xl text-volt`} aria-hidden />
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-steel">{label}</p>
    </div>
  );
}
