"use client";
import useUpcomingData from "./useUpcomingData";
import { EventGroup } from "./types";
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Upcoming() {
  const groupedEvents = useUpcomingData();

  return (
    <>
      {groupedEvents.map((group: EventGroup) => (
        <Fragment key={group.dateString}>
          <h2 className="font-medium sticky top-0 bg-white px-3 py-1.5">
            {group.dateString}
          </h2>
          <ul className=" flex flex-col">
            {group.events.map(({ rc }) => (
              <li key={rc.slug}>
                <Link
                  href={`cafe/${rc.slug}`}
                  className="px-3 py-1.5 flex items-center bg-blue hover:bg-orange hover:text-blue-600 text-white cursor-pointer"
                >
                  <div className="flex flex-col grow">
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
