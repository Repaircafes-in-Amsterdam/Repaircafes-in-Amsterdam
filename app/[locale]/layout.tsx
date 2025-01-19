import "@/app/globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import TopBar from "../TopBar";
import classes from "@/app/utils/classes";
import { BASE_URL } from "@/app/constants";
import HoverResetter from "@/app/components/HoverResetter";
import { CSPostHogProvider } from "../providers";
import dynamic from "next/dynamic";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: BASE_URL,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#2D2E82",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const PostHogTracker = dynamic(() => import("../components/PostHogTracker"), {
  ssr: false,
});

export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: ReactNode;
  params: { locale: string };
}>) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale); // Enable static rendering
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <CSPostHogProvider>
        <body
          // Prevent FOUC
          style={{ display: "none" }}
          className={classes(
            inter.variable,
            "!flex h-dvh flex-col font-sans text-blue selection:bg-orange selection:text-white",
          )}
        >
          <NextIntlClientProvider messages={messages}>
            <TopBar />
            <main className="flex min-h-px w-full shrink grow justify-center overflow-y-auto">
              {children}
            </main>
            <PostHogTracker locale={locale} />
          </NextIntlClientProvider>
          <HoverResetter />
          <Analytics />
          <SpeedInsights />
        </body>
      </CSPostHogProvider>
    </html>
  );
}
