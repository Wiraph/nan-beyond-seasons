"use client";

import LangSwitcher from "@/components/LangSwitcher";
import RoleAccountMenu from "@/components/RoleAccountMenu";

export default function GameOnHeaderActions({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <LangSwitcher dark={dark} />
      <RoleAccountMenu dark={dark} />
    </div>
  );
}
