import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "./TopBar";
import classes from "./classes";
import { BASE_URL } from "./constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Repair Cafes in Amsterdam",
  description: "Agenda overzicht van alle Repair Cafés in Amsterdam",
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
        className={classes(inter.className, "flex h-dvh flex-col text-blue")}
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
