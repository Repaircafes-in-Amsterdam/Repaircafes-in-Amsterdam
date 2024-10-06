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
    startDate: `${festival.date}T${festival.startTime}:00`,
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
