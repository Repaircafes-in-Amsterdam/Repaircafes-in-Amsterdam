"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useHoverStore from "../useHoverStore";

export default function HoverResetter() {
  const pathname = usePathname();

  // reset hover state after route changes
  const setHoveredMarker = useHoverStore((state) => state.setHoveredMarker);
  const setHoveredRow = useHoverStore((state) => state.setHoveredRow);

  useEffect(() => {
    setHoveredMarker("");
    setHoveredRow("");
  }, [pathname, setHoveredMarker, setHoveredRow]);

  return <></>;
}
