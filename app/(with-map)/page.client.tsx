"use client";
import DistrictSelect from "../components/DistrictSelect";
import OfficeHoursCheckbox from "../components/OfficeHoursCheckbox";
import Upcoming from "./Upcoming";
import { Event } from "../types";
import { useEffect, useRef, useState } from "react";
import getEvents from "@/app/actions/getEvents";
import useIntersectionObserver from "@/app/utils/useIntersectionObserver";
import useHoverStore from "../useHoverStore";

export default function ClientPage({
  initialEvents,
}: {
  initialEvents: Event[];
}) {
  const [offset, setOffset] = useState(1);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const loadMoreRef = useRef(null);
  const loadMoreVisible = useIntersectionObserver(loadMoreRef);
  loadMoreRef;

  const loadMore = async () => {
    const additionalEvents = await getEvents({ monthsOffset: offset });
    setEvents([...events, ...additionalEvents]);
    setOffset(offset + 1);
  };

  // reset on hover on mount
  const { setHoveredSlug } = useHoverStore();
  useEffect(() => {
    setHoveredSlug("");
  }, [setHoveredSlug]);

  useEffect(() => {
    if (loadMoreVisible) loadMore();
  }, [loadMoreVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-px w-full max-w-body flex-col border-blue md:max-w-side md:shrink-0 md:overflow-y-auto md:border-r-2">
      <h1 className="sr-only">Agenda</h1>
      <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 py-3">
        <DistrictSelect />
        <OfficeHoursCheckbox />
      </div>
      <Upcoming events={events} />
      <div className="px-3 pb-3" ref={loadMoreRef}>
        Bezig met laden van meer...
      </div>
    </div>
  );
}
