"use client";
import "leaflet/dist/leaflet.css";
// import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
// import "leaflet-defaulticon-compatibility";
import data from "@/data/data.json";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet";
import { RC } from "../types";
import { latLngBounds } from "leaflet";
import Header from "../components/Header";
import Link from "next/link";

export default function Map() {
  const bounds = latLngBounds(
    data.map((rc) => rc.coordinate as [number, number]),
  );

  return (
    <MapContainer
      className="z-0 h-full w-full"
      bounds={bounds}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
      />
      {(data as RC[]).map((rc) => (
        <Marker key={rc.slug} position={rc.coordinate as [number, number]}>
          <Popup className="flex flex-col gap-1 text-blue">
            <Header>{rc.name}</Header>
            <div>{rc.address}</div>
            <div>{rc.open}</div>
            <Link href={`cafe/${rc.slug}`} className="">
              Meer info
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
