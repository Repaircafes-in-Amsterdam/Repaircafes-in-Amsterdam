"use client";
import { RC, Event } from "@/app/types";
import BasePage from "@/app/components/BasePage";
import getEvents from "@/app/actions/getEvents";
import DetailsSection from "@/app/components/DetailsSection";
import classes from "@/app/utils/classes";
import LoadMore from "@/app/components/LoadMore";
import { useState } from "react";

export default function EventsClient({
  rc,
  initialEvents,
  numMonths,
}: {
  rc: RC;
  initialEvents: Event[];
  numMonths: number;
}) {
  const [offset, setOffset] = useState(6);
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const loadMore = async () => {
    const additionalEvents = await getEvents({
      slug: rc.slug,
      monthsOffset: offset,
      numMonths: numMonths,
      debug: true,
    });
    setEvents([...events, ...additionalEvents]);
    setOffset(offset + numMonths);
  };

  return (
    <BasePage title={rc.name} side>
      <div className="flex grow flex-col gap-2 overflow-y-auto px-3 pb-3">
        <DetailsSection title="Geopend op">{rc.open}</DetailsSection>
        {rc.rrule && (
          <DetailsSection
            title="RRule"
            infoLink="https://medium.com/@edouard.courty/the-best-way-to-programmatically-handle-recurrence-11e9b489b27d"
          >
            {rc.rrule}
          </DetailsSection>
        )}
        {rc.closed && (
          <DetailsSection title="Gesloten op">{rc.closed}</DetailsSection>
        )}
        <DetailsSection title="Eerst volgende keren">
          <ul className="list-outside space-y-1 pl-4">
            {events.map(({ dateString, date, closedCause, exceptionCause }) => (
              <li key={dateString + date.getFullYear()} className="list-disc">
                <strong
                  className={classes(
                    "font-medium",
                    closedCause && "line-through ",
                  )}
                >
                  {dateString} {date.getFullYear()}
                </strong>
                {closedCause && <p>{"Want " + closedCause}</p>}
                {exceptionCause && (
                  <p>{"Want uitzondering: " + exceptionCause}</p>
                )}
              </li>
            ))}
          </ul>
          <LoadMore loadMore={loadMore} />
        </DetailsSection>
      </div>
    </BasePage>
  );
}
