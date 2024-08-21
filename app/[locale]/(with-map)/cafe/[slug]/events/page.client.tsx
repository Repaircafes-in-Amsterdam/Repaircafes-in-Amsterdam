"use client";
import { RC, Event } from "@/app/types";
import BasePage from "@/app/components/BasePage";
import getEvents from "@/app/actions/getEvents";
import DetailsSection from "@/app/components/DetailsSection";
import classes from "@/app/utils/classes";
import LoadMore from "@/app/components/LoadMore";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Multilingual from "@/app/components/Multilingual";

export default function EventsClient({
  rc,
  initialEvents,
  numMonths,
  locale,
}: {
  rc: RC;
  initialEvents: Event[];
  numMonths: number;
  locale: string;
}) {
  const [offset, setOffset] = useState(numMonths);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const t = useTranslations("cafe-events");

  const loadMore = async () => {
    const additionalEvents = await getEvents({
      slug: rc.slug,
      monthsOffset: offset,
      numMonths: numMonths,
      debug: true,
      locale,
    });
    setEvents([...events, ...additionalEvents]);
    setOffset(offset + numMonths);
  };

  return (
    <BasePage title={rc.name} side>
      <div className="flex grow flex-col gap-2 overflow-y-auto px-3 pb-3">
        <DetailsSection title={t("open")}>
          <Multilingual>{rc.open}</Multilingual>
        </DetailsSection>
        {rc.rrule && (
          <DetailsSection
            title={t("rrule")}
            infoLink="https://medium.com/@edouard.courty/the-best-way-to-programmatically-handle-recurrence-11e9b489b27d"
          >
            {rc.rrule}
          </DetailsSection>
        )}
        {rc.closed && (
          <DetailsSection title={t("closed")}>{rc.closed}</DetailsSection>
        )}
        <DetailsSection title={t("next")}>
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
                {closedCause && <p>{t("closedCause", { closedCause })}</p>}
                {exceptionCause && (
                  <p>{t("exceptionCause", { exceptionCause })}</p>
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
