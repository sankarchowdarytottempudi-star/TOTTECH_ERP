import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import {
  defaultLanguage,
  extractLanguageFromUserCookie,
  normalizeLanguage,
} from "@/lib/i18n";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "TOTTECH ONE",
  description:
    "Gateway To Learning - AI Powered Education Operating System",

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TOTTECH ONE",
  },

  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLanguage =
    cookieStore.get("app_language")?.value ||
    extractLanguageFromUserCookie(
      cookieStore.get("erpUser")?.value || null
    ) ||
    defaultLanguage;
  const resolvedLanguage = normalizeLanguage(
    cookieLanguage
  );

  return (
    <html
      lang={resolvedLanguage}
    >
      <body
        className="
          min-h-screen
          bg-slate-100
        "
      >
        <LanguageProvider
          initialLanguage={resolvedLanguage}
        >
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
