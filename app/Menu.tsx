import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import classes from "./utils/classes";

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
  return (
    <div className="flex gap-3 font-medium text-white">
      <MenuLink href="/" className="md:hidden">
        Aankomende
      </MenuLink>
      <MenuLink href="/map" className="md:hidden">
        Kaart
      </MenuLink>
      <MenuLink href="/" className="hidden md:block">
        Overzicht
      </MenuLink>
      <MenuLink href="/repaircafes" className="hidden md:block">
        Over Repair Cafés
      </MenuLink>
      <MenuLink href="/about" className="hidden md:block">
        Over ons
      </MenuLink>
    </div>
  );
}
