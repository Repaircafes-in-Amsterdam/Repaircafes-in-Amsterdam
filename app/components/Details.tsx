import { ReactNode } from "react";

export default function Details({ children }: { children: ReactNode }) {
  return (
    <details className="group mb-3 bg-blue-250 px-3 pb-0.5">{children}</details>
  );
}
