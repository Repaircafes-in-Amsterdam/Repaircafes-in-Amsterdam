"use client";
import { useRouter } from "next/navigation";
import DistrictSelect from "./DistrictSelect";
import OfficeHoursCheckbox from "./OfficeHoursCheckbox";
import Upcoming from "./Upcoming";
import { Event, MapRC } from "./types";
import useDistrict from "./useDistrict";
import useMap from "./utils/useMap";

export default function ClientPage({
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
  const router = useRouter();
  const Map = useMap();

  return (
    <div className="flex h-full w-full justify-center md:justify-normal">
      <div className="flex w-full max-w-body flex-col border-blue md:w-max md:shrink-0 md:overflow-y-auto md:border-r-2">
        <h1 className="sr-only">Agenda</h1>
        <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 py-3">
          <DistrictSelect />
          <OfficeHoursCheckbox />
        </div>
        <Upcoming events={events} />
      </div>
      <Map
        data={filteredMapData}
        className="hidden h-full md:flex"
        onSelect={(slug) => router.push(`/cafe/${slug}`)}
      />
    </div>
  );
}
