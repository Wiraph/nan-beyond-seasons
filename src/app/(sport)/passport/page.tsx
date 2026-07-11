"use client";

import Link from "next/link";
import LangSwitcher from "@/components/LangSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { loc } from "@/lib/types";
import { fmtDate, getEvent } from "@/lib/sports";
import { BADGES, usePassport } from "@/lib/PassportStore";

export default function PassportPage() {
  const { t, lang } = useI18n();
  const { checkins, points, earnedBadges, hydrated } = usePassport();
  const earnedIds = new Set(earnedBadges.map((b) => b.id));

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-pitch/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <h1 className="flex items-center gap-2 text-lg font-extrabold text-frost">
            <i className="ti ti-id-badge-2 text-volt" aria-hidden /> {t("sport.passport")}
          </h1>
          <LangSwitcher dark />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-10 pt-5 lg:px-8">
        {/* Score card */}
        <section className="sport-card anim-rise rounded-3xl p-5 lg:p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="sport-num text-5xl text-volt" suppressHydrationWarning>
                {hydrated ? points : "—"}
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-steel">{t("sport.points")}</div>
            </div>
            <div className="text-center">
              <div className="sport-num text-5xl text-frost" suppressHydrationWarning>
                {hydrated ? earnedBadges.length : "—"}
                <span className="text-2xl text-steel">/{BADGES.length}</span>
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-steel">{t("sport.badges")}</div>
            </div>
          </div>
          <p className="mt-4 text-center text-[12px] text-steel">
            {lang === "th"
              ? "สะสมแต้มจากการเช็คอิน แลกส่วนลดร้านค้า/โฮมสเตย์ชุมชนที่ร่วมรายการ"
              : "Earn points from check-ins and redeem them with participating community businesses"}
          </p>
        </section>

        {/* Badges */}
        <h2 className="mt-6 flex items-center gap-2 text-base font-extrabold text-frost">
          <i className="ti ti-medal-2 text-volt" aria-hidden /> {t("sport.badges")}
        </h2>
        <div className="stagger mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {BADGES.map((b) => {
            const earned = earnedIds.has(b.id);
            return (
              <div
                key={b.id}
                className={`sport-card rounded-2xl p-4 text-center ${earned ? "" : "opacity-40 grayscale"}`}
              >
                <i className={`ti ${b.icon} text-3xl ${earned ? "text-volt" : "text-steel"}`} aria-hidden />
                <div className="mt-1.5 text-sm font-bold text-frost">{loc(b.name, lang)}</div>
                <div className="mt-0.5 text-[10px] leading-relaxed text-steel">{loc(b.desc, lang)}</div>
              </div>
            );
          })}
        </div>

        {/* History */}
        {hydrated && checkins.length > 0 && (
          <>
            <h2 className="mt-6 flex items-center gap-2 text-base font-extrabold text-frost">
              <i className="ti ti-history text-volt" aria-hidden />{" "}
              {lang === "th" ? "ประวัติเช็คอิน" : "Check-in history"}
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {[...checkins].reverse().map((c) => {
                const e = getEvent(c.eventId);
                if (!e) return null;
                return (
                  <Link
                    key={c.eventId}
                    href={`/events/${e.id}`}
                    className="sport-card flex items-center gap-3 rounded-xl p-3 transition hover:border-volt/40"
                  >
                    <i className={`ti ${e.icon} text-xl text-volt`} aria-hidden />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-frost">
                      {loc(e.name, lang)}
                    </span>
                    <span className="shrink-0 text-[11px] text-steel">{fmtDate(c.at.slice(0, 10), lang)}</span>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {hydrated && checkins.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-8 text-center">
            <i className="ti ti-qrcode text-4xl text-steel" aria-hidden />
            <p className="mt-2 text-sm text-steel">
              {lang === "th"
                ? "ยังไม่มีเช็คอิน — ไปงานกีฬาแล้วสแกน QR เพื่อเริ่มสะสม"
                : "No check-ins yet — scan the QR at an event to start collecting"}
            </p>
            <Link href="/" className="mt-3 inline-block text-sm font-medium text-volt hover:underline">
              {t("sport.calendar")} →
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
