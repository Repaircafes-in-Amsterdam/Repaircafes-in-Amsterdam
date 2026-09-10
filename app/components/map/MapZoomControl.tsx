import { useMap } from "@vis.gl/react-maplibre";
import Plus from "@/app/icons/Plus.svg?react";
import Minus from "@/app/icons/Minus.svg?react";

export default function MapZoomControl() {
  const { current: map } = useMap();
  return (
    <div className="absolute top-3 right-3 z-10 cursor-pointer bg-white">
      <div
        className="border-blue border-2 p-1"
        onClick={() => map?.zoomIn({ duration: 300 })}
        aria-label="Zoom in"
      >
        <Plus title="Zoom in" />
      </div>
      <div
        className="border-blue border-2 border-t-0 p-1"
        onClick={() => map?.zoomOut({ duration: 300 })}
        aria-label="Zoom out"
      >
        <Minus title="Zoom out" />
      </div>
    </div>
  );
}
