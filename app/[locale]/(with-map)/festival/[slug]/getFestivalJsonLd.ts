import { TIME_ZONE } from "@/app/constants";
import { Festival } from "@/app/types";
import { Event, WithContext } from "schema-dts";

function getTime(partialTime: string): string {
  return `${partialTime}:00`;
}

function getOffsetForTimeZone(date: Date): string {
  // Since the timezone offset depends on daylight saving time we need to retrieve it dynamically
  // Uses workaround with Intl.DateTimeFormat
  // TODO Use Temporal when available
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    timeZoneName: "short",
  });
  const parts = formatter.formatToParts(date);
  const tzNamePart = parts.find((part) => part.type === "timeZoneName");
  if (!tzNamePart) return "";
  const offsetHours = tzNamePart.value.slice(-1);
  return `${offsetHours}:00`;
}

function getDateTime(date: string, time: string): string {
  const dateTime = new Date(`${date}T${getTime(time)}`);
  const offset = getOffsetForTimeZone(dateTime);
  const result = `${date}T${getTime(time)}+${offset}`;
  console.log("date time: ", result);
  return result;
}

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
      startTime: getTime(festival.startTime),
      endTime: getTime(festival.endTime),
      scheduleTimezone: "Europe/Amsterdam",
    },
    startDate: getDateTime(festival.dates[0], festival.startTime),
    endDate: getDateTime(
      festival.dates[festival.dates.length - 1],
      festival.endTime,
    ),
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
