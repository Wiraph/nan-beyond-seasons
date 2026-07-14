"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandName, BrandTagline } from "@/components/BrandWordmark";
import GameOnHeaderActions from "@/components/GameOnHeaderActions";
import { useI18n } from "@/i18n/I18nProvider";

type ManagementRole = "organizer" | "admin";

const navigation: Record<ManagementRole, { href: string; icon: string; labelKey: string }[]> = {
  organizer: [
    { href: "/organizer", icon: "ti-layout-dashboard", labelKey: "mgmt.nav.overview" },
    { href: "/organizer/events", icon: "ti-calendar-event", labelKey: "mgmt.nav.myEvents" },
    { href: "/organizer/events/new", icon: "ti-plus", labelKey: "mgmt.nav.createEvent" },
    { href: "/organizer/checkins", icon: "ti-qrcode", labelKey: "mgmt.nav.checkins" },
  ],
  admin: [
    { href: "/admin", icon: "ti-layout-dashboard", labelKey: "mgmt.nav.overview" },
    { href: "/admin/events", icon: "ti-calendar-event", labelKey: "mgmt.nav.allEvents" },
    { href: "/admin/users", icon: "ti-users", labelKey: "mgmt.nav.users" },
  ],
};

export default function ManagementShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: ManagementRole;
}) {
  const pathname = usePathname();
  const { t } = useI18n();
  const home = role === "organizer" ? "/organizer" : "/admin";
  const workspace = role === "organizer" ? t("mgmt.organizer.workspace") : t("mgmt.admin.workspace");

  return (
    <div className="sport-bg flex min-h-dvh flex-col text-frost">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-pitch/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2.5 lg:px-8">
          <Link href={home} className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-volt text-pitch">
              <i className="ti ti-bolt text-xl" aria-hidden />
            </span>
            <span className="hidden min-w-0 flex-col leading-none">
              <span className="truncate text-lg font-bold tracking-tight text-frost">
                เล่น <span className="text-volt">ไร้ฤดู</span>
              </span>
              <span className="mt-0.5 truncate text-[11px] text-steel">{workspace}</span>
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-lg font-bold tracking-tight text-frost"><BrandName /></span>
              <span className="mt-0.5 truncate text-[11px] text-steel"><BrandTagline /></span>
            </span>
          </Link>
          <GameOnHeaderActions dark />
        </div>
        <nav className="role-management-nav mx-auto max-w-7xl" aria-label={workspace}>
          {navigation[role].map((item) => {
            const active = item.href === home ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                <i className={`ti ${item.icon} text-base`} aria-hidden />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">{children}</main>
    </div>
  );
}
