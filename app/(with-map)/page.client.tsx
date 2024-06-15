"use client";
import DistrictSelect from "../components/DistrictSelect";
import OfficeHoursCheckbox from "../components/OfficeHoursCheckbox";
import Upcoming from "./Upcoming";
import { Event } from "../types";

export default function ClientPage({ events }: { events: Event[] }) {
  return (
    <div className="md:max-w-side flex min-h-px w-full max-w-body flex-col border-blue md:shrink-0 md:overflow-y-auto md:border-r-2">
      <h1 className="sr-only">Agenda</h1>
      <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 py-3">
        <DistrictSelect />
        <OfficeHoursCheckbox />
      </div>
      <Upcoming events={events} />
    </div>
  );
}
