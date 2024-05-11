import Link from "next/link";
import { ReactNode } from "react";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import classes from "./classes";

function MenuItem({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 p-3 pr-2.5 font-medium"
    >
      {children}
      <ChevronRight />
    </Link>
  );
}

import React, { forwardRef } from "react";
const Menu = forwardRef<
  HTMLElement,
  { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }
>(({ isOpen, onOpenChange }, ref) => (
  <nav
    ref={ref}
    className={classes(
      "absolute z-20 w-full border-b-2 border-blue bg-white",
      !isOpen && "hidden",
    )}
    onClick={() => onOpenChange(false)}
  >
    <MenuItem href="/">Aankomende</MenuItem>
    <MenuItem href="/map">Kaart</MenuItem>
    <MenuItem href="/repaircafes">Over Repair Cafés</MenuItem>
    <MenuItem href="/about">Over ons</MenuItem>
  </nav>
));

Menu.displayName = "Menu";
export default Menu;
