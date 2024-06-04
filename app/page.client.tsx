"use client";
import DistrictSelect from "./DistrictSelect";
import OfficeHoursCheckbox from "./OfficeHoursCheckbox";
import Upcoming from "./Upcoming";
import { Event } from "./types";

export default function ClientPage({ events }: { events: Event[] }) {
  return (
    <div className="flex w-full max-w-body flex-col">
      <h1 className="sr-only">Agenda</h1>
      <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 py-3">
        <DistrictSelect />
        <OfficeHoursCheckbox />
      </div>
      <Upcoming events={events} />
    </div>
  );
}
