import { rrulestr } from "rrule";
import data from "@/data/data.json";
import { RC, Event } from "./types";
import getDateString from "./utils/getDateString";
import eventFilter from "./eventFilter";

const TIME_ZONE = "Europe/Amsterdam";
const LOCALE = "NL-nl";

function getNextMonthDate() {
  const date = new Date();
  const nextMonth = new Date(date);

  nextMonth.setMonth(date.getMonth() + 1);
  if (nextMonth.getMonth() !== (date.getMonth() + 1) % 12) {
    nextMonth.setDate(0);
  }

  return nextMonth;
}

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
  const startDate = new Date();
  const startTime = startDate.getTime();
  const endDate = getNextMonthDate();
  const endTime = endDate.getTime();

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
    const occurrences = rule.between(startDate, endDate);
    // occurances.tzid(TIME_ZONE);
    for (const occurrence of occurrences) {
      const event: Event = createEvent(rc, occurrence);

      if (eventFilter(event, rc)) {
        events.push(event);
      }
    }

    // add exceptions
    for (const exception of rc.exceptions) {
      const event: Event = createEvent(rc, new Date(exception));
      const exceptionStartDate = new Date(
        `${exception}T${rc.startTime}:00.000Z`,
      );
      const exceptionEndDate = new Date(`${exception}T${rc.endTime}:00.000Z`);
      const exceptionStartTime = exceptionStartDate.getTime();
      const exceptionEndTime = exceptionEndDate.getTime();
      if (exceptionEndTime >= startTime && exceptionStartTime <= endTime) {
        events.push(event);
      }
    }
  }

  // Sort on date
  events.sort((a: Event, b: Event) => Number(a.date) - Number(b.date));

  return events;
}
