"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import { useRoleSession } from "@/lib/RoleStore";

export default function RoleAccountMenu({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  const { t } = useI18n();
  const { loading, role } = useRoleSession();

  if (loading || !role) return null;

  const tone = dark ? "border-white/25 bg-white/10 text-white" : "border-line bg-white text-navy";

  return (
    <div className={`role-account-menu flex items-center ${tone}`} aria-label="Account controls">
      <p className="min-w-0 truncate px-3 text-xs font-semibold">
        <span className="hidden sm:inline">{t("role.demoRole")} · </span>
        {t(`role.${role}.name`)}
      </p>
      <button
        type="button"
        className="role-account-action gap-1.5 whitespace-nowrap border-l border-current/15"
        title={t("role.changeRole")}
        aria-label={t("role.changeRole")}
        onClick={() => router.push("/login")}
      >
        <i className="ti ti-switch-horizontal text-sm" aria-hidden />
        <span className="hidden sm:inline">{t("role.changeRole")}</span>
      </button>
    </div>
  );
}
