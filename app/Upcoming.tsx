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
          <h2 className="text-lg font-bold sticky top-0 bg-white px-4">
            {group.dateString}
          </h2>
          <ul className="bg-blue px-4 py-1 text-white flex flex-col gap-1">
            {group.events.map(({ rc }) => (
              <li key={rc.name}>
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
