import getEvents from "@/app/actions/getEvents";
import ClientPage from "./page.client";
import { Event } from "../types";

export const dynamic = "force-dynamic";

const NUM_MONTHS = 1;

export default async function HomeServer() {
  const events: Event[] = await getEvents({ numMonths: NUM_MONTHS });
  return <ClientPage initialEvents={events} numMonths={NUM_MONTHS} />;
}
