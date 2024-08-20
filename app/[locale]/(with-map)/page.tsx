import getEvents from "@/app/actions/getEvents";
import ClientPage from "./page.client";
import { Event } from "@/app/types";
import { unstable_setRequestLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

const NUM_MONTHS = 1;

export default async function HomeServer({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const events: Event[] = await getEvents({ numMonths: NUM_MONTHS });
  return <ClientPage initialEvents={events} numMonths={NUM_MONTHS} />;
}
