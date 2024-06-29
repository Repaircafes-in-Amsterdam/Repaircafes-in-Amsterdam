import { BASE_URL } from "@/app/constants";
import { Metadata } from "next";
import data from "@/data/data.json";
import { RC, Event } from "@/app/types";
import BasePage from "@/app/components/BasePage";
import getEvents from "@/app/actions/getEvents";
import EventsClient from "./page.client";

const NUM_MONTHS = 12;

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const rc = data.find((rc) => rc.slug === params.slug);
  const name = rc?.name || "Onbekend Repair Café";
  return {
    title: `${name} events - Repair Cafes in Amsterdam`,
    alternates: {
      canonical: BASE_URL + "cafe/" + params.slug + "/events",
    },
  };
}

export default async function EventsServer({
  params,
}: {
  params: { slug: string };
}) {
  const rc = data.find((rc) => rc.slug === params.slug) as RC;
  if (!rc) {
    return (
      <BasePage title="Onbekend Repair Café">
        <div className="p-3">
          Helaas, dit Repair Café is niet bekend bij ons.
        </div>
      </BasePage>
    );
  }

  const events: Event[] = await getEvents({
    slug: rc.slug,
    numMonths: NUM_MONTHS,
    debug: true,
  });

  return <EventsClient rc={rc} initialEvents={events} numMonths={NUM_MONTHS} />;
}
