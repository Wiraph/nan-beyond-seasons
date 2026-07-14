"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  PUBLIC_NAVIGATION_HISTORY_KEY,
  PUBLIC_NAVIGATION_PATH_KEY,
} from "@/lib/public-navigation";

export default function PublicNavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const previousPath = window.sessionStorage.getItem(PUBLIC_NAVIGATION_PATH_KEY);

    if (previousPath && previousPath !== pathname) {
      window.sessionStorage.setItem(PUBLIC_NAVIGATION_HISTORY_KEY, "true");
    }

    window.sessionStorage.setItem(PUBLIC_NAVIGATION_PATH_KEY, pathname);
  }, [pathname]);

  return null;
}
