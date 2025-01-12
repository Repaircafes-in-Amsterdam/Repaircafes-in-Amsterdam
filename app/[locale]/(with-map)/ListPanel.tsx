"use client";
import DistrictSelect from "@/app/components/DistrictSelect";
import OfficeHoursCheckbox from "@/app/components/OfficeHoursCheckbox";
import Upcoming from "./Upcoming";
import { Event } from "@/app/types";
import { useState } from "react";
import getEvents from "@/app/actions/getEvents";
import LoadMore from "@/app/components/LoadMore";
import BasePage from "@/app/components/BasePage";
import { useTranslations } from "next-intl";
import { useSelectedLayoutSegment } from "next/navigation";
import classes from "@/app/utils/classes";

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

  const loadMore = async () => {
    const additionalEvents = await getEvents({ monthsOffset: offset, locale });
    setEvents([...events, ...additionalEvents]);
    setOffset(offset + numMonths);
  };

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
      <Upcoming events={events} />
      <LoadMore loadMore={loadMore} />
    </BasePage>
  );
}
