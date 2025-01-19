import getEvents from "@/app/actions/getEvents";
import MapServer from "@/app/components/map/MapServer";
import { setRequestLocale } from "next-intl/server";
import { Event } from "@/app/types";
import ListPanel from "./ListPanel";

const NUM_MONTHS = 1;
export const dynamic = "force-dynamic";

export default async function Layout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  setRequestLocale(locale);
  const events: Event[] = await getEvents({ numMonths: NUM_MONTHS, locale });
  return (
    <>
      <ListPanel
        initialEvents={events}
        numMonths={NUM_MONTHS}
        locale={locale}
      />
      {children}
      <MapServer />
    </>
  );
}
