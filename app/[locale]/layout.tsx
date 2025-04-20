import "@/app/globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import TopBar from "../TopBar";
import classes from "@/app/utils/classes";
import { BASE_URL } from "@/app/constants";
import HoverResetter from "@/app/components/HoverResetter";
import { CSPostHogProvider } from "../providers";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import SuspendedPostHogTracker from "../components/PostHogTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: { canonical: BASE_URL },
  };
}

export const viewport: Viewport = { themeColor: "#2D2E82" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(
  props: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>,
) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale); // Enable static rendering

  return (
    <html lang={locale}>
      <CSPostHogProvider>
        <NextIntlClientProvider>
          <body
            // Prevent FOUC
            style={{ display: "none" }}
            className={classes(
              inter.variable,
              "text-blue selection:bg-orange flex! h-dvh flex-col font-sans selection:text-white",
            )}
          >
            <SuspendedPostHogTracker locale={locale} />
            <TopBar />
            <main className="flex min-h-px w-full shrink grow justify-center overflow-y-auto">
              {children}
            </main>
            <HoverResetter />
          </body>
        </NextIntlClientProvider>
      </CSPostHogProvider>
    </html>
  );
}
