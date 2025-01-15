"use client";
import { Event, EventGroup } from "@/app/types";
import { Fragment } from "react";
import groupBy from "lodash/groupBy";
import UpcomingItem from "./UpcomingItem";

export default function Upcoming({ events }: { events: Event[] }) {
  // Group events by date
  const grouped = groupBy(events, (event: Event) => event.dateString);
  const groupedEvents: EventGroup[] = Object.entries(grouped).map(
    ([dateString, events]) => ({
      dateString,
      events,
    }),
  );

  return (
    <>
      {groupedEvents.map((group: EventGroup) => (
        <Fragment key={group.dateString}>
          <h2 className="sticky top-0 bg-blue-250 px-3 py-1.5 font-medium">
            {group.dateString}
          </h2>
          <ul className="mb-3 flex flex-col last:mb-0">
            {group.events.map((event) => (
              <li key={event.slug}>
                <UpcomingItem event={event} />
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </>
  );
}
