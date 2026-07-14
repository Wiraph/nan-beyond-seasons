"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { managementEventMetrics } from "@/lib/management-events";
import { eventsByUrgency, fmtRange, sportEvents } from "@/lib/sports";

export default function OrganizerOverviewPage() {
  const { lang } = useI18n();
  const locale = lang === "en" ? "en" : "th";
  const metrics = managementEventMetrics(sportEvents);
  const managedEvents = eventsByUrgency().filter((event) => event.mode.includes("compete")).slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-pitch p-5 text-frost sm:p-7">
        <span className="inline-flex rounded-full bg-volt/15 px-3 py-1 text-xs font-bold text-volt">Demo management preview / ตัวอย่างการจัดการ</span>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Run your event workspace / จัดการพื้นที่งานของคุณ</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">
          Event information is read from the published Nan Game On sport schedule. This organizer workspace is a demo preview and does not save changes to Supabase.
        </p>
        <Link href="/organizer/events/new" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-volt px-4 text-sm font-bold text-pitch hover:bg-volt-600">
          <i className="ti ti-plus" aria-hidden /> Create event — demo preview / สร้างงาน (ตัวอย่าง)
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Organizer event totals">
        <Metric label="Published event records / รายการงาน" value={metrics.total} icon="ti-calendar-event" />
        <Metric label="Competition-ready / สำหรับแข่งขัน" value={metrics.compete} icon="ti-trophy" />
        <Metric label="Needs review / รอตรวจสอบ" value={metrics.needsReview} icon="ti-clipboard-check" />
      </section>

      <section className="rounded-2xl border border-pitch/10 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">My event queue / คิวงานของฉัน</h2>
            <p className="mt-1 text-sm text-steel">Competition-capable entries from the existing sport schedule.</p>
          </div>
          <Link href="/organizer/events" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-pitch/15 px-3 text-sm font-semibold hover:border-volt hover:text-volt">
            View all / ดูทั้งหมด <i className="ti ti-arrow-right" aria-hidden />
          </Link>
        </div>
        <div className="mt-4 divide-y divide-pitch/10">
          {managedEvents.map((event) => (
            <div key={event.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-volt/10 text-volt"><i className={`ti ${event.icon} text-xl`} aria-hidden /></span>
              <div className="min-w-48 flex-1">
                <p className="font-semibold">{event.name[locale]}</p>
                <p className="text-xs text-steel">{fmtRange(event, locale)} · {event.venue.name[locale]}</p>
              </div>
              <span className="rounded-full bg-[#fff3ed] px-3 py-1 text-xs font-semibold text-[#b54708]">Read-only demo / ตัวอย่างอ่านอย่างเดียว</span>
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
