import Link from "next/link";
import { ReactNode } from "react";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";

function MenuItem({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 p-3 pr-2.5 font-medium focus-visible:-outline-offset-2"
      popoverTargetAction="hide"
    >
      {children}
      <ChevronRight />
    </Link>
  );
}
export default function MobileMenu() {
  return (
    <nav
      popover="auto"
      id="mobile-menu"
      className="absolute top-[128px] m-0 w-full border-b-2 border-blue bg-white"
    >
      <MenuItem href="/">Agenda</MenuItem>
      <MenuItem href="/map">Kaart</MenuItem>
      <MenuItem href="/repaircafes">Over Repair Cafés</MenuItem>
      <MenuItem href="/about">Over ons</MenuItem>
    </nav>
  );
}
