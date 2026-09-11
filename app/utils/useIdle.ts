import { useEffect, useState } from "react";

export default function useIdle(timeout = 1000) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(() => setIsIdle(true), {
        timeout,
      });
      return () => window.cancelIdleCallback(handle);
    } else {
      const handle = setTimeout(() => setIsIdle(true), 100);
      return () => clearTimeout(handle);
    }
  }, [timeout]);

  return isIdle;
}
