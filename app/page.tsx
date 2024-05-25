import getEvents from "./getEvents";
import { Event } from "./types";
import ClientPage from "./page.client";

export const dynamic = "force-dynamic";

export default async function HomeServer() {
  const events: Event[] = getEvents();
  return <ClientPage events={events} />;
}
