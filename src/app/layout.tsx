import type { Metadata } from "next";
import { Noto_Sans_Thai, Chonburi } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";
import { DataStoreProvider } from "@/lib/DataStore";
import { PlanStoreProvider } from "@/lib/PlanStore";
import { PostStoreProvider } from "@/lib/PostStore";
import { PassportProvider } from "@/lib/PassportStore";

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
  title: "Nan Game On — น่านเล่นได้ทั้งปี",
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
          <DataStoreProvider>
            <PlanStoreProvider>
              <PostStoreProvider>
                <PassportProvider>{children}</PassportProvider>
              </PostStoreProvider>
            </PlanStoreProvider>
          </DataStoreProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
