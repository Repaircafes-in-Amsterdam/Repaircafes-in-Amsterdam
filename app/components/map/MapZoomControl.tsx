import { useMap } from "react-leaflet";
import Plus from "@/app/icons/Plus.svg?react";
import Minus from "@/app/icons/Minus.svg?react";
import { createPortal } from "react-dom";

export default function MapZoomControl() {
  const map = useMap();
  return createPortal(
    <div className="absolute top-3 right-3 z-10 cursor-pointer bg-white">
      <div
        className="border-blue border-2 p-1"
        onClick={() => map.zoomIn(1, { animate: true })}
        aria-label="Zoom in"
      >
        <Plus title="Zoom in" />
      </div>
      <div
        className="border-blue border-2 border-t-0 p-1"
        onClick={() => map.zoomOut(1, { animate: true })}
        aria-label="Zoom out"
      >
        <Minus title="Zoom out" />
      </div>
    </div>,
    document.getElementById("zoom-control-portal")!,
  );
}
