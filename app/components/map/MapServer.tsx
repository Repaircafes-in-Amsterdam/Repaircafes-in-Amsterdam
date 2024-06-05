import getMapData from "@/app/utils/getMapData";
import MapClient from "./MapClient";

export default function MapServer() {
  const mapData = getMapData();
  return <MapClient data={mapData} />;
}
