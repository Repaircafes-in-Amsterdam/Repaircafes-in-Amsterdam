"use client";
import Logo from "@/app/Logo.svg?react";
import MenuIcon from "@/app/icons/Menu.svg?react";
import Link from "next/link";
import Menu from "./Menu";
import { useRef, useState } from "react";
import classes from "./classes";

export default function TopBar() {
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
        <Link href="/">
          <Logo />
        </Link>
        <button
          onClick={() => setMenuIsOpen(!menuIsOpen)}
          className="cursor-pointer text-white"
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
