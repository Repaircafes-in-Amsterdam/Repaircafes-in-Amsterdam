import { ReactNode } from "react";

export default function Header({ children }: { children: ReactNode }) {
  return <h3 className="font-bold">{children}</h3>;
}
