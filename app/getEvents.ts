import { rrulestr } from "rrule";
import data from "@/data/data.json";
import { RC, Event } from "./types";
import getDateString from "./utils/getDateString";
import eventFilter from "./eventFilter";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const TIME_ZONE = "Europe/Amsterdam";
const LOCALE = "NL-nl";

dayjs.extend(utc);
dayjs.extend(timezone);

function createEvent(rc: RC, date: Date): Event {
  return {
    date,
    dateString: getDateString(date),
    rc: {
      name: rc.name,
      slug: rc.slug,
      startTime: rc.startTime,
      endTime: rc.endTime,
      district: rc.district,
      verified: rc.verified,
    },
  };
}

// Get all events organized until next month
// If a slug is provided, only get events for that Repair Café
export default function getEvents(
  repairCafeSlug: string | undefined = undefined,
) {
  const events: Event[] = [];
  const startDate = dayjs().tz("Europe/Amsterdam");
  const endDate = startDate.add(1, "month");

  const rcs = repairCafeSlug
    ? data.filter((rc) => rc.slug === repairCafeSlug)
    : data;

  for (const rc of rcs as RC[]) {
    if (!rc.rrule) continue;

    const [hours, minutes] = rc.startTime.split(":").map(Number);
    const fullRRule = `${rc.rrule};BYHOUR=${hours};BYMINUTE=${minutes};BYSECOND=0`;

    const rule = rrulestr(fullRRule, {
      // tzid: TIME_ZONE,
    });
    const occurrences = rule.between(startDate.toDate(), endDate.toDate());
    // occurances.tzid(TIME_ZONE);
    for (const occurrence of occurrences) {
      const event: Event = createEvent(rc, occurrence);

      if (eventFilter(event, rc)) {
        events.push(event);
      }
    }

    // add exceptions
    for (const exception of rc.exceptions) {
      const exceptionStartDate = dayjs.tz(
        `${exception} ${rc.startTime}`,
        TIME_ZONE,
      );
      const exceptionEndDate = dayjs.tz(
        `${exception} ${rc.endTime}`,
        TIME_ZONE,
      );
      if (
        exceptionEndDate.isAfter(startDate) &&
        exceptionStartDate.isBefore(endDate)
      ) {
        events.push(createEvent(rc, new Date(exception)));
      }
    }
  }

  // Sort on date
  events.sort((a: Event, b: Event) => Number(a.date) - Number(b.date));

  return events;
}
