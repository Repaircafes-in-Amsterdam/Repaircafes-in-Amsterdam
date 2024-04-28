"use client";
import useUpcomingData from "./useUpcomingData";
import { EventGroup } from "./types";
import { Fragment } from "react";

export default function Upcoming() {
  const groupedEvents = useUpcomingData();

  return (
    <>
      {groupedEvents.map((group: EventGroup) => (
        <Fragment key={group.dateString}>
          <h2 className="font-medium sticky top-0 bg-white px-3 py-1.5">
            {group.dateString}
          </h2>
          <ul className="bg-blue text-white flex flex-col">
            {group.events.map(({ rc }) => (
              <li key={rc.name} className="px-3 py-1.5">
                <em className="font-bold not-italic">{rc.name}</em>
                <br />
                {rc.startTime} - {rc.endTime} in {rc.district}
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </>
  );
}
