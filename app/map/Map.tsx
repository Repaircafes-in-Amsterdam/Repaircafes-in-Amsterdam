"use client";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { MapRC } from "../types";
import { latLngBounds } from "leaflet";
import useActive from "./useActive";
import MapMarker from "./MapMarker";
import MapZoomControl from "./MapZoomControl";
import MapZoomObserver from "./MapZoomObserver";

// function ClickOutside({ onClick }: { onClick: (slug: string) => void }) {
//   useMapEvent("click", () => onClick(""));
//   return null;
// }

export default function Map({ data }: { data: MapRC[] }) {
  const bounds = latLngBounds(
    data.map((rc) => rc.coordinate as [number, number]),
  );
  const { value, setValue } = useActive();
  const [zoomLevel, setZoomLevel] = useState<number>(0);

  return (
    <>
      <div id="zoom-control-portal" className="relative"></div>
      <MapContainer
        className="relative z-0 h-full w-full"
        bounds={bounds}
        scrollWheelZoom={true}
        zoomControl={false}
        zoomSnap={0.1}
        boundsOptions={{ padding: [20, 20] }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {data.map((rc) => (
          <MapMarker
            key={rc.slug}
            position={rc.coordinate as [number, number]}
            onClick={() => setValue(rc.slug)}
            active={rc.slug === value}
            label={rc.name}
            showLabel={zoomLevel > 13}
          />
        ))}
        {/* <ClickOutside onClick={onClick} /> */}
        <MapZoomControl />
        <MapZoomObserver onZoom={setZoomLevel} />
      </MapContainer>
    </>
  );
}
