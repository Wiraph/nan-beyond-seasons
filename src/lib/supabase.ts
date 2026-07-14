"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client-side Supabase. Both values are browser-safe by design (the anon
// key only grants what RLS policies allow). When env vars are missing -
// e.g. a fresh clone or a Vercel deploy before env setup - everything
// degrades to localStorage-only mode, so the build and the demo never break.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

const UID_KEY = "ngo-uid";

/** crypto.randomUUID only exists in secure contexts (https / localhost);
 *  opening the dev server via a LAN IP (http://192.168.x.x) loses it, so
 *  fall back to a hand-rolled v4 uuid. */
function uuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const h = [...bytes].map((b) => b.toString(16).padStart(2, "0"));
  return `${h.slice(0, 4).join("")}-${h.slice(4, 6).join("")}-${h.slice(6, 8).join("")}-${h.slice(8, 10).join("")}-${h.slice(10).join("")}`;
}

/** Per-browser data identity for the demo role selected at /login.
 *  Stable across sessions via localStorage; it is not authentication. */
export function getUid(): string {
  if (typeof window === "undefined") return "00000000-0000-0000-0000-000000000000";
  let uid = localStorage.getItem(UID_KEY);
  if (!uid) {
    uid = uuidV4();
    localStorage.setItem(UID_KEY, uid);
  }
  return uid;
}
