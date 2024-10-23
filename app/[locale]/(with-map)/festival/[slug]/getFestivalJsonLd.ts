import { Festival } from "@/app/types";
import { Event, WithContext } from "schema-dts";

export default function getFestivalJsonLd(
  festival: Festival,
  locale: string,
): WithContext<Event> {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: festival.name,
    description: festival.description[locale],
    eventSchedule: {
      "@type": "Schedule",
      startDate: festival.dates[0],
      endDate: festival.dates[festival.dates.length - 1],
      startTime: `${festival.startTime}:00`,
      endTime: `${festival.endTime}:00`,
      scheduleTimezone: "Europe/Amsterdam",
    },
    location: {
      "@type": "Place",
      name: festival.location,
      address: {
        "@type": "PostalAddress",
        streetAddress: festival.address,
        addressLocality: festival.district,
        addressCountry: "NL",
      },
    },
    url: festival.link,
  };
}
