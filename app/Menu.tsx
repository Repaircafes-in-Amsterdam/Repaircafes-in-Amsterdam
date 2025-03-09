import { ReactNode } from "react";
import classes from "./utils/classes";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

function MenuLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <Link
      key={href}
      href={href}
      className={classes(
        className,
        pathname === href ? "text-orange-450" : "text-white",
      )}
    >
      {children}
    </Link>
  );
}

export default function Menu() {
  const t = useTranslations();
  return (
    <div className="flex gap-3 font-medium text-white">
      <MenuLink href="/">{t("nav.agenda")}</MenuLink>
      <MenuLink href="/map">{t("nav.map")}</MenuLink>
      <MenuLink href="/repaircafes" className="hidden md:block">
        {t("nav.repaircafes")}
      </MenuLink>
      <MenuLink href="/about" className="hidden md:block">
        {t("nav.about")}
      </MenuLink>
    </div>
  );
}
