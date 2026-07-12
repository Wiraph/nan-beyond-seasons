"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LangSwitcher from "@/components/LangSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { loc } from "@/lib/types";
import {
  daysUntil,
  eventStatus,
  getEvent,
  nextEvent,
  SEASON_ACCENT,
} from "@/lib/sports";
import { BADGES, usePassport } from "@/lib/PassportStore";
import { displayName, initial, useProfile } from "@/lib/ProfileStore";
import { useFeed, type FeedItem } from "@/lib/FeedStore";
import { useLeaderboard } from "@/lib/useLeaderboard";

/** Fictional community members on the demo leaderboard. */
const RANK_SEED: { name: string; color: string; points: number }[] = [
  { name: "น้องเมย์ เชียร์เก่ง", color: "#7c3aed", points: 450 },
  { name: "ทีมเรือบ้านท่าลี่", color: "#0284c7", points: 400 },
  { name: "พี่หน่อง สายเทรล", color: "#059669", points: 300 },
  { name: "บอส วิ่งเมืองเก่า", color: "#db2777", points: 250 },
  { name: "ครูแอน ปั่นเพลิน", color: "#ea580c", points: 150 },
  { name: "จ๋า เที่ยวคนเดียวก็สนุก", color: "#2563eb", points: 100 },
];

function timeAgo(at: number, t: (k: string) => string): string {
  const mins = Math.max(0, Math.round((Date.now() - at) / 60000));
  if (mins < 60) return t("feed.justNow");
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours} ${t("feed.hoursAgo")}`;
  return `${Math.round(hours / 24)} ${t("feed.daysAgo")}`;
}

export default function FeedHome() {
  const { t, lang } = useI18n();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const [tab, setTab] = useState<"feed" | "rank">("feed");

  const hero = nextEvent(now ?? new Date("2026-07-11"));
  const heroDays = now ? daysUntil(hero, now) : null;
  const heroLive = now ? eventStatus(hero, now) === "live" : false;

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/10 bg-pitch/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-volt text-pitch">
              <i className="ti ti-bolt text-xl" aria-hidden />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-frost">
              NAN <span className="text-volt">GAME ON</span>
            </span>
          </Link>
          <LangSwitcher dark />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-10 pt-4 lg:px-8 lg:pt-6">
        {/* Strava-style dashboard: profile | feed | upcoming+ranking */}
        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)_320px] lg:items-start lg:gap-6">
          {/* Left: profile summary (desktop) */}
          <aside className="hidden lg:block">
            <ProfileCard />
          </aside>

          {/* Center */}
          <div className="mx-auto w-full max-w-2xl">
            {/* Next-event strip (mobile only — desktop shows it on the right) */}
            <Link
              href="/calendar"
              className={`sport-card anim-rise flex items-center gap-3 rounded-2xl p-3.5 transition hover:border-volt/40 lg:hidden ${SEASON_ACCENT[hero.season].flag}`}
            >
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 ${SEASON_ACCENT[hero.season].text}`}>
                <i className={`ti ${hero.icon} text-xl`} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-steel">
                  {heroLive ? t("sport.liveNow") : t("sport.nextEvent")}
                </span>
                <span className="block truncate text-sm font-bold text-frost">{loc(hero.name, lang)}</span>
              </span>
              {!heroLive && heroDays !== null && (
                <span className="shrink-0 text-center" suppressHydrationWarning>
                  <span className="sport-num block text-2xl text-volt">{heroDays}</span>
                  <span className="block text-[9px] uppercase tracking-widest text-steel">
                    {heroDays === 0 ? t("sport.today") : t("sport.days")}
                  </span>
                </span>
              )}
              <i className="ti ti-chevron-right shrink-0 text-steel" aria-hidden />
            </Link>

            {/* Tabs (mobile only — desktop shows ranking on the right) */}
            <div className="mt-4 grid grid-cols-2 rounded-full border border-black/10 bg-pitch-800 p-1 text-sm font-semibold lg:hidden">
              {(["feed", "rank"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  aria-pressed={tab === k}
                  className={`rounded-full py-1.5 transition ${
                    tab === k ? "bg-volt text-pitch" : "text-steel hover:text-frost"
                  }`}
                >
                  {t(`feed.tab.${k}`)}
                </button>
              ))}
            </div>

            <div className={tab === "feed" ? "" : "hidden lg:block"}>
              <FeedTab />
            </div>
            <div className={`${tab === "rank" ? "" : "hidden"} lg:hidden`}>
              <RankTab />
            </div>
          </div>

          {/* Right: upcoming event + ranking (desktop) */}
          <aside className="hidden lg:flex lg:flex-col lg:gap-5">
            <Link
              href="/calendar"
              className={`sport-card flex flex-col rounded-2xl p-4 transition hover:border-volt/40 ${SEASON_ACCENT[hero.season].flag}`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-steel">
                {heroLive ? t("sport.liveNow") : t("sport.nextEvent")}
              </span>
              <span className="mt-1.5 flex items-center gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/5 ${SEASON_ACCENT[hero.season].text}`}>
                  <i className={`ti ${hero.icon} text-2xl`} aria-hidden />
                </span>
                <span className="min-w-0 flex-1 text-sm font-bold leading-snug text-frost">
                  {loc(hero.name, lang)}
                </span>
                {!heroLive && heroDays !== null && (
                  <span className="shrink-0 text-center" suppressHydrationWarning>
                    <span className="sport-num block text-3xl text-volt">{heroDays}</span>
                    <span className="block text-[9px] uppercase tracking-widest text-steel">
                      {heroDays === 0 ? t("sport.today") : t("sport.days")}
                    </span>
                  </span>
                )}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-volt">
                {t("sport.calendar")} <i className="ti ti-chevron-right text-[10px]" aria-hidden />
              </span>
            </Link>
            <RankTab />
          </aside>
        </div>
      </main>
    </>
  );
}

/** Strava-style left column: who you are + your numbers at a glance. */
function ProfileCard() {
  const { t, lang } = useI18n();
  const { profile } = useProfile();
  const { points, earnedBadges, checkins, hydrated } = usePassport();

  return (
    <div className="sport-card rounded-2xl p-5">
      <div className="flex flex-col items-center text-center">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
          style={{ backgroundColor: profile.color }}
        >
          {initial(displayName(profile, lang))}
        </span>
        <div className="mt-2.5 text-base font-extrabold text-frost">{displayName(profile, lang)}</div>
        <div className="text-[11px] text-steel">Nan Game On</div>
      </div>
      <div className="mt-4 grid grid-cols-3 divide-x divide-black/8 border-y border-black/8 py-3 text-center">
        <div>
          <div className="sport-num text-lg text-frost" suppressHydrationWarning>
            {hydrated ? points : "—"}
          </div>
          <div className="text-[10px] text-steel">{t("sport.points")}</div>
        </div>
        <div>
          <div className="sport-num text-lg text-frost" suppressHydrationWarning>
            {hydrated ? earnedBadges.length : "—"}
          </div>
          <div className="text-[10px] text-steel">{t("sport.badges")}</div>
        </div>
        <div>
          <div className="sport-num text-lg text-frost" suppressHydrationWarning>
            {hydrated ? checkins.length : "—"}
          </div>
          <div className="text-[10px] text-steel">{t("sport.checkin")}</div>
        </div>
      </div>
      <Link
        href="/passport"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-full border border-black/15 py-2 text-sm font-semibold text-frost transition hover:border-volt hover:text-volt"
      >
        <i className="ti ti-id-badge-2 text-base" aria-hidden /> {t("sport.passport")}
      </Link>
    </div>
  );
}

function FeedTab() {
  const { t, lang } = useI18n();
  const { items, kudosed, addPost, toggleKudos, hydrated } = useFeed();
  const { profile } = useProfile();
  const [draft, setDraft] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    addPost({ kind: "text", text });
    setDraft("");
  };

  return (
    <div className="mt-4">
      {/* Composer */}
      <form onSubmit={submit} className="sport-card flex items-center gap-2.5 rounded-2xl p-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-pitch"
          style={{ backgroundColor: profile.color }}
        >
          {initial(displayName(profile, lang))}
        </span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("feed.composer")}
          className="min-w-0 flex-1 bg-transparent text-sm text-frost outline-none placeholder:text-steel"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="shrink-0 rounded-full bg-volt px-4 py-1.5 text-xs font-bold text-pitch transition hover:bg-volt-600 disabled:opacity-40"
        >
          {t("feed.post")}
        </button>
      </form>

      {/* Posts */}
      <div className="stagger mt-3 flex flex-col gap-3">
        {hydrated &&
          items.map((item) => (
            <PostCard
              key={item.id}
              item={item}
              kudosed={!!kudosed[item.id]}
              onKudos={() => toggleKudos(item.id)}
            />
          ))}
      </div>
    </div>
  );
}

function PostCard({
  item,
  kudosed,
  onKudos,
}: {
  item: FeedItem;
  kudosed: boolean;
  onKudos: () => void;
}) {
  const { t, lang } = useI18n();
  const { profile } = useProfile();
  const event = item.eventId ? getEvent(item.eventId) : undefined;
  const accent = event ? SEASON_ACCENT[event.season] : null;

  const name = item.own ? displayName(profile, lang) : item.author!;
  const color = item.own ? profile.color : item.avatarColor!;
  const text =
    typeof item.text === "string" ? item.text : item.text ? loc(item.text, lang) : "";
  const kudosCount = item.baseKudos + (kudosed ? 1 : 0);

  return (
    <article className={`sport-card rounded-2xl p-4 ${accent ? accent.flag : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-pitch"
          style={{ backgroundColor: color }}
        >
          {initial(name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="truncate text-sm font-bold text-frost">{name}</span>
            {item.own && (
              <span className="rounded-full bg-volt/15 px-1.5 py-0.5 text-[9px] font-semibold text-volt">
                {t("feed.you")}
              </span>
            )}
            {item.demo && (
              <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[9px] text-steel">
                {t("feed.demo")}
              </span>
            )}
          </div>
          <div className="text-[10px] text-steel" suppressHydrationWarning>
            {timeAgo(item.at, t)}
          </div>
        </div>
      </div>

      {/* Check-in banner */}
      {item.kind === "checkin" && event && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/5 p-2.5">
          <i className={`ti ${event.icon} text-xl ${accent!.text}`} aria-hidden />
          <span className="min-w-0 flex-1 text-[12px] text-steel">
            {t("feed.checkedInAt")}{" "}
            <Link href={`/events/${event.id}`} className="font-semibold text-frost hover:text-volt hover:underline">
              {loc(event.name, lang)}
            </Link>
          </span>
          {item.points ? (
            <span className="sport-num shrink-0 text-sm text-volt">+{item.points}</span>
          ) : null}
        </div>
      )}

      {/* Body */}
      {text && <p className="mt-2.5 text-sm leading-relaxed text-frost">{text}</p>}

      {/* Badges earned */}
      {item.badgeIds && item.badgeIds.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.badgeIds.map((id) => {
            const b = BADGES.find((x) => x.id === id);
            if (!b) return null;
            return (
              <span
                key={id}
                className="flex items-center gap-1 rounded-full bg-volt/12 px-2 py-1 text-[10px] font-semibold text-volt"
              >
                <i className={`ti ${b.icon}`} aria-hidden /> {loc(b.name, lang)}
              </span>
            );
          })}
        </div>
      )}

      {/* Event chip for text posts */}
      {item.kind === "text" && event && (
        <Link
          href={`/events/${event.id}`}
          className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium transition hover:bg-black/8 ${accent!.text}`}
        >
          <i className={`ti ${event.icon}`} aria-hidden /> {loc(event.name, lang)}
        </Link>
      )}

      {/* Footer */}
      <div className="mt-3 border-t border-black/8 pt-2.5">
        <button
          onClick={onKudos}
          aria-pressed={kudosed}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            kudosed ? "bg-volt/15 text-volt" : "text-steel hover:bg-black/5 hover:text-frost"
          }`}
        >
          <i className={`ti ${kudosed ? "ti-flame-filled" : "ti-flame"} text-base`} aria-hidden />
          {kudosCount > 0 ? kudosCount : ""} {t("feed.kudos")}
        </button>
      </div>
    </article>
  );
}

function RankTab() {
  const { t, lang } = useI18n();
  const { points, hydrated } = usePassport();
  const { profile } = useProfile();
  const dbRows = useLeaderboard();

  const rows = useMemo(() => {
    const me = {
      name: displayName(profile, lang),
      color: profile.color,
      points,
      me: true,
    };
    return [
      ...RANK_SEED.map((r) => ({ ...r, me: false })),
      ...dbRows.map((r) => ({ ...r, me: false })),
      me,
    ].sort((a, b) => b.points - a.points);
  }, [profile, lang, points, dbRows]);

  if (!hydrated) return null;

  return (
    <div className="mt-4">
      <h2 className="flex items-center gap-2 text-base font-extrabold text-frost">
        <i className="ti ti-trophy text-volt" aria-hidden /> {t("feed.rankTitle")}
      </h2>
      <p className="mt-0.5 text-xs text-steel">{t("feed.rankSub")}</p>

      <div className="stagger mt-3 flex flex-col gap-2">
        {rows.map((r, i) => (
          <div
            key={`${r.name}-${i}`}
            className={`sport-card flex items-center gap-3 rounded-xl p-3 ${
              r.me ? "border-volt/50" : ""
            }`}
          >
            <span
              className={`sport-num w-7 shrink-0 text-center text-lg ${
                i === 0 ? "text-volt" : i < 3 ? "text-frost" : "text-steel"
              }`}
            >
              {i + 1}
            </span>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-pitch"
              style={{ backgroundColor: r.color }}
            >
              {initial(r.name)}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-frost">
              {r.name}
              {r.me && (
                <span className="ml-1.5 rounded-full bg-volt/15 px-1.5 py-0.5 text-[9px] font-semibold text-volt">
                  {t("feed.you")}
                </span>
              )}
            </span>
            <span className="sport-num shrink-0 text-base text-volt">{r.points}</span>
            <span className="shrink-0 text-[10px] text-steel">{t("sport.points")}</span>
          </div>
        ))}
      </div>

      <Link
        href="/calendar"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-full border border-black/15 py-2.5 text-sm font-semibold text-frost transition hover:border-volt hover:text-volt"
      >
        <i className="ti ti-calendar-bolt text-base" aria-hidden /> {t("sport.calendar")}
      </Link>
    </div>
  );
}
