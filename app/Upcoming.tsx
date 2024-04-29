"use client";
import useUpcomingData from "./useUpcomingData";
import { EventGroup } from "./types";
import { Fragment } from "react";
import ChevronRight from "@/app/icons/ChevronRight.svg";

import Link from "next/link";

export default function Upcoming() {
  const groupedEvents = useUpcomingData();

  return (
    <>
      {groupedEvents.map((group: EventGroup) => (
        <Fragment key={group.dateString}>
          <h2 className="sticky top-0 bg-white px-3 py-1.5 font-medium">
            {group.dateString}
          </h2>
          <ul className=" flex flex-col">
            {group.events.map(({ rc }) => (
              <li key={rc.slug}>
                <Link
                  href={`cafe/${rc.slug}`}
                  className="flex cursor-pointer items-center bg-blue px-3 py-1.5 text-white hover:bg-orange hover:text-blue-600"
                >
                  <div className="flex grow flex-col">
                    <em className="font-bold not-italic">{rc.name}</em>
                    {rc.startTime} - {rc.endTime} in {rc.district}
                  </div>
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
