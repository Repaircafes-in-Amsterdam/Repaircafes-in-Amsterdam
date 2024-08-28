import { ReactNode } from "react";

export default function Details({ children }: { children: ReactNode }) {
  return (
    <details className="group mb-3 overflow-hidden bg-blue-250 px-3">
      {children}
    </details>
  );
}
