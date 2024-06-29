import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TopBar from "./TopBar";
import classes from "./utils/classes";
import { BASE_URL } from "./constants";
import HoverResetter from "./components/HoverResetter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Repair Cafes in Amsterdam",
  description:
    "Agenda en kaart van van alle Repair Cafés in Amsterdam. Zie duidelijk wanneer ze open zijn en waar ze te bezoeken zijn",
  keywords: [
    "repaircafe",
    "repaircafes",
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
    "locaties",
    "locations",
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
        <main className="flex min-h-px w-full shrink grow justify-center overflow-y-auto md:overflow-y-visible">
          {children}
        </main>
        <HoverResetter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
