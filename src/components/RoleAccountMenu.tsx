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
    <div className={`role-account-menu flex items-center ${tone}`} aria-label="Demo account controls">
      <p className="min-w-0 truncate px-3 text-xs font-semibold">Demo role · {display.label}</p>
      <button
        type="button"
        className="role-account-action whitespace-nowrap border-l border-current/15"
        onClick={() => router.push("/login")}
      >
        Change role
      </button>
      <button
        type="button"
        className="role-account-action whitespace-nowrap border-l border-current/15"
        onClick={() => {
          logout();
          router.replace("/login");
        }}
      >
        Log out
      </button>
    </div>
  );
}
