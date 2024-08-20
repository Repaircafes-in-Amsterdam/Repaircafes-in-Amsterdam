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

export default function ClientPage({
  initialEvents,
  numMonths,
  locale,
}: {
  initialEvents: Event[];
  numMonths: number;
  locale: string;
}) {
  const [offset, setOffset] = useState(numMonths);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const t = useTranslations();

  const loadMore = async () => {
    const additionalEvents = await getEvents({ monthsOffset: offset, locale });
    setEvents([...events, ...additionalEvents]);
    setOffset(offset + numMonths);
  };

  return (
    <BasePage showHeader={false} title={t("agenda")} side>
      <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 py-3">
        <DistrictSelect />
        <OfficeHoursCheckbox />
      </div>
      <Upcoming events={events} />
      <LoadMore loadMore={loadMore} />
    </BasePage>
  );
}
