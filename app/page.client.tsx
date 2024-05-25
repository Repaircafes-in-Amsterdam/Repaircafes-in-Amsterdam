"use client";
import DistrictSelect from "./DistrictSelect";
import OfficeHoursCheckbox from "./OfficeHoursCheckbox";
import Upcoming from "./Upcoming";
import { Event, MapRC } from "./types";
import useMap from "./utils/useMap";

export default function Page({
  events,
  mapData,
}: {
  events: Event[];
  mapData: MapRC[];
}) {
  const Map = useMap();
  return (
    <div className="flex h-full w-full">
      <div className="flex w-full max-w-body flex-col border-blue md:w-auto md:overflow-y-auto md:border-r-2">
        <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 pt-3">
          <DistrictSelect />
          <OfficeHoursCheckbox />
        </div>
        <Upcoming events={events} />
      </div>
      <Map data={mapData} className="hidden h-full w-full md:flex" />
    </div>
  );
}
