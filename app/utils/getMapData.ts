import data from "@/data/data/cafes.json";
import { MapRC, RC } from "@/app/types";
import hasOutOfOfficeHours from "./hasOutOfOfficeHours";

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
    someOutOfOfficeHours: hasOutOfOfficeHours(rc),
  }));
}
