import getEvents from "@/app/actions/getEvents";
import MapServer from "@/app/components/map/MapServer";
import { setRequestLocale } from "next-intl/server";
import { Event } from "@/app/types";
import ListPanel from "./ListPanel";
import { Suspense } from "react";

const NUM_MONTHS = 1;
export const revalidate = 3600; // Rebuild every hour

export default async function Layout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }>,
) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  setRequestLocale(locale);
  const events: Event[] = await getEvents({ numMonths: NUM_MONTHS, locale });

  return (
    <>
      {/* <div className="w-full bg-[#ff0000]">Loading...</div> */}
      <Suspense fallback={<div className="w-full"></div>}>
        <ListPanel
          initialEvents={events}
          numMonths={NUM_MONTHS}
          locale={locale}
        />
      </Suspense>
      {children}
      <MapServer />
    </>
  );
}
