import { useEffect } from "react";
import { useMap, useMapEvent } from "react-leaflet/hooks";

export default function MapZoomObserver({
  onZoom,
}: {
  onZoom: (level: number) => void;
}) {
  const map = useMap();
  useMapEvent("zoom", (event) => {
    onZoom(event.target.getZoom());
  });
  useEffect(() => {
    onZoom(map.getZoom());
  }, [onZoom, map]);

  return null;
}
