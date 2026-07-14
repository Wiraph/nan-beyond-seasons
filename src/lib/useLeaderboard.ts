"use client";

import { useEffect, useState } from "react";
import { getUid, supabase } from "./supabase";
import { POINTS_PER_CHECKIN } from "./PassportStore";

export type LeaderRow = { name: string; color: string; points: number };

/** Real visitors' scores from the shared DB (excluding this browser —
 *  the caller adds itself with live local points). Empty without Supabase. */
export function useLeaderboard(): LeaderRow[] {
  const [rows, setRows] = useState<LeaderRow[]>([]);

  useEffect(() => {
    if (!supabase) return;
    const uid = getUid();
    let alive = true;

    (async () => {
      const [checkinsRes, profilesRes] = await Promise.all([
        supabase!.from("checkins").select("uid").limit(2000),
        supabase!.from("profiles").select("uid, name, color").limit(500),
      ]);
      if (!alive || checkinsRes.error || !checkinsRes.data) return;

      const counts: Record<string, number> = {};
      for (const row of checkinsRes.data as { uid: string }[]) {
        if (row.uid === uid) continue;
        counts[row.uid] = (counts[row.uid] ?? 0) + 1;
      }
      const profiles = new Map(
        ((profilesRes.data ?? []) as { uid: string; name: string; color: string }[]).map((p) => [
          p.uid,
          p,
        ])
      );
      setRows(
        Object.entries(counts).map(([u, n]) => ({
          name: profiles.get(u)?.name || "Game On athlete",
          color: profiles.get(u)?.color || "#fc5200",
          points: n * POINTS_PER_CHECKIN,
        }))
      );
    })();

    return () => {
      alive = false;
    };
  }, []);

  return rows;
}
