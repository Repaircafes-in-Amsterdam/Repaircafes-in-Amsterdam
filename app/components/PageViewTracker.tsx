"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

export default function PageViewTracker() {
  const pathname = usePathname();
  const posthog = usePostHog();
  useEffect(() => {
    if (pathname && posthog) {
      // Note: intentionally ignoring search params
      let url = window.origin + pathname;
      posthog.capture("$pageview", {
        $current_url: url,
        title: document.title,
      });
    }
  }, [pathname, posthog]);

  return null;
}
