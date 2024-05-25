import { useMap } from "react-leaflet";
import Plus from "@/app/icons/Plus.svg?react";
import Minus from "@/app/icons/Minus.svg?react";
import { createPortal } from "react-dom";

export default function MapZoomControl() {
  const map = useMap();
  return createPortal(
    <div className="absolute right-3 top-3 z-10 cursor-pointer bg-white">
      <div
        className="border-2 border-blue p-1"
        onClick={() => map.zoomIn(1, { animate: true })}
      >
        <Plus />
      </div>
      <div
        className="border-2 border-t-0 border-blue p-1"
        onClick={() => map.zoomOut(1, { animate: true })}
      >
        <Minus />
      </div>
    </div>,
    document.getElementById("zoom-control-portal")!,
  );
}
