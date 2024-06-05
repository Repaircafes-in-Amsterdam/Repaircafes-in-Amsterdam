import { DivIconOptions, divIcon, icon } from "leaflet";
import { Marker } from "react-leaflet/Marker";
import { Tooltip } from "react-leaflet/Tooltip";

// Can't add a shadow to a divIcon, so we need to use a regular icon for the shadow
// We use a empty pixel as the icon, so it's not visible
const markerShadow = icon({
  iconUrl: "/pixel.png",
  shadowUrl: "/rc-marker-shadow.png",
  shadowRetinaUrl: "/rc-marker-shadow-2x.png",
  shadowSize: [45, 33],
  shadowAnchor: [15, 29],
});

const iconConfig: DivIconOptions = {
  html: `<svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23 12C23 16.105 20.2295 20.3616 17.2526 23.7106C15.7876 25.3588 14.3195 26.7355 13.2165 27.7005C12.7266 28.1292 12.3102 28.4754 12 28.7268C11.6898 28.4754 11.2734 28.1292 10.7835 27.7005C9.68054 26.7355 8.21242 25.3588 6.74741 23.7106C3.77047 20.3616 1 16.105 1 12C1 9.08262 2.15893 6.28473 4.22183 4.22183C6.28473 2.15893 9.08262 1 12 1C14.9174 1 17.7153 2.15893 19.7782 4.22183C21.8411 6.28473 23 9.08262 23 12Z"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    <path
      d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`,
  iconSize: [24, 30],
  iconAnchor: [12, 30],
  className: "text-blue",
};

var markerIcon = divIcon(iconConfig);

var markerIconActive = divIcon({
  ...iconConfig,
  className: "text-orange",
});

export default function MapMarker({
  position,
  onClick,
  active,
  label,
  showLabel,
}: {
  position: [number, number];
  onClick: () => void;
  active: boolean;
  label: string;
  showLabel: boolean;
}) {
  return (
    <>
      <Marker icon={markerShadow} position={position} />
      <Marker
        icon={active ? markerIconActive : markerIcon}
        position={position}
        eventHandlers={{
          click: onClick,
        }}
      >
        {showLabel && (
          <Tooltip
            direction="bottom"
            permanent
            interactive
            className="!rounded-none !px-2 !py-1 !font-sans font-medium !text-blue"
          >
            {label}
          </Tooltip>
        )}
      </Marker>
    </>
  );
}
