import { Suspense, useMemo } from "react";
import data from "@/data/data.json";
import dynamic from "next/dynamic";
import MapPanel from "./MapPanel";
import { MapRC, RC } from "../types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kaart - Repair Cafes in Amsterdam",
  description: "Kaart van alle Repair Cafés in Amsterdam",
};

export default function MapServer() {
  const mapData: MapRC[] = data.map((rc) => ({
    slug: rc.slug,
    coordinate: rc.coordinate,
    name: rc.name,
    open: rc.open,
    address: rc.address,
    verified: rc.verified,
  }));
  return <MapClient data={mapData} />;
}

function MapClient({ data }: { data: MapRC[] }) {
  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        ssr: false,
      }),
    [],
  );

  return (
    <div className="relative flex h-full w-full flex-col">
      <h1 className="sr-only">Kaart</h1>
      <Map data={data} />
      <Suspense>
        <MapPanel data={data} />
      </Suspense>
    </div>
  );
}
