"use client";

import { useEffect, useState } from "react";
import type { DailyForecast, MonthProfile, SeasonKey } from "./weather";

export type WeatherPayload = {
  days: DailyForecast[];
  month: MonthProfile;
  season: {
    key: SeasonKey;
    name: { th: string; en: string };
    months: number[];
    pitch: { th: string; en: string };
  };
};

/** Client-side Nan forecast + month/season profile from /api/weather.
 *  `data` stays null until loaded; callers should render nothing meanwhile. */
export function useNanWeather(): WeatherPayload | null {
  const [data, setData] = useState<WeatherPayload | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/weather")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.month) setData(d as WeatherPayload);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return data;
}
