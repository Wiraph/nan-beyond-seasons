"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import { districtLoc, loc } from "@/lib/types";
import { getEvent, SEASON_ACCENT } from "@/lib/sports";
import { BADGES, POINTS_PER_CHECKIN, usePassport } from "@/lib/PassportStore";
import { useFeed } from "@/lib/FeedStore";
import seasonsData from "@/data/seasons.json";

export default function CheckinPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);
  const { t, lang } = useI18n();
  const router = useRouter();
  const { hasCheckedIn, checkIn, hydrated } = usePassport();
  const { addPost } = useFeed();
  const [newBadges, setNewBadges] = useState<string[] | null>(null);

  const event = getEvent(eventId);
  if (!event) return notFound();

  const accent = SEASON_ACCENT[event.season];
  const already = hasCheckedIn(event.id);
  const justChecked = newBadges !== null;

  const doCheckIn = () => {
    const earned = checkIn(event.id);
    setNewBadges(earned);
    // Strava-style: finishing an activity auto-shares it to the feed.
    addPost({
      kind: "checkin",
      eventId: event.id,
      badgeIds: earned,
      points: POINTS_PER_CHECKIN,
    });
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/10 bg-pitch/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-3 lg:px-8">
          <button
            onClick={() => router.back()}
            aria-label={t("common.back")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-steel transition hover:bg-black/5 hover:text-frost"
          >
            <i className="ti ti-arrow-left text-xl" aria-hidden />
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-4 pb-10 pt-8 text-center">
        <span className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5 ${accent.text}`}>
          <i className={`ti ${event.icon} text-4xl`} aria-hidden />
        </span>
        <p className="mt-3 text-xs text-steel">
          {lang === "th" ? "จุดเช็คอินงานกีฬา (จำลองการสแกน QR ณ งาน)" : "Event check-in point (simulated on-site QR scan)"}
        </p>
        <h1 className="mt-1 text-xl font-extrabold text-frost lg:text-2xl">{loc(event.name, lang)}</h1>
        <p className="mt-1 text-sm text-steel">
          {loc(event.venue.name, lang)} · {districtLoc(event.venue.district, lang)}
        </p>
        <span className={`mt-2 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium ${accent.text}`}>
          {loc(seasonsData.seasons[event.season].name, lang)}
        </span>

        {!hydrated ? null : justChecked ? (
          <div className="anim-pop mt-8 w-full">
            <div className="sport-card rounded-3xl p-6">
              <i className="ti ti-circle-check text-5xl text-volt" aria-hidden />
              <div className="mt-2 text-lg font-extrabold text-frost">
                {t("sport.checkedIn")} +{POINTS_PER_CHECKIN} {t("sport.points")}
              </div>
              {newBadges!.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {newBadges!.map((id) => {
                    const b = BADGES.find((x) => x.id === id)!;
                    return (
                      <div key={id} className="flex items-center gap-3 rounded-xl bg-volt/10 p-3 text-left">
                        <i className={`ti ${b.icon} text-2xl text-volt`} aria-hidden />
                        <div>
                          <div className="text-sm font-bold text-volt">{loc(b.name, lang)}</div>
                          <div className="text-[11px] text-steel">{loc(b.desc, lang)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-steel">
              <i className="ti ti-share text-volt" aria-hidden /> {t("feed.sharedToFeed")}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-volt px-6 py-2.5 text-sm font-bold text-pitch transition hover:bg-volt-600"
              >
                <i className="ti ti-home text-base" aria-hidden /> {t("feed.viewFeed")}
              </Link>
              <Link
                href="/passport"
                className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-6 py-2.5 text-sm font-semibold text-frost transition hover:border-volt hover:text-volt"
              >
                <i className="ti ti-id-badge-2 text-base" aria-hidden /> {t("sport.passport")}
              </Link>
            </div>
          </div>
        ) : already ? (
          <div className="mt-8 w-full">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-4 py-2 text-sm text-steel">
              <i className="ti ti-circle-check text-volt" aria-hidden /> {t("sport.checkedIn")}
            </p>
            <div className="mt-4">
              <Link href="/passport" className="text-sm font-medium text-volt hover:underline">
                {t("sport.passport")} →
              </Link>
            </div>
          </div>
        ) : (
          <button
            onClick={doCheckIn}
            className="mt-8 flex items-center gap-2 rounded-full bg-volt px-8 py-3 text-base font-bold text-pitch transition hover:bg-volt-600"
          >
            <i className="ti ti-qrcode text-xl" aria-hidden /> {t("sport.checkin")}
          </button>
        )}
      </main>
    </>
  );
}
