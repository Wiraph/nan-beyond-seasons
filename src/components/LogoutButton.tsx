"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import { useRoleSession } from "@/lib/RoleStore";

export default function LogoutButton({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  const { lang, t } = useI18n();
  const { logout } = useRoleSession();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isThai = lang === "th";

  useEffect(() => {
    if (!showLogoutConfirm) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setShowLogoutConfirm(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showLogoutConfirm]);

  const confirmLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      <button
        type="button"
        className={`flex min-h-11 w-11 items-center justify-center rounded-full transition ${dark ? "bg-white/10 text-volt hover:bg-white/20" : "bg-white text-volt hover:bg-cream"}`}
        title={t("role.logout")}
        aria-label={t("role.logout")}
        onClick={() => setShowLogoutConfirm(true)}
      >
        <i className="ti ti-logout text-lg" aria-hidden />
      </button>

      {showLogoutConfirm && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onMouseDown={() => setShowLogoutConfirm(false)}>
          <div className="absolute inset-0 bg-frost/45 backdrop-blur-sm" aria-hidden />
          <section role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title" className="anim-pop relative w-full max-w-sm rounded-xl bg-white p-6 text-frost shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-volt"><i className="ti ti-logout text-xl" aria-hidden /></div>
            <h2 id="logout-confirm-title" className="text-lg font-bold">{isThai ? "ออกจากระบบ?" : "Log out?"}</h2>
            <p className="mt-2 text-sm text-steel">{isThai ? "คุณต้องการจบเซสชันปัจจุบันใช่ไหม" : "Do you want to end your current session?"}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="min-h-11 rounded-lg px-4 text-sm font-semibold text-steel hover:bg-pitch-700" onClick={() => setShowLogoutConfirm(false)}>{isThai ? "ยกเลิก" : "Cancel"}</button>
              <button type="button" className="min-h-11 rounded-lg bg-volt px-4 text-sm font-bold text-white hover:bg-volt-600" onClick={confirmLogout}>{t("role.logout")}</button>
            </div>
          </section>
        </div>,
        document.body
      )}
    </>
  );
}
