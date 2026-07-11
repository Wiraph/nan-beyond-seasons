"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Profile = {
  name: string;
  color: string;
};

const DEFAULT_PROFILE: Profile = { name: "", color: "#c8f135" };

export const AVATAR_COLORS = [
  "#c8f135",
  "#4ade80",
  "#38bdf8",
  "#fb923c",
  "#f472b6",
  "#a78bfa",
  "#fbbf24",
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

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
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
