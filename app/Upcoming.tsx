"use client";
import { Event, EventGroup } from "./types";
import { Fragment } from "react";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Warning from "@/app/icons/Warning.svg?react";

import Link from "next/link";
import groupBy from "lodash/groupBy";
import useDistrict from "./useDistrict";
import useOfficeHours from "./useOfficeHours";

function isDuringOfficeHours(event: Event) {
  const endTime = event.rc.endTime;
  const [endHours] = endTime.split(":").map(Number);
  // Might as well be 19?
  const duringDaytime = endHours < 18;
  const day = event.date.getDay();
  const duringWorkweek = day > 0 && day < 6;
  return duringDaytime && duringWorkweek;
}

export default function Upcoming({ events }: { events: Event[] }) {
  const { value: district } = useDistrict();
  const { value: rawJustOfficeHours } = useOfficeHours();
  const justOfficeHours = rawJustOfficeHours === "true";

  let filtered = events
    .filter((event) => district === "any" || district === event.rc.district)
    .filter(
      (event) =>
        !justOfficeHours || (justOfficeHours && !isDuringOfficeHours(event)),
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
          <ul className="mb-3 flex flex-col">
            {group.events.map(({ rc }) => (
              <li key={rc.slug}>
                <Link
                  href={`cafe/${rc.slug}`}
                  className="flex cursor-pointer items-center gap-3 bg-blue px-3 py-1.5 text-white [@media(hover:hover)]:hover:bg-orange [@media(hover:hover)]:hover:text-blue-600"
                >
                  <div className="flex grow flex-col">
                    <em className="font-semibold not-italic">{rc.name}</em>
                    {rc.startTime} - {rc.endTime} in {rc.district}
                  </div>
                  {!rc.verified && <Warning />}
                  <ChevronRight />
                </Link>
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </>
  );
}
