"use client";
import Logo from "@/app/Logo.svg?react";
import MenuIcon from "@/app/icons/Menu.svg?react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import { useState } from "react";
import classes from "./classes";

const links = [
  { href: "/", label: "Aankomende" },
  { href: "/map", label: "Kaart" },
  {
    href: "/repaircafes",
    label: "Over Repair Cafés",
    className: "hidden md:block",
  },
  { href: "/about", label: "Over ons", className: "hidden md:block" },
];

export default function TopBar() {
  const pathname = usePathname();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  return (
    <>
      <header className="relative flex items-center justify-between gap-2.5 bg-blue p-3">
        {/* Hidden overlay to dismiss menu */}
        <div
          className={classes(
            "absolute left-0 top-0 z-10 h-screen w-screen",
            !menuIsOpen && "hidden",
          )}
          onClick={() => setMenuIsOpen(false)}
        ></div>
        <div className="flex flex-col gap-2.5 md:grow md:flex-row md:items-end md:justify-between">
          <Link href="/" aria-label="Logo">
            <Logo />
          </Link>
          <div className="flex gap-3 font-medium text-white">
            {links.map(({ href, label, className }) => (
              <Link
                key={href}
                href={href}
                className={classes(
                  className,
                  pathname === href ? "text-orange-450" : "text-white",
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={() => setMenuIsOpen(!menuIsOpen)}
          className="cursor-pointer text-white md:hidden"
          aria-label="Menu"
        >
          <MenuIcon />
        </button>
      </header>
      <div className="relative">
        <MobileMenu
          isOpen={menuIsOpen}
          onOpenChange={(isOpen) => setMenuIsOpen(isOpen)}
        />
      </div>
    </>
  );
}
