"use client";

import { useRouter } from "next/navigation";
import { ROLE_DISPLAY } from "@/lib/role-access";
import { useRoleSession } from "@/lib/RoleStore";

export default function RoleAccountMenu({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  const { loading, role, logout } = useRoleSession();

  if (loading || !role) return null;

  const display = ROLE_DISPLAY[role];
  const tone = dark
    ? "border-white/25 bg-white/10 text-white"
    : "border-line bg-white text-navy";

  return (
    <div className={`role-account-menu ${tone}`} aria-label="Demo account controls">
      <div className="min-w-0 px-3 py-2">
        <p className="truncate text-xs font-semibold">Demo role · {display.label}</p>
        <p className="truncate text-[11px] opacity-75">{display.title}</p>
      </div>
      <div className="flex border-t border-current/15">
        <button type="button" className="role-account-action" onClick={() => router.push("/login")}>
          Change role
        </button>
        <button
          type="button"
          className="role-account-action border-l border-current/15"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
