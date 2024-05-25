import data from "@/data/data.json";
import { MapRC, RC } from "../types";

export default function getMapData(): MapRC[] {
  return data.map((rc: RC) => ({
    slug: rc.slug,
    coordinate: rc.coordinate,
    name: rc.name,
    open: rc.open,
    address: rc.address,
    district: rc.district,
  }));
}
