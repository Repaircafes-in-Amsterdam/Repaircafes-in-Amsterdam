import { ReactNode } from "react";

export default function Details({ children }: { children: ReactNode }) {
  return (
    <details className="group bg-blue-250 mb-3 overflow-hidden px-3">
      {children}
    </details>
  );
}
