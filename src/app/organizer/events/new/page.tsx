"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

type Season = "green" | "cool" | "hot";

type DraftEvent = {
  id: number;
  title: string;
  sportType: string;
  season: Season;
  startDate: string;
  endDate: string;
  location: string;
  district: string;
  description: string;
  image: string | null;
};

const SEASON_FLAG: Record<Season, string> = {
  green: "season-flag-green",
  cool: "season-flag-cool",
  hot: "season-flag-hot",
};

export default function OrganizerNewEventPage() {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [sportType, setSportType] = useState("");
  const [season, setSeason] = useState<Season>("green");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [district, setDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState<DraftEvent[]>([]);

  const onPickImage = (file: File | undefined) => {
    if (!file) return;
    setImageName(file.name);
    setImage(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setTitle("");
    setSportType("");
    setSeason("green");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setDistrict("");
    setDescription("");
    setImage(null);
    setImageName("");
  };

  const submit = () => {
    if (!title.trim()) {
      setError(t("org.new.titleRequired"));
      return;
    }
    setError("");
    setCreated((prev) => [
      {
        id: Date.now(),
        title: title.trim(),
        sportType: sportType.trim(),
        season,
        startDate,
        endDate,
        location: location.trim(),
        district: district.trim(),
        description: description.trim(),
        image,
      },
      ...prev,
    ]);
    resetForm();
  };

  const dateRange = (ev: DraftEvent) =>
    [ev.startDate, ev.endDate].filter(Boolean).join(" – ");

  const inputClass =
    "mt-2 min-h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm font-normal outline-none focus:border-volt";

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("org.new.title")}</h1>
        <p className="mt-1 text-sm text-steel">{t("org.new.intro")}</p>
      </div>

      <section className="sport-card rounded-md p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold sm:col-span-2">
            {t("org.new.eventTitle")}
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("org.new.eventTitle")} className={inputClass} />
          </label>
          <label className="block text-sm font-semibold">
            {t("org.new.sportType")} <span className="font-normal text-steel">({t("org.new.optional")})</span>
            <input value={sportType} onChange={(e) => setSportType(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm font-semibold">
            {t("org.new.season")}
            <select value={season} onChange={(e) => setSeason(e.target.value as Season)} className={inputClass}>
              <option value="green">{t("season.green.short")}</option>
              <option value="cool">{t("season.cool.short")}</option>
              <option value="hot">{t("season.hot.short")}</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            {t("org.new.startDate")}
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm font-semibold">
            {t("org.new.endDate")} <span className="font-normal text-steel">({t("org.new.optional")})</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm font-semibold">
            {t("org.new.location")}
            <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm font-semibold">
            {t("org.new.district")}
            <input value={district} onChange={(e) => setDistrict(e.target.value)} className={inputClass} />
          </label>
          <label className="block text-sm font-semibold sm:col-span-2">
            {t("org.new.description")}
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-normal leading-6 outline-none focus:border-volt" />
          </label>
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold">{t("org.new.image")} <span className="font-normal text-steel">({t("org.new.optional")})</span></p>
          <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-black/15 px-3 text-sm hover:border-volt">
            <span className="truncate">{imageName || t("org.new.chooseFilePrompt")}</span>
            <span className="shrink-0 rounded bg-black/5 px-2 py-1 text-xs font-bold">{t("org.new.chooseFile")}</span>
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => onPickImage(e.target.files?.[0])} />
          </label>
          {image && <img src={image} alt="" className="mt-3 max-h-48 rounded-md border border-black/10 object-cover" />}
        </div>

        <button type="button" onClick={submit} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-volt px-4 text-sm font-bold text-pitch hover:bg-volt-600">
          <i className="ti ti-plus" aria-hidden /> {t("org.new.save")}
        </button>
        {error && <p className="mt-3 text-sm font-medium text-[#e5484d]" aria-live="polite">{error}</p>}
      </section>

      {created.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">{t("org.new.createdHeading")}</h2>
          {created.map((ev) => (
            <article key={ev.id} className={`sport-card rounded-md p-4 ${SEASON_FLAG[ev.season]}`}>
              <div className="flex items-start gap-3">
                {ev.image ? (
                  <img src={ev.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-volt/10 text-volt"><i className="ti ti-calendar-event text-2xl" aria-hidden /></span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold">{ev.title}</h3>
                    <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-semibold text-steel">{t(`season.${ev.season}.short`)}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-volt/15 px-2 py-0.5 text-[11px] font-semibold text-volt"><i className="ti ti-check text-xs" aria-hidden /> {t("org.new.added")}</span>
                  </div>
                  {(dateRange(ev) || ev.location || ev.district) && (
                    <p className="mt-1 text-xs text-steel">
                      {[dateRange(ev), [ev.location, ev.district].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {ev.sportType && <p className="mt-1 text-xs text-steel">{ev.sportType}</p>}
                  {ev.description && <p className="mt-2 text-sm leading-6 text-frost">{ev.description}</p>}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
