"use client";

import Link from "next/link";
import { BrandName, BrandTagline } from "@/components/BrandWordmark";
import { useI18n } from "@/i18n/I18nProvider";

const organizationName =
  "สำนักงานพื้นที่พิเศษ 6 (อพท.) สำนักงานพื้นที่พิเศษเพื่อการท่องเที่ยวอย่างยั่งยืนเมืองเก่าน่าน (อพท. น่าน)";

export default function PublicFooter() {
  const { t } = useI18n();
  const surface = "border-black/10 bg-pitch-800 text-frost";
  const muted = "text-steel";
  const linkStyle = "border-white/10 text-frost hover:border-volt hover:text-volt";

  const shortcuts = [
    { href: "/", icon: "ti-home", label: t("footer.home") },
    { href: "/calendar", icon: "ti-calendar-event", label: t("footer.calendar") },
    { href: "/passport", icon: "ti-id-badge-2", label: t("footer.passport") },
    { href: "/rewards", icon: "ti-gift", label: t("footer.rewards") },
    { href: "/chat", icon: "ti-message-chatbot", label: t("footer.ai") },
  ];

  return (
    <footer className={`border-t ${surface}`}>
      <div className="mx-auto grid w-full max-w-7xl gap-7 px-4 py-8 lg:grid-cols-[1.1fr_1fr_1.15fr] lg:px-8">
        <section aria-label="Brand">
          <p className="text-lg font-bold text-volt"><BrandName /></p>
          <p className={`mt-1 text-sm ${muted}`}><BrandTagline /></p>
          <p className={`mt-2 max-w-sm text-sm leading-relaxed ${muted}`}>{t("footer.description")}</p>
          <div className="mt-4">
            <p className="text-sm font-semibold">{t("footer.links")}</p>
            <nav className="mt-2 flex flex-wrap gap-2" aria-label={t("footer.links")}>
              {shortcuts.map((shortcut) => (
                <Link
                  key={shortcut.href}
                  href={shortcut.href}
                  className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition ${linkStyle}`}
                >
                  <i className={`ti ${shortcut.icon} text-base`} aria-hidden />
                  {shortcut.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section aria-labelledby="tourist-assistance-title">
          <h2 id="tourist-assistance-title" className="text-sm font-semibold">
            {t("footer.assistance")}
          </h2>
          <dl className={`mt-3 space-y-3 text-sm ${muted}`}>
            <div>
              <dt className="font-medium">{t("footer.phone")}</dt>
              <dd>
                <a
                  href="tel:+6654716000"
                  className="inline-flex min-h-11 items-center font-semibold text-gold underline-offset-4 hover:underline"
                >
                  0-5471-6000
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-medium">{t("footer.fax")}</dt>
              <dd className="mt-1">0-5471-6365</dd>
            </div>
            <div>
              <dt className="font-medium">{t("footer.organization")}</dt>
              <dd lang="th" className="mt-1 leading-relaxed">
                {organizationName}
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="activity-safety-title">
          <h2 id="activity-safety-title" className="text-sm font-semibold">
            {t("footer.safetyTitle")}
          </h2>
          <p className={`mt-3 max-w-md text-sm leading-relaxed ${muted}`}>{t("footer.safetyNote")}</p>
        </section>
      </div>
    </footer>
  );
}
