"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function BrandName() {
  const { lang } = useI18n();
  return lang === "th" ? <>ฤดู<span className="text-volt">ม่วนน่าน</span></> : <>Ruedu <span className="text-volt">Muan Nan</span></>;
}

export function BrandTagline() {
  const { lang } = useI18n();
  return <>{lang === "th" ? "ม่วนได้ทุกฤดู ที่น่าน" : "Joyful Every Season in Nan"}</>;
}
