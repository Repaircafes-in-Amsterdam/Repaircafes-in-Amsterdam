"use client";
import MapPanel from "./MapPanel";
import { MapRC } from "../types";
import useMap from "./useMap";

export default function ClientPage({ data }: { data: MapRC[] }) {
  const Map = useMap();

  return (
    <div className="relative flex h-full w-full flex-col">
      <h1 className="sr-only">Kaart</h1>
      <Map data={data} />
      <MapPanel data={data} />
    </div>
  );
}
