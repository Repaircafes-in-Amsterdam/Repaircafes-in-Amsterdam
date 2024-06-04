"use client";
import MapPanel from "./MapPanel";
import { MapRC } from "../types";
import useMap from "./useMap";
import useActive from "./useActive";

export default function ClientPage({ data }: { data: MapRC[] }) {
  const { value, setValue } = useActive();
  const activeData = data.find((rc) => rc.slug === value);
  const Map = useMap();

  return (
    <div className="relative flex h-full w-full flex-col">
      <h1 className="sr-only">Kaart</h1>
      <Map data={data} active={value} onSelect={setValue} />
      {activeData && (
        <MapPanel active={activeData} onClose={() => setValue("")} />
      )}
    </div>
  );
}
