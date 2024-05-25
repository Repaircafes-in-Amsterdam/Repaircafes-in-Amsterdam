"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import MapPanel from "./MapPanel";
import { MapRC } from "../types";
import useActive from "./useActive";

export default function Page({ data }: { data: MapRC[] }) {
  const { value, setValue } = useActive();
  const activeData = data.find((rc) => rc.slug === value);
  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        ssr: false,
      }),
    [],
  );

  return (
    <div className="relative flex h-full w-full flex-col">
      <Map data={data} active={value} onSelect={setValue} />
      {activeData && (
        <MapPanel active={activeData} onClose={() => setValue("")} />
      )}
    </div>
  );
}
