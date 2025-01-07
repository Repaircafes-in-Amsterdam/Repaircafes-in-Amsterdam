"use client";
import { Event, EventGroup } from "@/app/types";
import { Fragment } from "react";
import groupBy from "lodash/groupBy";
import useDistrict from "@/app/useDistrict";
import useOutsideOfficeHours from "@/app/useOutsideOfficeHours";
import UpcomingItem from "./UpcomingItem";

function isDuringOfficeHours(event: Event) {
  const endTime = event.endTime;
  const [endHours] = endTime.split(":").map(Number);
  // Might as well be 19?
  const duringDaytime = endHours < 18;
  const day = event.date.getDay();
  const duringWorkweek = day > 0 && day < 6;
  return duringDaytime && duringWorkweek;
}

export default function Upcoming({ events }: { events: Event[] }) {
  const { value: district } = useDistrict();
  const { value: rawOutsideOfficeHours } = useOutsideOfficeHours();
  const outsideOfficeHours = rawOutsideOfficeHours === "true";

  let filtered = events
    .filter((event) => district === "any" || district === event.district)
    .filter(
      (event) =>
        !outsideOfficeHours ||
        (outsideOfficeHours && !isDuringOfficeHours(event)),
    );
  // Group events by date
  const grouped = groupBy(filtered, (event: Event) => event.dateString);
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
