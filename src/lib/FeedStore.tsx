"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import seedJson from "@/data/feedSeed.json";

export type FeedSeedPost = {
  id: string;
  demo: true;
  author: string;
  avatarColor: string;
  kind: "text" | "checkin";
  eventId?: string;
  text: { th: string; en: string };
  kudos: number;
  hoursAgo: number;
};

export type UserPost = {
  id: string;
  kind: "text" | "checkin";
  eventId?: string;
  text?: string;
  badgeIds?: string[];
  points?: number;
  at: string; // ISO datetime
};

/** Unified shape the feed renders. `own` posts carry the user's profile. */
export type FeedItem = {
  id: string;
  own: boolean;
  demo: boolean;
  author?: string; // seed posts only — own posts use the live profile
  avatarColor?: string;
  kind: "text" | "checkin";
  eventId?: string;
  text?: { th: string; en: string } | string;
  badgeIds?: string[];
  points?: number;
  at: number; // epoch ms, for sorting
  baseKudos: number;
};

type FeedContextValue = {
  items: FeedItem[];
  kudosed: Record<string, boolean>;
  addPost: (post: Omit<UserPost, "id" | "at">) => void;
  toggleKudos: (postId: string) => void;
  hydrated: boolean;
};

const FeedContext = createContext<FeedContextValue | null>(null);

const STORAGE_KEY = "ngo-feed";

const seedPosts = seedJson as FeedSeedPost[];

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [kudosed, setKudosed] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { posts?: UserPost[]; kudosed?: Record<string, boolean> };
        if (Array.isArray(data.posts)) setUserPosts(data.posts);
        if (data.kudosed && typeof data.kudosed === "object") setKudosed(data.kudosed);
      }
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ posts: userPosts, kudosed }));
    }
  }, [userPosts, kudosed, hydrated]);

  const value = useMemo<FeedContextValue>(() => {
    const now = Date.now();
    const items: FeedItem[] = [
      ...userPosts.map((p) => ({
        id: p.id,
        own: true,
        demo: false,
        kind: p.kind,
        eventId: p.eventId,
        text: p.text,
        badgeIds: p.badgeIds,
        points: p.points,
        at: new Date(p.at).getTime(),
        baseKudos: 0,
      })),
      ...seedPosts.map((p) => ({
        id: p.id,
        own: false,
        demo: true,
        author: p.author,
        avatarColor: p.avatarColor,
        kind: p.kind,
        eventId: p.eventId,
        text: p.text,
        at: now - p.hoursAgo * 3600_000,
        baseKudos: p.kudos,
      })),
    ].sort((a, b) => b.at - a.at);

    return {
      items,
      kudosed,
      hydrated,
      addPost: (post) =>
        setUserPosts((prev) => [
          ...prev,
          { ...post, id: `me-${Date.now()}`, at: new Date().toISOString() },
        ]),
      toggleKudos: (postId) =>
        setKudosed((prev) => ({ ...prev, [postId]: !prev[postId] })),
    };
  }, [userPosts, kudosed, hydrated]);

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used within FeedProvider");
  return ctx;
}
