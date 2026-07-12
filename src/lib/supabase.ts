"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client-side Supabase. Both values are browser-safe by design (the anon
// key only grants what RLS policies allow). When env vars are missing —
// e.g. a fresh clone or a Vercel deploy before env setup — everything
// degrades to localStorage-only mode, so the build and the demo never break.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

const UID_KEY = "ngo-uid";

/** Anonymous per-browser identity — no login, judges can use the app
 *  immediately. Stable across sessions via localStorage. */
export function getUid(): string {
  if (typeof window === "undefined") return "00000000-0000-0000-0000-000000000000";
  let uid = localStorage.getItem(UID_KEY);
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem(UID_KEY, uid);
  }
  return uid;
}
