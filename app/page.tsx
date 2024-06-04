import getEvents from "./getEvents";
import ClientPage from "./page.client";
import { Event } from "./types";
import getMapData from "./utils/getMapData";

export const dynamic = "force-dynamic";

export default async function HomeServer() {
  const events: Event[] = getEvents();
  const mapData = getMapData();
  return <ClientPage events={events} mapData={mapData} />;
}
