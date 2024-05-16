"use client";
import Logo from "@/app/Logo.svg?react";
import MenuIcon from "@/app/icons/Menu.svg?react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Menu from "./Menu";
import { useState } from "react";
import classes from "./classes";

const links = [
  { href: "/", label: "Aankomende" },
  { href: "/map", label: "Kaart" },
];

export default function TopBar() {
  const pathname = usePathname();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  return (
    <>
      <header className="relative flex items-center justify-between bg-blue p-3">
        {/* Hidden overlay to dismiss menu */}
        <div
          className={classes(
            "absolute left-0 top-0 z-10 h-screen w-screen",
            !menuIsOpen && "hidden",
          )}
          onClick={() => setMenuIsOpen(false)}
        ></div>
        <div className="flex flex-col gap-2.5">
          <Link href="/" aria-label="Logo">
            <Logo />
          </Link>
          <div className="flex gap-3 font-medium text-white">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={pathname === href ? "text-orange-450" : "text-white"}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={() => setMenuIsOpen(!menuIsOpen)}
          className="cursor-pointer text-white"
          aria-label="Menu"
        >
          <MenuIcon />
        </button>
      </header>
      <div className="relative">
        <Menu
          isOpen={menuIsOpen}
          onOpenChange={(isOpen) => setMenuIsOpen(isOpen)}
        />
      </div>
    </>
  );
}
