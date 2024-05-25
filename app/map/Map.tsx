"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { MapRC } from "../types";
import { latLngBounds } from "leaflet";
import MapMarker from "./MapMarker";
import MapZoomControl from "./MapZoomControl";

// function ClickOutside({ onClick }: { onClick: (slug: string) => void }) {
//   useMapEvent("click", () => onClick(""));
//   return null;
// }

export default function Map({
  data,
  active,
  onSelect,
}: {
  data: MapRC[];
  active: string;
  onSelect: (slug: string) => void;
}) {
  const bounds = latLngBounds(
    data.map((rc) => rc.coordinate as [number, number]),
  );

  return (
    <>
      <div id="zoom-control-portal" className="relative"></div>
      <MapContainer
        className="relative z-0 h-full w-full"
        bounds={bounds}
        scrollWheelZoom={true}
        zoomControl={false}
        zoomSnap={0.5}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {data.map((rc) => (
          <MapMarker
            key={rc.slug}
            position={rc.coordinate as [number, number]}
            onClick={() => onSelect(rc.slug)}
            active={rc.slug === active}
          />
        ))}
        {/* <ClickOutside onClick={onClick} /> */}
        <MapZoomControl />
      </MapContainer>
    </>
  );
}
