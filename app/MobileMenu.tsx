import { ReactNode } from "react";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import classes from "./utils/classes";
import { Link } from "@/i18n/routing";
import LocaleToggleGroup from "./components/LocaleToggleGroup";
import { useTranslations } from "next-intl";

function MenuItem({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="focus-visible:bg-blue-250 [@media(hover:hover)]:hover:bg-blue-250 flex items-center justify-between gap-3 p-3 pr-2.5 font-medium focus-visible:text-blue-600 focus-visible:outline-hidden focus-visible:-outline-offset-2 [@media(hover:hover)]:hover:text-blue-600"
    >
      {children}
      <ChevronRight aria-hidden />
    </Link>
  );
}

export default function MobileMenu({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const t = useTranslations();
  return (
    <nav
      className={classes(
        "border-blue absolute z-20 w-full border-b-2 bg-white",
        !isOpen && "hidden",
      )}
      onClick={() => onOpenChange(false)}
    >
      <MenuItem href="/">{t("nav.agenda")}</MenuItem>
      <MenuItem href="/map">{t("nav.map")}</MenuItem>
      <MenuItem href="/repaircafes">{t("nav.repaircafes")}</MenuItem>
      <MenuItem href="/about">{t("nav.about")}</MenuItem>
      <div className="flex justify-end p-3">
        <LocaleToggleGroup />
      </div>
    </nav>
  );
}
