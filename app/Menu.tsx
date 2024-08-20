import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import classes from "./utils/classes";

// TODO Auto prefix links with locale
// https://next-intl-docs.vercel.app/docs/routing/navigation
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

// TODO Add language chooser
export default function Menu() {
  return (
    <div className="flex gap-3 font-medium text-white">
      <MenuLink href="/">Agenda</MenuLink>
      <MenuLink href="/map">Kaart</MenuLink>
      <MenuLink href="/repaircafes" className="hidden md:block">
        Over Repair Cafés
      </MenuLink>
      <MenuLink href="/about" className="hidden md:block">
        Over ons
      </MenuLink>
    </div>
  );
}
