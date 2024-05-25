"use client";
import DistrictSelect from "./DistrictSelect";
import OfficeHoursCheckbox from "./OfficeHoursCheckbox";
import Upcoming from "./Upcoming";
import { Event, MapRC } from "./types";
import useDistrict from "./useDistrict";
import useMap from "./utils/useMap";

export default function Page({
  events,
  mapData,
}: {
  events: Event[];
  mapData: MapRC[];
}) {
  const { value: district } = useDistrict();
  const filteredMapData = mapData.filter(
    (item) => district === "any" || district === item.district,
  );

  const Map = useMap();
  return (
    <div className="flex h-full w-full justify-center md:justify-normal">
      <div className="flex w-full max-w-body flex-col border-blue md:w-max md:shrink-0 md:overflow-y-auto md:border-r-2">
        <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 pt-3">
          <DistrictSelect />
          <OfficeHoursCheckbox />
        </div>
        <Upcoming events={events} />
      </div>
      <Map data={filteredMapData} className="hidden h-full md:flex" />
    </div>
  );
}
