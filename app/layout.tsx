import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Header";
import classes from "./classes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Repair Cafes in Amsterdam",
  description:
    "Overzicht van alle Repair Cafés in Amsterdam met hun openingstijden",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={classes(inter.className, "flex h-screen flex-col")}>
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
