import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function useMap() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/app/components/map/Map"), {
        ssr: false,
      }),
    [],
  );
  return Map;
}
