"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { managementEventMetrics } from "@/lib/management-events";
import { SPORT_TYPE_LABEL, sportEvents } from "@/lib/sports";

export default function AdminUsersPage() {
  const { lang } = useI18n();
  const locale = lang === "en" ? "en" : "th";
  const metrics = managementEventMetrics(sportEvents);
  const sportQueues = [...new Set(sportEvents.map((event) => event.sportType))].map((sportType) => ({
    sportType,
    events: sportEvents.filter((event) => event.sportType === sportType),
  }));

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-volt">Administrator demo preview</span>
        <h1 className="mt-1 text-2xl font-bold">Organizers & users / ผู้จัดงานและผู้ใช้</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-steel">There are no stored organizer or user profiles in this demo. The review lists below group only the existing sport-event records and never create identities.</p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Organizer and user demo aggregates">
        <Metric label="Organizer review queues / คิวผู้จัด" value={sportQueues.length} icon="ti-briefcase" />
        <Metric label="Event audience modes / รูปแบบผู้ชม" value={metrics.spectate} icon="ti-users" />
        <Metric label="Venue districts / อำเภอสถานที่" value={new Set(sportEvents.map((event) => event.venue.district)).size} icon="ti-map-pin" />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-pitch/10 bg-white p-5">
          <h2 className="text-lg font-bold">Organizer review queues / คิวตรวจสอบผู้จัด</h2>
          <p className="mt-1 text-sm text-steel">Grouped by sport type from published event records.</p>
          <div className="mt-4 divide-y divide-pitch/10">
            {sportQueues.map(({ sportType, events }) => (
              <div key={sportType} className="flex items-center gap-3 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-volt/10 text-volt"><i className={`ti ${events[0].icon} text-xl`} aria-hidden /></span>
                <div className="min-w-0 flex-1"><p className="font-semibold">{SPORT_TYPE_LABEL[sportType]?.[locale] ?? sportType}</p><p className="text-xs text-steel">{events.length} linked event record{events.length === 1 ? "" : "s"}</p></div>
                <span className="rounded-full bg-pitch/5 px-2 py-1 text-xs font-semibold text-steel">Demo</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-pitch/10 bg-white p-5">
          <h2 className="text-lg font-bold">User audience review / ตรวจสอบกลุ่มผู้ใช้</h2>
          <p className="mt-1 text-sm text-steel">Audience indicators are inferred from event modes, not user profiles.</p>
          <dl className="mt-4 divide-y divide-pitch/10">
            <Row label="Spectator-enabled events / งานเข้าชม" value={metrics.spectate} />
            <Row label="Competition-enabled events / งานแข่งขัน" value={metrics.compete} />
            <Row label="No stored user profiles / ไม่มีโปรไฟล์ผู้ใช้" value={0} />
          </dl>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: string; label: string; value: number }) {
  return <div className="rounded-2xl border border-pitch/10 bg-white p-4"><i className={`ti ${icon} text-xl text-volt`} aria-hidden /><p className="mt-3 text-3xl font-bold">{value}</p><p className="mt-1 text-sm text-steel">{label}</p></div>;
}

function Row({ label, value }: { label: string; value: number }) {
  return <div className="flex items-center justify-between gap-4 py-3"><dt className="text-sm text-steel">{label}</dt><dd className="text-xl font-bold">{value}</dd></div>;
}
