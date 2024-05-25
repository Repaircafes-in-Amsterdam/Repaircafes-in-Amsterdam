import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function useMap() {
  const Map = useMemo(
    () =>
      dynamic(() => import("../components/Map"), {
        ssr: false,
      }),
    [],
  );
  return Map;
}
