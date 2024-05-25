import getEvents from "./getEvents";
import { Event } from "./types";
import ClientPage from "./page.client";
import getMapData from "./utils/getMapData";

export const dynamic = "force-dynamic";

export default async function HomeServer() {
  const events: Event[] = getEvents();
  const mapData = getMapData();
  return <ClientPage events={events} mapData={mapData} />;
}
