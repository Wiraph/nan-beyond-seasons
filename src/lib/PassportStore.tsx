"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getEvent, sportEvents } from "./sports";
import type { SeasonKey } from "./weather";

export type Checkin = {
  eventId: string;
  at: string; // ISO datetime
  season: SeasonKey;
};

export type BadgeDef = {
  id: string;
  icon: string;
  name: { th: string; en: string };
  desc: { th: string; en: string };
  earned: (checkins: Checkin[]) => boolean;
};

export const POINTS_PER_CHECKIN = 50;

export const BADGES: BadgeDef[] = [
  {
    id: "first-game",
    icon: "ti-confetti",
    name: { th: "เปิดเกม!", en: "Game On!" },
    desc: { th: "เช็คอินงานกีฬาครั้งแรก", en: "First event check-in" },
    earned: (c) => c.length >= 1,
  },
  {
    id: "green-raider",
    icon: "ti-cloud-rain",
    name: { th: "นักสู้สายฝน", en: "Green Season Raider" },
    desc: { th: "เช็คอินงานกีฬาในกรีนซีซัน", en: "Checked in at a Green Season event" },
    earned: (c) => c.some((x) => x.season === "green"),
  },
  {
    id: "cool-chaser",
    icon: "ti-snowflake",
    name: { th: "นักล่าลมหนาว", en: "Cool Season Chaser" },
    desc: { th: "เช็คอินงานกีฬาในฤดูหนาว", en: "Checked in at a Cool Season event" },
    earned: (c) => c.some((x) => x.season === "cool"),
  },
  {
    id: "heat-hero",
    icon: "ti-sun",
    name: { th: "ผู้กล้าหน้าร้อน", en: "Hot Season Hero" },
    desc: { th: "เช็คอินงานกีฬาในฤดูร้อน", en: "Checked in at a Hot Season event" },
    earned: (c) => c.some((x) => x.season === "hot"),
  },
  {
    id: "boat-fan",
    icon: "ti-sailboat",
    name: { th: "นักเชียร์เรือแข่ง", en: "Longboat Superfan" },
    desc: { th: "เช็คอินงานแข่งเรือยาวเมืองน่าน", en: "Checked in at a Nan longboat race" },
    earned: (c) =>
      c.some((x) => getEvent(x.eventId)?.sportType === "boat-race"),
  },
  {
    id: "all-season-athlete",
    icon: "ti-award",
    name: { th: "Nan All-Season Athlete", en: "Nan All-Season Athlete" },
    desc: { th: "เช็คอินครบทั้ง 3 ฤดู — สุดยอด!", en: "Checked in across all 3 seasons — legendary!" },
    earned: (c) =>
      (["green", "cool", "hot"] as SeasonKey[]).every((s) => c.some((x) => x.season === s)),
  },
  {
    id: "full-house",
    icon: "ti-crown",
    name: { th: "แฟนพันธุ์แท้เมืองน่าน", en: "Nan Full House" },
    desc: { th: "เช็คอินครบทุกงานในปฏิทิน", en: "Checked in at every event on the calendar" },
    earned: (c) => sportEvents.every((e) => c.some((x) => x.eventId === e.id)),
  },
];

type PassportContextValue = {
  checkins: Checkin[];
  points: number;
  earnedBadges: BadgeDef[];
  hasCheckedIn: (eventId: string) => boolean;
  /** Returns the badge ids newly unlocked by this check-in. */
  checkIn: (eventId: string) => string[];
  hydrated: boolean;
};

const PassportContext = createContext<PassportContextValue | null>(null);

const STORAGE_KEY = "ngo-passport";

export function PassportProvider({ children }: { children: React.ReactNode }) {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCheckins(JSON.parse(raw));
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(checkins));
  }, [checkins, hydrated]);

  const value = useMemo<PassportContextValue>(() => {
    const earnedBadges = BADGES.filter((b) => b.earned(checkins));
    return {
      checkins,
      points: checkins.length * POINTS_PER_CHECKIN,
      earnedBadges,
      hydrated,
      hasCheckedIn: (eventId) => checkins.some((c) => c.eventId === eventId),
      checkIn: (eventId) => {
        const event = getEvent(eventId);
        if (!event || checkins.some((c) => c.eventId === eventId)) return [];
        const before = new Set(BADGES.filter((b) => b.earned(checkins)).map((b) => b.id));
        const next = [
          ...checkins,
          { eventId, at: new Date().toISOString(), season: event.season },
        ];
        setCheckins(next);
        return BADGES.filter((b) => b.earned(next) && !before.has(b.id)).map((b) => b.id);
      },
    };
  }, [checkins, hydrated]);

  return <PassportContext.Provider value={value}>{children}</PassportContext.Provider>;
}

export function usePassport() {
  const ctx = useContext(PassportContext);
  if (!ctx) throw new Error("usePassport must be used within PassportProvider");
  return ctx;
}
