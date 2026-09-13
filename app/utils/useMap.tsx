import dynamic from "next/dynamic";
import { useMemo } from "react";
import MapPreview from "@/app/components/map/MapPreview";

export default function useMap() {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/app/components/map/Map"), {
        ssr: false,
        loading: () => <MapPreview />,
      }),
    [],
  );
  return Map;
}
