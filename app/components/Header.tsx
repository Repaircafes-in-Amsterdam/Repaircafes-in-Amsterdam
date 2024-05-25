import { ReactNode } from "react";
import classes from "../utils/classes";

export default function Header({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h3 className={classes("font-bold", className)}>{children}</h3>;
}
