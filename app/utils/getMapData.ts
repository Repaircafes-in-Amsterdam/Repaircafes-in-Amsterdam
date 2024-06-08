import data from "@/data/data.json";
import { MapRC, RC } from "../types";

const rcs = data as RC[];

export default function getMapData(): MapRC[] {
  return rcs.map((rc: RC) => ({
    slug: rc.slug,
    coordinate: rc.coordinate,
    name: rc.name,
    open: rc.open,
    address: rc.address,
    verified: rc.verified,
    district: rc.district,
  }));
}
