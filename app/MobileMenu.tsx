import { ReactNode } from "react";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import classes from "./utils/classes";
import { Link } from "@/app/navigation";

function MenuItem({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 p-3 pr-2.5 font-medium focus-visible:-outline-offset-2"
    >
      {children}
      <ChevronRight />
    </Link>
  );
}

// TODO Add language chooser
export default function MobileMenu({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <nav
      className={classes(
        "absolute z-20 w-full border-b-2 border-blue bg-white",
        !isOpen && "hidden",
      )}
      onClick={() => onOpenChange(false)}
    >
      <MenuItem href="/">Agenda</MenuItem>
      <MenuItem href="/map">Kaart</MenuItem>
      <MenuItem href="/repaircafes">Over Repair Cafés</MenuItem>
      <MenuItem href="/about">Over ons</MenuItem>
    </nav>
  );
}
