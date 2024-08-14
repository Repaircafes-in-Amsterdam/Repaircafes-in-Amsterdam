"use client";
import DistrictSelect from "@/app/components/DistrictSelect";
import OfficeHoursCheckbox from "@/app/components/OfficeHoursCheckbox";
import Upcoming from "./Upcoming";
import { Event } from "@/app/types";
import { useState } from "react";
import getEvents from "@/app/actions/getEvents";
import LoadMore from "@/app/components/LoadMore";
import BasePage from "@/app/components/BasePage";

export default function ClientPage({
  initialEvents,
  numMonths,
}: {
  initialEvents: Event[];
  numMonths: number;
}) {
  const [offset, setOffset] = useState(numMonths);
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const loadMore = async () => {
    const additionalEvents = await getEvents({ monthsOffset: offset });
    setEvents([...events, ...additionalEvents]);
    setOffset(offset + numMonths);
  };

  return (
    <BasePage showHeader={false} title="Agenda" side>
      <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 py-3">
        <DistrictSelect />
        <OfficeHoursCheckbox />
      </div>
      <Upcoming events={events} />
      <LoadMore loadMore={loadMore} />
    </BasePage>
  );
}
