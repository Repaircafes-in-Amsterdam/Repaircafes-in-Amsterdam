import { Event, MapRC } from "@/app/types";
import { defaultValue as defaultDistrict } from "../useDistrict";

export default function districtFilter(district: string) {
  return (item: Event | MapRC) =>
    district === defaultDistrict || district === item.district;
}
