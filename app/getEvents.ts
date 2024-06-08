import { rrulestr } from "rrule";
import data from "@/data/data.json";
import { RC, Event } from "./types";
import getDateString from "./utils/getDateString";
import eventFilter from "./eventFilter";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const TIME_ZONE = "Europe/Amsterdam";
// const LOCALE = "NL-nl";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Amsterdam");

function createEvent(
  rc: RC,
  date: Date,
  startTime: string,
  endTime: string,
): Event {
  return {
    date,
    dateString: getDateString(date),
    startTime,
    endTime,
    rc: {
      name: rc.name,
      slug: rc.slug,
      district: rc.district,
      verified: rc.verified,
    },
  };
}

// Get all events organized until next month
// If a slug is provided, only get events for that Repair Café
export default function getEvents({
  slug,
  months = 1,
}: {
  slug?: string;
  months?: number;
} = {}) {
  const events: Event[] = [];
  const startDate = dayjs().tz();
  const endDate = startDate.add(months, "month");

  const rcs = slug ? data.filter((rc) => rc.slug === slug) : data;

  for (const rc of rcs as RC[]) {
    if (!rc.rrule) continue;
    rc.rrule.forEach((rrule: string, index: number) => {
      const startTime = rc.startTime[index] || rc.startTime[0];
      const endTime = rc.endTime[index] || rc.endTime[0];
      const [hours, minutes] = startTime.split(":").map(Number);
      const fullRRule = `${rrule};BYHOUR=${hours};BYMINUTE=${minutes};BYSECOND=0`;

      const rule = rrulestr(fullRRule, {
        // tzid: TIME_ZONE,
      });
      const occurrences = rule.between(startDate.toDate(), endDate.toDate());
      // occurances.tzid(TIME_ZONE);
      for (const occurrence of occurrences) {
        const event: Event = createEvent(rc, occurrence, startTime, endTime);

        if (eventFilter(event, rc)) {
          events.push(event);
        }
      }
    });

    // add exceptions
    for (const exception of rc.exceptions) {
      const startTime = rc.startTime[0];
      const endTime = rc.endTime[0];
      const exceptionStartDate = dayjs.tz(`${exception} ${startTime}`);
      const exceptionEndDate = dayjs.tz(`${exception} ${endTime}`);
      if (
        exceptionEndDate.isAfter(startDate) &&
        exceptionStartDate.isBefore(endDate)
      ) {
        events.push(createEvent(rc, new Date(exception), startTime, endTime));
      }
    }
  }

  // Sort on date
  events.sort((a: Event, b: Event) => Number(a.date) - Number(b.date));

  return events;
}
