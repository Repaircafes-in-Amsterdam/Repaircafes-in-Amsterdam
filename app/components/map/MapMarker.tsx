import { useCallback } from "react";
import useHoverStore from "@/app/useHoverStore";
import MarkerIcon from "@/app/icons/Marker.svg?react";
import { Marker, Popup } from "@vis.gl/react-maplibre";
import type { MarkerInstance } from "@vis.gl/react-maplibre";

const BLUE = "#2D2E82";
const ORANGE = "#ED6A42";

export default function MapMarker({
  position,
  onClick,
  active,
  slug,
  label,
  showLabel,
}: {
  position: [number, number];
  onClick: () => void;
  active: boolean;
  slug: string;
  label: string;
  showLabel: boolean;
}) {
  const isHovered = useHoverStore(
    (state) => state.hoveredRow === slug || state.hoveredMarker === slug,
  );
  const setHoveredMarker = useHoverStore((state) => state.setHoveredMarker);

  const shouldbeHighlighted = active || isHovered;

  // Marker does not support mouse events directly, so we attach them to the underlying DOM element via the ref.
  const markerRef = useCallback(
    (marker: MarkerInstance | null) => {
      const element = marker?.getElement();
      if (!element) return;
      const onMouseEnter = () => setHoveredMarker(slug);
      const onMouseLeave = () => setHoveredMarker("");
      element.addEventListener("mouseenter", onMouseEnter);
      element.addEventListener("mouseleave", onMouseLeave);
      return () => {
        element.removeEventListener("mouseenter", onMouseEnter);
        element.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    [setHoveredMarker, slug],
  );
  return (
    <>
      <Marker
        ref={markerRef}
        longitude={position[1]}
        latitude={position[0]}
        // Y offset based on svg: -(shadow-center - height/2)
        offset={[0, -13]}
        style={{ zIndex: shouldbeHighlighted ? 10 : 0 }}
        onClick={(event) => {
          // Marker DOM elements bubble into the Map container, which would otherwise trigger the click-outside deselect too.
          event.originalEvent.stopPropagation();
          setHoveredMarker("");
          onClick();
        }}
      >
        <MarkerIcon
          aria-hidden="true"
          style={{ color: shouldbeHighlighted ? ORANGE : BLUE }}
          className={shouldbeHighlighted ? "text-orange" : "text-blue"}
        />
      </Marker>
      {(showLabel || isHovered) && (
        <Popup
          longitude={position[1]}
          latitude={position[0]}
          anchor="top"
          offset={[0, 6] as [number, number]}
          closeButton={false}
          closeOnClick={false}
          className="popup-content:rounded-none! popup-content:px-2! popup-content:py-1! popup-content:font-sans popup-content:font-medium popup-tip:hidden"
        >
          {label}
        </Popup>
      )}
    </>
  );
}
