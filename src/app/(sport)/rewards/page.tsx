"use client";

import { useEffect, useState } from "react";
import LangSwitcher from "@/components/LangSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { loc } from "@/lib/types";
import { districtLoc } from "@/lib/types";
import { usePassport } from "@/lib/PassportStore";
import rewardsJson from "@/data/rewards.json";

type Reward = {
  id: string;
  icon: string;
  cost: number;
  partner: { th: string; en: string };
  district: string;
  reward: { th: string; en: string };
};

const rewards = rewardsJson as Reward[];
const REDEEMED_KEY = "ngo-redeemed";

/** Deterministic short code from a reward id — feels like a real coupon
 *  without any backend (prototype). */
function rewardCode(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return `NGO-${h.toString(36).toUpperCase().slice(0, 5).padStart(5, "0")}`;
}

export default function RewardsPage() {
  const { t, lang } = useI18n();
  const { points, spend, hydrated } = usePassport();
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const [codeFor, setCodeFor] = useState<Reward | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REDEEMED_KEY);
      if (raw) setRedeemed(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const redeem = (r: Reward) => {
    // Already redeemed → just show the code again (points already deducted).
    if (redeemed.includes(r.id)) {
      setCodeFor(r);
      return;
    }
    // Deduct real points; bail if the balance is short.
    if (!spend(r.cost)) return;
    setCodeFor(r);
    const next = [...redeemed, r.id];
    setRedeemed(next);
    localStorage.setItem(REDEEMED_KEY, JSON.stringify(next));
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/10 bg-pitch/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <h1 className="flex items-center gap-2 text-lg font-bold text-frost">
            <i className="ti ti-gift text-volt" aria-hidden /> {t("rewards.title")}
          </h1>
          <LangSwitcher dark />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-10 pt-5 lg:px-8">
        {/* Points banner */}
        <section className="sport-card flex items-center justify-between rounded-md p-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-steel">
              {t("rewards.yourPoints")}
            </div>
            <div className="sport-num text-3xl text-volt" suppressHydrationWarning>
              {hydrated ? points : "—"}{" "}
              <span className="text-base font-normal text-steel">{t("sport.points")}</span>
            </div>
          </div>
          <i className="ti ti-coins text-4xl text-volt/40" aria-hidden />
        </section>

        <p className="mt-3 text-sm text-steel">{t("rewards.sub")}</p>

        {/* Reward list */}
        <div className="stagger mt-4 flex flex-col gap-2.5">
          {rewards.map((r) => {
            const affordable = hydrated && points >= r.cost;
            const isRedeemed = redeemed.includes(r.id);
            return (
              <div key={r.id} className="sport-card flex items-center gap-3 rounded-md p-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${
                    affordable ? "bg-volt/12 text-volt" : "bg-black/5 text-steel"
                  }`}
                >
                  <i className={`ti ${r.icon} text-2xl`} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-frost">{loc(r.reward, lang)}</div>
                  <div className="truncate text-[11px] text-steel">
                    {loc(r.partner, lang)} · {districtLoc(r.district, lang)}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-volt">
                    <i className="ti ti-coin text-xs" aria-hidden /> {r.cost} {t("rewards.cost")}
                  </div>
                </div>
                <button
                  onClick={() => redeem(r)}
                  disabled={!affordable}
                  className={`shrink-0 rounded px-3.5 py-2 text-xs font-bold transition ${
                    affordable
                      ? "bg-volt text-white hover:bg-volt-600"
                      : "cursor-not-allowed bg-black/5 text-steel"
                  }`}
                >
                  {isRedeemed
                    ? t("rewards.redeemed")
                    : affordable
                      ? t("rewards.redeem")
                      : `${t("rewards.need")} ${r.cost - (hydrated ? points : 0)}`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-4 flex items-start gap-1.5 rounded-md bg-black/5 p-3 text-[11px] text-steel">
          <i className="ti ti-info-circle mt-0.5 shrink-0" aria-hidden /> {t("rewards.demoNote")}
        </p>
      </main>

      {/* Reward code modal */}
      {codeFor && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          onClick={() => setCodeFor(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-sm rounded-t-md bg-pitch-800 p-6 text-center shadow-xl sm:rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="ti ti-ticket text-4xl text-volt" aria-hidden />
            <div className="mt-2 text-sm font-bold text-frost">{loc(codeFor.reward, lang)}</div>
            <div className="text-[11px] text-steel">{loc(codeFor.partner, lang)}</div>
            <div className="mt-3 text-[11px] uppercase tracking-widest text-steel">
              {t("rewards.codeTitle")}
            </div>
            <div className="sport-num mt-1 select-all rounded-md border border-dashed border-volt/50 bg-volt/5 py-3 text-2xl tracking-widest text-volt">
              {rewardCode(codeFor.id)}
            </div>
            <p className="mt-2 text-[11px] text-steel">{t("rewards.codeHint")}</p>
            <button
              onClick={() => setCodeFor(null)}
              className="mt-4 w-full rounded bg-volt py-2.5 text-sm font-bold text-white transition hover:bg-volt-600"
            >
              {t("rewards.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
