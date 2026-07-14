"use client";

import { useRouter } from "next/navigation";
import { BrandName } from "@/components/BrandWordmark";
import LangSwitcher from "@/components/LangSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { ROLE_HOME, type DemoRole } from "@/lib/role-access";
import { useRoleSession } from "@/lib/RoleStore";

const roleChoices: Array<{ role: DemoRole; icon: string }> = [
  { role: "user", icon: "ti-run" },
  { role: "organizer", icon: "ti-calendar-cog" },
  { role: "admin", icon: "ti-shield-check" },
];

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { selectRole } = useRoleSession();

  const chooseRole = (role: DemoRole) => {
    selectRole(role);
    router.replace(ROLE_HOME[role]);
  };

  return (
    <main className="role-picker-page">
      <div className="absolute right-4 top-4">
        <LangSwitcher dark />
      </div>
      <section className="w-full max-w-5xl" aria-labelledby="role-picker-title">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-volt text-pitch">
            <i className="ti ti-bolt text-xl" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight text-frost">
            <BrandName />
          </span>
        </div>
        <h1 id="role-picker-title" className="text-3xl font-bold text-frost sm:text-4xl">
          {t("login.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-steel">
          {t("login.subtitle")}
        </p>

        <div className="role-picker-grid mt-8">
          {roleChoices.map(({ role, icon }) => {
            const name = t(`role.${role}.name`);
            const descriptionId = `${role}-role-description`;

            return (
              <button
                key={role}
                type="button"
                className="role-picker-card"
                aria-describedby={descriptionId}
                onClick={() => chooseRole(role)}
              >
                <i className={`ti ${icon} role-picker-icon`} aria-hidden />
                <span className="text-2xl font-bold text-frost">{name}</span>
                <span id={descriptionId} className="mt-1 text-sm leading-6 text-steel">
                  {t(`role.${role}.desc`)}
                </span>
                <span className="mt-auto text-sm font-semibold text-volt">{t("login.choose")} {name}</span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
