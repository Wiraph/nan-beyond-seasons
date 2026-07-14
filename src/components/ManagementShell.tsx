"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LangSwitcher from "@/components/LangSwitcher";
import RoleAccountMenu from "@/components/RoleAccountMenu";

type ManagementRole = "organizer" | "admin";

const navigation: Record<ManagementRole, { href: string; icon: string; label: string }[]> = {
  organizer: [
    { href: "/organizer", icon: "ti-layout-dashboard", label: "Overview / ภาพรวม" },
    { href: "/organizer/events", icon: "ti-calendar-event", label: "My events / งานของฉัน" },
    { href: "/organizer/events/new", icon: "ti-plus", label: "Create event / สร้างงาน" },
    { href: "/organizer/checkins", icon: "ti-qrcode", label: "Event check-ins / เช็กอิน" },
  ],
  admin: [
    { href: "/admin", icon: "ti-layout-dashboard", label: "Overview / ภาพรวม" },
    { href: "/admin/events", icon: "ti-calendar-event", label: "All events / งานทั้งหมด" },
    { href: "/admin/users", icon: "ti-users", label: "Organizers & users / ผู้จัดและผู้ใช้" },
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
  const title = role === "organizer" ? "Organizer workspace / พื้นที่ผู้จัดงาน" : "Administrator workspace / พื้นที่ผู้ดูแล";

  return (
    <div className="min-h-dvh bg-[#f6f8f4] text-pitch">
      <header className="sticky top-0 z-30 border-b border-pitch/10 bg-pitch text-frost shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href={role === "organizer" ? "/organizer" : "/admin"} className="flex min-h-11 items-center gap-3 rounded-md px-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-volt text-pitch">
              <i className="ti ti-trophy text-xl" aria-hidden />
            </span>
            <span>
              <span className="block font-lanna text-xl leading-none">Nan Game On</span>
              <span className="mt-1 block text-[11px] text-steel">{title}</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LangSwitcher dark />
            <RoleAccountMenu dark />
          </div>
        </div>
        <nav className="role-management-nav mx-auto max-w-7xl" aria-label={`${role} workspace navigation`}>
          {navigation[role].map((item) => {
            const active = item.href === `/${role}` ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                <i className={`ti ${item.icon} text-base`} aria-hidden />
                {item.label}
                {item.href.endsWith("/new") && <span className="ml-1 rounded bg-volt/15 px-1.5 py-0.5 text-[10px]">Demo preview</span>}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
    </div>
  );
}
