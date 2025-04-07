"use client";
import { Event, EventGroup } from "@/app/types";
import { Fragment } from "react";
import groupBy from "lodash/groupBy";
import UpcomingItem from "./UpcomingItem";
import useLinkPostfix from "@/app/utils/useLinkPostfix";
import { useParams } from "next/navigation";

export default function Upcoming({ events }: { events: Event[] }) {
  // Group events by date
  const grouped = groupBy(events, (event: Event) => event.dateString);
  const groupedEvents: EventGroup[] = Object.entries(grouped).map(
    ([dateString, events]) => ({ dateString, events }),
  );

  const linkPostfix = useLinkPostfix();
  const params = useParams();
  const openSlug = (params?.slug as string) || "";

  return (
    <>
      {groupedEvents.map((group: EventGroup) => (
        <Fragment key={group.dateString}>
          <h2 className="bg-blue-250 sticky top-0 px-3 py-1.5 font-medium">
            {group.dateString}
          </h2>
          <ul className="mb-3 flex flex-col last:mb-0">
            {group.events.map((event) => (
              <li key={event.slug}>
                <UpcomingItem
                  event={event}
                  openSlug={openSlug}
                  linkPostfix={linkPostfix}
                />
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </>
  );
}
