"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";

const items = [
  { href: "/", icon: "ti-home", key: "feed.title" },
  { href: "/calendar", icon: "ti-calendar-bolt", key: "feed.nav.calendar" },
  { href: "/passport", icon: "ti-id-badge-2", key: "sport.passport" },
  { href: "/chat", icon: "ti-message-chatbot", key: "common.askAI" },
  { href: "/explore", icon: "ti-map-2", key: "sport.explore" },
];

export default function SportNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <nav className="sticky bottom-0 z-20 grid grid-cols-5 border-t border-black/10 bg-pitch-800/95 backdrop-blur lg:hidden">
      {items.map((it) => {
        const active =
          it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className="relative flex flex-col items-center gap-0.5 pb-1.5 pt-2 text-[11px] transition"
          >
            {active && (
              <span className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-volt" />
            )}
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full transition duration-200 ${
                active ? "scale-110 bg-volt/15 text-volt" : "text-steel"
              }`}
            >
              <i className={`ti ${it.icon} text-xl`} aria-hidden />
            </span>
            <span className={active ? "font-medium text-frost" : "text-steel"}>
              {t(it.key)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
