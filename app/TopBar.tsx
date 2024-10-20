"use client";
import Logo from "@/app/Logo.svg?react";
import MenuIcon from "@/app/icons/Menu.svg?react";
import { Link } from "@/app/navigation";
import MobileMenu from "./MobileMenu";
import { useState } from "react";
import classes from "./utils/classes";
import Menu from "./Menu";
import LocaleSelect from "./components/LocaleSelect";
import { useTranslations } from "next-intl";

export default function TopBar() {
  const t = useTranslations();
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
        <div className="flex flex-col gap-2.5 md:grow md:flex-row md:justify-between">
          <Link href="/" aria-label="Logo">
            <Logo title={t("logo")} className="pointer-events-none" />
          </Link>
          <div className="flex flex-col justify-between md:items-end">
            <LocaleSelect className="hidden md:block" />
            <Menu />
          </div>
        </div>
        <button
          onClick={() => setMenuIsOpen(!menuIsOpen)}
          className="-m-3 cursor-pointer p-3 text-white md:hidden"
        >
          <MenuIcon title={t("menu")} />
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
