import { rrulestr } from "rrule";
import data from "@/data/data.json";
import { RC, Event } from "./types";
import getDateString from "./utils/getDateString";
import isClosed from "./utils/isClosed/isClosed";

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

export default function getEvents() {
  // Get all events organized until next month
  const events: Event[] = [];
  for (const rc of data as RC[]) {
    if (!rc.rrule) continue;

    const [hours, minutes] = rc.startTime.split(":").map(Number);
    const fullRRule = `${rc.rrule};BYHOUR=${hours};BYMINUTE=${minutes};BYSECOND=0`;

    const rule = rrulestr(fullRRule, {
      // tzid: TIME_ZONE,
    });
    const occurrences = rule.between(new Date(), getNextMonthDate());
    // occurances.tzid(TIME_ZONE);
    for (const occurrence of occurrences) {
      const event: Event = {
        date: occurrence,
        dateString: getDateString(occurrence),
        rc: {
          name: rc.name,
          slug: rc.slug,
          startTime: rc.startTime,
          endTime: rc.endTime,
          district: rc.district,
          verified: rc.verified,
        },
      };
      // filter using isClosed
      if (!isClosed(event.date, rc.closedRanges)) {
        events.push(event);
      }
    }
  }

  // Sort on date
  events.sort((a: Event, b: Event) => Number(a.date) - Number(b.date));

  return events;
}
