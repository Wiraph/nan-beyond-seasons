import type { Metadata } from "next";
import { Noto_Sans_Thai, Chonburi } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";
import { PassportProvider } from "@/lib/PassportStore";
import { ProfileProvider } from "@/lib/ProfileStore";
import { FeedProvider } from "@/lib/FeedStore";
import { RoleProvider } from "@/lib/RoleStore";

const notoThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

// Lanna-flavoured display face — used only for the wordmark and big headings.
const chonburi = Chonburi({
  variable: "--font-lanna-src",
  subsets: ["thai", "latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "ฤดูม่วนน่าน — ม่วนได้ทุกฤดู ที่น่าน",
  description:
    "ปฏิทินเทศกาลกีฬาจังหวัดน่านทุกฤดู พร้อม AI จัดทริปรอบงานแข่งตามสภาพอากาศจริง และพาสปอร์ตเช็คอินสะสมแบดจ์",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${notoThai.variable} ${chonburi.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css"
        />
      </head>
      <body className="min-h-dvh antialiased">
        <I18nProvider>
          <RoleProvider>
            <PassportProvider>
              <ProfileProvider>
                <FeedProvider>{children}</FeedProvider>
              </ProfileProvider>
            </PassportProvider>
          </RoleProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
