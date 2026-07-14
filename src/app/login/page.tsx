"use client";

import { useRouter } from "next/navigation";
import { ROLE_DISPLAY, ROLE_HOME, type DemoRole } from "@/lib/role-access";
import { useRoleSession } from "@/lib/RoleStore";

const roleChoices: Array<{ role: DemoRole; icon: string; summary: string }> = [
  {
    role: "user",
    icon: "ti-run",
    summary: "Follow events, collect passport stamps, and earn rewards.",
  },
  {
    role: "organizer",
    icon: "ti-calendar-cog",
    summary: "Manage your events and event check-ins.",
  },
  {
    role: "admin",
    icon: "ti-shield-check",
    summary: "Review events, organizers, and users.",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { selectRole } = useRoleSession();

  const chooseRole = (role: DemoRole) => {
    selectRole(role);
    router.replace(ROLE_HOME[role]);
  };

  return (
    <main className="role-picker-page">
      <section className="w-full max-w-5xl" aria-labelledby="role-picker-title">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-volt">
          Nan Game On demo
        </p>
        <h1 id="role-picker-title" className="font-lanna text-4xl text-frost sm:text-5xl">
          Select a demo role
        </h1>
        <p className="mt-3 max-w-2xl text-base text-steel">
          เลือกบทบาทเพื่อทดลองใช้งาน ไม่มีการใช้ชื่อ อีเมล หรือรหัสผ่าน
        </p>

        <div className="role-picker-grid mt-8">
          {roleChoices.map(({ role, icon, summary }) => {
            const display = ROLE_DISPLAY[role];
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
                <span className="text-sm font-semibold text-volt">{display.label}</span>
                <span className="font-lanna text-3xl text-frost">{display.title}</span>
                <span id={descriptionId} className="text-sm leading-6 text-steel">
                  {summary}
                </span>
                <span className="mt-auto text-sm font-semibold text-volt">Choose {display.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
