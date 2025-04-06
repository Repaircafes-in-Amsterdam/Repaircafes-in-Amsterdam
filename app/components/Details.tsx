import { ReactNode } from "react";

export default function Details({ children }: { children: ReactNode }) {
  return (
    <details className="group bg-blue-250 mb-3 px-3 [&>p:first-of-type]:mt-2 [&>p:last-child]:pb-2">
      {children}
    </details>
  );
}
