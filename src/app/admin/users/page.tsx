"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { managementEventMetrics } from "@/lib/management-events";
import { SPORT_TYPE_LABEL, sportEvents } from "@/lib/sports";

export default function AdminUsersPage() {
  const { t, lang } = useI18n();
  const locale = lang === "en" ? "en" : "th";
  const metrics = managementEventMetrics(sportEvents);
  const sportQueues = [...new Set(sportEvents.map((event) => event.sportType))].map((sportType) => ({
    sportType,
    events: sportEvents.filter((event) => event.sportType === sportType),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("mgmt.nav.users")}</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-steel">{t("adm.users.intro")}</p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3" aria-label={t("adm.users.metric.queues")}>
        <Metric label={t("adm.users.metric.queues")} value={sportQueues.length} icon="ti-briefcase" />
        <Metric label={t("adm.users.metric.audienceModes")} value={metrics.spectate} icon="ti-users" />
        <Metric label={t("adm.users.metric.districts")} value={new Set(sportEvents.map((event) => event.venue.district)).size} icon="ti-map-pin" />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="sport-card rounded-md p-5">
          <h2 className="text-lg font-bold">{t("adm.users.metric.queues")}</h2>
          <p className="mt-1 text-sm text-steel">{t("adm.users.queues.sub")}</p>
          <div className="mt-4 divide-y divide-black/10">
            {sportQueues.map(({ sportType, events }) => (
              <div key={sportType} className="flex items-center gap-3 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-volt/10 text-volt"><i className={`ti ${events[0].icon} text-xl`} aria-hidden /></span>
                <div className="min-w-0 flex-1"><p className="font-semibold">{SPORT_TYPE_LABEL[sportType]?.[locale] ?? sportType}</p><p className="text-xs text-steel">{events.length} {events.length === 1 ? t("adm.users.linkedOne") : t("adm.users.linkedMany")}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="sport-card rounded-md p-5">
          <h2 className="text-lg font-bold">{t("adm.users.audience.title")}</h2>
          <p className="mt-1 text-sm text-steel">{t("adm.users.audience.sub")}</p>
          <dl className="mt-4 divide-y divide-black/10">
            <Row label={t("adm.users.row.spectator")} value={metrics.spectate} />
            <Row label={t("adm.users.row.competition")} value={metrics.compete} />
          </dl>
        </div>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: string; label: string; value: number }) {
  return <div className="sport-card rounded-md p-4"><i className={`ti ${icon} text-xl text-volt`} aria-hidden /><p className="mt-3 text-3xl font-bold">{value}</p><p className="mt-1 text-sm text-steel">{label}</p></div>;
}

function Row({ label, value }: { label: string; value: number }) {
  return <div className="flex items-center justify-between gap-4 py-3"><dt className="text-sm text-steel">{label}</dt><dd className="text-xl font-bold">{value}</dd></div>;
}
