"use client";
import MapPanel from "./MapPanel";
import { MapRC } from "../types";
import useActive from "./useActive";
import useMap from "../utils/useMap";

export default function Page({ data }: { data: MapRC[] }) {
  const { value, setValue } = useActive();
  const activeData = data.find((rc) => rc.slug === value);
  const Map = useMap();

  return (
    <div className="relative flex h-full w-full flex-col">
      <Map data={data} active={value} onSelect={setValue} />
      {activeData && (
        <MapPanel active={activeData} onClose={() => setValue("")} />
      )}
    </div>
  );
}
