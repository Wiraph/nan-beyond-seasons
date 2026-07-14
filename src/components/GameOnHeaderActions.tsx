"use client";

import LangSwitcher from "@/components/LangSwitcher";
import LogoutButton from "@/components/LogoutButton";
import RoleAccountMenu from "@/components/RoleAccountMenu";

export default function GameOnHeaderActions({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <RoleAccountMenu dark={dark} />
      <div className="flex items-center gap-1">
        <LangSwitcher dark={dark} />
        <LogoutButton dark={dark} />
      </div>
    </div>
  );
}
