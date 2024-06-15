import getMapData from "@/app/utils/getMapData";
import MapClient from "./MapClient";
import { Suspense } from "react";

export default function MapServer() {
  const mapData = getMapData();
  return (
    <Suspense>
      <MapClient data={mapData} />
    </Suspense>
  );
}
