"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import seedJson from "@/data/feedSeed.json";
import { getUid, supabase } from "./supabase";

export type FeedSeedPost = {
  id: string;
  demo: true;
  author: string;
  avatarColor: string;
  kind: "text" | "checkin";
  eventId?: string;
  text: { th: string; en: string };
  image?: string;
  kudos: number;
  hoursAgo: number;
};

export type UserPost = {
  id: string;
  /** Supabase row id once the insert lands — makes kudos ids stable across devices. */
  dbId?: number;
  kind: "text" | "checkin";
  eventId?: string;
  text?: string;
  imageUrl?: string;
  badgeIds?: string[];
  points?: number;
  at: string; // ISO datetime
};

type RemotePost = {
  id: number;
  uid: string;
  author_name: string;
  author_color: string;
  kind: "text" | "checkin";
  event_id: string | null;
  text: string | null;
  image_url: string | null;
  badge_ids: string[] | null;
  points: number | null;
  at: string;
};

/** Unified shape the feed renders. `own` posts carry the user's profile. */
export type FeedItem = {
  id: string;
  own: boolean;
  demo: boolean;
  author?: string; // seed/remote posts — own posts use the live profile
  avatarColor?: string;
  kind: "text" | "checkin";
  eventId?: string;
  text?: { th: string; en: string } | string;
  imageUrl?: string;
  badgeIds?: string[];
  points?: number;
  at: number; // epoch ms, for sorting
  baseKudos: number;
};

type FeedContextValue = {
  items: FeedItem[];
  kudosed: Record<string, boolean>;
  addPost: (post: Omit<UserPost, "id" | "at" | "dbId">) => void;
  toggleKudos: (postId: string) => void;
  hydrated: boolean;
};

const FeedContext = createContext<FeedContextValue | null>(null);

const STORAGE_KEY = "ngo-feed";

const seedPosts = seedJson as FeedSeedPost[];

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [kudosed, setKudosed] = useState<Record<string, boolean>>({});
  const [remotePosts, setRemotePosts] = useState<RemotePost[]>([]);
  // kudos counts from OTHER visitors (my own kudos render via `kudosed` +1)
  const [remoteKudos, setRemoteKudos] = useState<Record<string, number>>({});
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

  // Pull the shared community feed + kudos from Supabase once per load.
  useEffect(() => {
    if (!hydrated || !supabase) return;
    const uid = getUid();
    let alive = true;

    supabase
      .from("posts")
      .select("*")
      .order("at", { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (!alive || error || !data) return;
        setRemotePosts(data as RemotePost[]);
      });

    supabase
      .from("kudos")
      .select("uid, post_id")
      .limit(2000)
      .then(({ data, error }) => {
        if (!alive || error || !data) return;
        const counts: Record<string, number> = {};
        const mine: Record<string, boolean> = {};
        for (const row of data as { uid: string; post_id: string }[]) {
          if (row.uid === uid) mine[row.post_id] = true;
          else counts[row.post_id] = (counts[row.post_id] ?? 0) + 1;
        }
        setRemoteKudos(counts);
        setKudosed((prev) => ({ ...mine, ...prev }));
      });

    return () => {
      alive = false;
    };
  }, [hydrated]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ posts: userPosts, kudosed }));
    }
  }, [userPosts, kudosed, hydrated]);

  const value = useMemo<FeedContextValue>(() => {
    const now = Date.now();
    const uid = typeof window !== "undefined" ? getUid() : "";

    const items: FeedItem[] = [
      ...userPosts.map((p) => ({
        id: p.dbId ? `db-${p.dbId}` : p.id,
        own: true,
        demo: false,
        kind: p.kind,
        eventId: p.eventId,
        text: p.text,
        imageUrl: p.imageUrl,
        badgeIds: p.badgeIds,
        points: p.points,
        at: new Date(p.at).getTime(),
        baseKudos: p.dbId ? (remoteKudos[`db-${p.dbId}`] ?? 0) : 0,
      })),
      // Other visitors' posts from the shared DB (skip my own — the local
      // copy above already covers them).
      ...remotePosts
        .filter((r) => r.uid !== uid)
        .map((r) => ({
          id: `db-${r.id}`,
          own: false,
          demo: false,
          author: r.author_name || "Nan Explorer",
          avatarColor: r.author_color || "#fc5200",
          kind: r.kind,
          eventId: r.event_id ?? undefined,
          text: r.text ?? undefined,
          imageUrl: r.image_url ?? undefined,
          badgeIds: Array.isArray(r.badge_ids) ? r.badge_ids : undefined,
          points: r.points ?? undefined,
          at: new Date(r.at).getTime(),
          baseKudos: remoteKudos[`db-${r.id}`] ?? 0,
        })),
      ...seedPosts.map((p) => ({
        id: p.id,
        own: false,
        demo: true as const,
        author: p.author,
        avatarColor: p.avatarColor,
        kind: p.kind,
        eventId: p.eventId,
        text: p.text,
        imageUrl: p.image,
        at: now - p.hoursAgo * 3600_000,
        baseKudos: p.kudos + (remoteKudos[p.id] ?? 0),
      })),
    ].sort((a, b) => b.at - a.at);

    return {
      items,
      kudosed,
      hydrated,
      addPost: (post) => {
        const localId = `me-${Date.now()}`;
        setUserPosts((prev) => [...prev, { ...post, id: localId, at: new Date().toISOString() }]);
        // Mirror to the shared feed; keep the db row id so kudos from other
        // devices attach to the same post.
        if (supabase) {
          const profileRaw = localStorage.getItem("ngo-profile");
          let author_name = "";
          let author_color = "#fc5200";
          try {
            const prof = profileRaw ? JSON.parse(profileRaw) : null;
            if (prof?.name) author_name = prof.name;
            if (prof?.color) author_color = prof.color;
          } catch {
            // ignore
          }
          supabase
            .from("posts")
            .insert({
              uid: getUid(),
              author_name,
              author_color,
              kind: post.kind,
              event_id: post.eventId ?? null,
              text: post.text ?? null,
              // Only real URLs go to the DB; local data URLs stay on-device.
              image_url: post.imageUrl?.startsWith("http") ? post.imageUrl : null,
              badge_ids: post.badgeIds ?? [],
              points: post.points ?? 0,
            })
            .select("id")
            .single()
            .then(({ data, error }) => {
              if (error || !data) {
                if (error) console.warn("post sync failed:", error.message);
                return;
              }
              setUserPosts((prev) =>
                prev.map((p) => (p.id === localId ? { ...p, dbId: data.id } : p))
              );
            });
        }
      },
      toggleKudos: (postId) => {
        const next = !kudosed[postId];
        setKudosed((prev) => ({ ...prev, [postId]: next }));
        if (supabase) {
          if (next) {
            supabase
              .from("kudos")
              .insert({ uid: getUid(), post_id: postId })
              .then(({ error }) => {
                if (error) console.warn("kudos sync failed:", error.message);
              });
          } else {
            supabase
              .from("kudos")
              .delete()
              .eq("uid", getUid())
              .eq("post_id", postId)
              .then(({ error }) => {
                if (error) console.warn("kudos sync failed:", error.message);
              });
          }
        }
      },
    };
  }, [userPosts, kudosed, remotePosts, remoteKudos, hydrated]);

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error("useFeed must be used within FeedProvider");
  return ctx;
}
