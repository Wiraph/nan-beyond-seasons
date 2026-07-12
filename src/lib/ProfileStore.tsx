"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getUid, supabase } from "./supabase";

export type Profile = {
  name: string;
  color: string;
};

const DEFAULT_PROFILE: Profile = { name: "", color: "#fc5200" };

export const AVATAR_COLORS = [
  "#fc5200",
  "#059669",
  "#0284c7",
  "#ea580c",
  "#db2777",
  "#7c3aed",
  "#d97706",
];

/** Display name with a sensible default per language. */
export function displayName(profile: Profile, lang: string): string {
  if (profile.name.trim()) return profile.name.trim();
  return lang === "th" ? "นักเที่ยวน่าน" : "Nan Explorer";
}

export function initial(name: string): string {
  const s = name.trim();
  return s ? [...s][0].toUpperCase() : "N";
}

type ProfileContextValue = {
  profile: Profile;
  setName: (name: string) => void;
  setColor: (color: string) => void;
  hydrated: boolean;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

const STORAGE_KEY = "ngo-profile";

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
    } catch {
      // corrupted storage — keep defaults
    }
    setHydrated(true);
  }, []);

  const syncTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Debounced fire-and-forget upsert so the name lands on the shared
    // feed/leaderboard; localStorage stays the source of truth locally.
    if (supabase) {
      const sb = supabase;
      if (syncTimer.current) window.clearTimeout(syncTimer.current);
      syncTimer.current = window.setTimeout(() => {
        sb
          .from("profiles")
          .upsert({
            uid: getUid(),
            name: profile.name,
            color: profile.color,
            updated_at: new Date().toISOString(),
          })
          .then(({ error }) => {
            if (error) console.warn("profile sync failed:", error.message);
          });
      }, 800);
    }
  }, [profile, hydrated]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      hydrated,
      setName: (name) => setProfile((p) => ({ ...p, name: name.slice(0, 40) })),
      setColor: (color) => setProfile((p) => ({ ...p, color })),
    }),
    [profile, hydrated]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
