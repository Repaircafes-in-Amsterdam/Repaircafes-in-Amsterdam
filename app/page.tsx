import getEvents from "./getEvents";
import ClientPage from "./page.client";
import { Event } from "./types";

export const dynamic = "force-dynamic";

export default async function HomeServer() {
  const events: Event[] = getEvents();
  return <HomeClient events={events} />;
}

function HomeClient({ events }: { events: Event[] }) {
  return <ClientPage events={events} />;
}
