"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import { PUBLIC_NAVIGATION_HISTORY_KEY, shouldUseBrowserHistory } from "@/lib/public-navigation";

type PublicBackButtonProps = {
  fallbackHref: string;
};

export default function PublicBackButton({ fallbackHref }: PublicBackButtonProps) {
  const router = useRouter();
  const { t } = useI18n();

  const goBack = () => {
    const hasInAppHistory = window.sessionStorage.getItem(PUBLIC_NAVIGATION_HISTORY_KEY) === "true";

    if (shouldUseBrowserHistory(window.history.length, hasInAppHistory)) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  const theme = "border-white/10 bg-white/5 text-frost hover:bg-white/10 hover:text-volt";

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={t("common.back")}
      className={`inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${theme}`}
    >
      <i className="ti ti-arrow-left text-lg" aria-hidden />
      <span>{t("common.back")}</span>
    </button>
  );
}
