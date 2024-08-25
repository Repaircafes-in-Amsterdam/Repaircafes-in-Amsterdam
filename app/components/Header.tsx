import { ReactNode } from "react";
import classes from "@/app/utils/classes";

export default function Header({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h3 className={classes("font-semibold", className)}>{children}</h3>;
}
