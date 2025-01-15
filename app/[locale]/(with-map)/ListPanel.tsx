"use client";
import DistrictSelect from "@/app/components/DistrictSelect";
import OfficeHoursCheckbox from "@/app/components/OfficeHoursCheckbox";
import Upcoming from "./Upcoming";
import { Event } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import getEvents from "@/app/actions/getEvents";
import LoadMore from "@/app/components/LoadMore";
import BasePage from "@/app/components/BasePage";
import { useTranslations } from "next-intl";
import { useSelectedLayoutSegment } from "next/navigation";
import classes from "@/app/utils/classes";
import useDistrict from "@/app/useDistrict";
import useOutsideOfficeHours from "@/app/useOutsideOfficeHours";
import filterEvents from "@/app/utils/filterEvents";

export default function ListPanel({
  initialEvents,
  numMonths,
  locale,
}: {
  initialEvents: Event[];
  numMonths: number;
  locale: string;
}) {
  const currentSegment = useSelectedLayoutSegment();
  const onSubRoute = currentSegment !== null;
  const [offset, setOffset] = useState(numMonths);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const t = useTranslations("agenda");
  const numEmpty = useRef(0);
  const { value: district } = useDistrict();
  const { value: rawOutsideOfficeHours } = useOutsideOfficeHours();
  const outsideOfficeHours = rawOutsideOfficeHours === "true";
  const filteredEvents = filterEvents(events, district, outsideOfficeHours);

  const loadMore = async () => {
    if (numEmpty.current > 3) return;
    const additionalEvents = await getEvents({ monthsOffset: offset, locale });
    numEmpty.current =
      filterEvents(additionalEvents, district, outsideOfficeHours).length === 0
        ? numEmpty.current + 1
        : 0;
    setEvents([...events, ...additionalEvents]);
    setOffset(offset + numMonths);
  };

  useEffect(() => {
    numEmpty.current = 0;
  }, [district, outsideOfficeHours]);

  return (
    <BasePage
      showHeader={false}
      title={t("title")}
      side
      className={classes(onSubRoute && "hidden xl:flex")}
    >
      <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 py-3">
        <DistrictSelect />
        <OfficeHoursCheckbox />
      </div>
      <Upcoming events={filteredEvents} />
      <LoadMore loadMore={loadMore} />
    </BasePage>
  );
}
