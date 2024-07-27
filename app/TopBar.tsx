"use client";
import Logo from "@/app/Logo.svg?react";
import MenuIcon from "@/app/icons/Menu.svg?react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Menu from "./Menu";

export default function TopBar() {
  return (
    <>
      <header className="relative flex items-center justify-between gap-2.5 bg-blue p-3">
        <div className="flex flex-col gap-2.5 md:grow md:flex-row md:items-end md:justify-between">
          <Link href="/" aria-label="Logo">
            <Logo />
          </Link>
          <Menu />
        </div>
        <button
          popoverTarget="mobile-menu"
          className="cursor-pointer text-white md:hidden"
          aria-label="Menu"
        >
          <MenuIcon />
        </button>
      </header>
      <MobileMenu />
    </>
  );
}
