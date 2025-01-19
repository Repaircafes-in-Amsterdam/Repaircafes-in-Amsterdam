"use client";

import { usePathname } from "@/i18n/routing";
import { useEffect } from "react";

export default function ScrollToTop({ selector }: { selector: string }) {
  const pathname = usePathname();
  useEffect(() => {
    document.querySelector(selector)?.scroll(0, 0);
  }, [pathname, selector]);
  return <></>;
}
