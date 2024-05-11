"use client";
import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// import "leaflet-defaulticon-compatibility";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { RC } from "../types";
import { IconOptions, icon, latLngBounds } from "leaflet";
import useActive from "./useActive";
// import { useMapEvent } from "react-leaflet/hooks";

// function ClickOutside({ onClick }: { onClick: (slug: string) => void }) {
//   useMapEvent("click", () => onClick(""));
//   return null;
// }

const iconConfig: IconOptions = {
  iconUrl: "rc-marker-icon.png",
  iconRetinaUrl: "rc-marker-icon-2x.png",
  iconSize: [24, 30],
  iconAnchor: [12, 30],
  shadowUrl: "rc-marker-shadow.png",
  shadowRetinaUrl: "rc-marker-shadow-2x.png",
  shadowSize: [45, 33],
  shadowAnchor: [15, 29],
};

var markerIcon = icon(iconConfig);

var markerIconActive = icon({
  ...iconConfig,
  iconUrl: "rc-marker-icon-active.png",
  iconRetinaUrl: "rc-marker-icon-active-2x.png",
});

export default function Map({ data }: { data: RC[] }) {
  const bounds = latLngBounds(
    data.map((rc) => rc.coordinate as [number, number]),
  );
  const { value, setValue } = useActive();

  return (
    <MapContainer
      className="z-0 h-full w-full"
      bounds={bounds}
      scrollWheelZoom={true}
    >
      <TileLayer
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"

        // url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png"
        // attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {(data as RC[]).map((rc) => (
        <Marker
          icon={rc.slug === value ? markerIconActive : markerIcon}
          key={rc.slug}
          position={rc.coordinate as [number, number]}
          eventHandlers={{
            click: () => setValue(rc.slug),
          }}
        />
      ))}
      {/* <ClickOutside onClick={onClick} /> */}
    </MapContainer>
  );
}
