"use client";

import { useEffect } from "react";
import { usePathname } from "../navigation";

export default function ScrollToTop({ selector }: { selector: string }) {
  const pathname = usePathname();
  useEffect(() => {
    document.querySelector(selector)?.scroll(0, 0);
  }, [pathname, selector]);
  return <></>;
}