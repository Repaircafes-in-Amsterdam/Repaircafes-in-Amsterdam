import type { Metadata } from "next";
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
      <body className={classes(inter.className, "h-screen flex flex-col")}>
        <Header />
        {children}
      </body>
    </html>
  );
}
