import useHoverStore from "@/app/useHoverStore";
import { Tooltip } from "react-leaflet/Tooltip";
import MarkerIcon from "@/app/icons/Marker.svg?react";
import { Marker } from "@adamscybot/react-leaflet-component-marker";
import Image from "next/image";
import classes from "@/app/utils/classes";

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

  return (
    <Marker
      icon={
        <div>
          <Image
            src="/rc-marker-shadow-2x.png"
            width="45"
            height="33"
            alt=""
            aria-hidden
            className="pointer-events-none absolute top-px -left-[3px]"
          />
          <MarkerIcon
            className={classes(
              "pointer-events-none relative",
              active || isHovered ? "text-orange" : "text-blue",
            )}
            title={label}
          />
        </div>
      }
      componentIconOpts={{
        layoutMode: "fit-parent",
        rootDivOpts: {
          iconSize: [24, 30],
          iconAnchor: [12, 30],
        },
      }}
      zIndexOffset={isHovered ? 10 : 0}
      position={position}
      eventHandlers={{
        click: () => {
          setHoveredMarker("");
          onClick();
        },
        mouseover: () => setHoveredMarker(slug),
        mouseout: () => setHoveredMarker(""),
      }}
      riseOnHover
    >
      <Tooltip
        key={showLabel ? "permanent" : "hover"}
        direction="bottom"
        permanent={showLabel}
        interactive={showLabel}
        className={
          "text-blue! rounded-none! px-2! py-1! font-sans! font-medium"
        }
        // TODO add tab index?
      >
        {label}
      </Tooltip>
    </Marker>
  );
}
