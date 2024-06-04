import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TopBar from "./TopBar";
import classes from "./utils/classes";
import { BASE_URL } from "./constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Repair Cafes in Amsterdam",
  description:
    "Agenda en kaart van van alle Repair Cafés in Amsterdam. Zie duidelijk wanneer ze open zijn en waar ze te bezoeken zijn",
  keywords: [
    "repair café",
    "repair cafe",
    "amsterdam",
    "openingstijden",
    "agenda",
    "kalender",
    "calendar",
    "aankomende",
    "eerstvolgende",
    "upcoming",
    "map",
    "repair",
    "overzicht",
    "overview",
  ],
  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#2D2E82",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        // Prevent FOUC
        style={{ display: "none" }}
        className={classes(
          inter.variable,
          "!flex h-dvh flex-col font-sans text-blue selection:bg-orange selection:text-white",
        )}
      >
        <TopBar />
        <main className="flex min-h-px shrink grow flex-col items-center overflow-y-auto">
          {children}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
