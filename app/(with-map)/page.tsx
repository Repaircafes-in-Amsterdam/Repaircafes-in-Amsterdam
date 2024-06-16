import getEvents from "@/app/actions/getEvents";
import ClientPage from "./page.client";
import { Event } from "../types";

export const dynamic = "force-dynamic";

export default async function HomeServer() {
  const events: Event[] = await getEvents();
  return <ClientPage initialEvents={events} />;
}
