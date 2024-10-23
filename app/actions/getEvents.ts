"use server";
import { rrulestr } from "rrule";
import cafesData from "@/data/data/cafes.json";
import festivalsData from "@/data/data/festivals.json";
import { RC, Event, Festival } from "@/app/types";
import getDateString from "@/app/utils/getDateString";
import isClosed from "@/app/utils/isClosed";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

const TIME_ZONE = "Europe/Amsterdam";
// const LOCALE = "NL-nl";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Amsterdam");

function createEvent({
  name,
  slug,
  district,
  verified = true,
  festival = false,
  date,
  startTime,
  endTime,
  closedCause,
  exceptionCause,
  locale,
}: {
  name: string;
  slug: string;
  district: string;
  verified?: boolean;
  festival?: boolean;
  date: Date;
  startTime: string;
  endTime: string;
  closedCause?: string;
  exceptionCause?: string;
  locale: string;
}): Event {
  return {
    date,
    dateString: getDateString(date, locale),
    startTime,
    endTime,
    closedCause,
    exceptionCause,
    name: name,
    slug: slug,
    district: district,
    verified: verified,
    festival: festival,
  };
}

// Get all events organized until next month
// If a slug is provided, only get events for that Repair Café
export default async function getEvents({
  slug,
  monthsOffset = 0,
  numMonths = 1,
  debug = false,
  locale,
}: {
  slug?: string;
  monthsOffset?: number;
  numMonths?: number;
  debug?: boolean;
  locale: string;
}) {
  const events: Event[] = [];
  const startDate = dayjs().tz().add(monthsOffset, "month");
  const endDate = startDate.add(numMonths, "month");

  const rcs = slug ? cafesData.filter((rc) => rc.slug === slug) : cafesData;

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
        const { name, slug, district, verified } = rc;
        const event: Event = createEvent({
          name,
          slug,
          district,
          verified,
          date: occurrence,
          startTime,
          endTime,
          locale,
        });

        const closedCause = isClosed(event, rc);
        if (debug && closedCause) {
          event.closedCause = closedCause;
        }
        if (!closedCause || debug) {
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
        const { name, slug, district, verified } = rc;
        events.push(
          createEvent({
            name,
            slug,
            district,
            verified,
            date: new Date(exception),
            startTime,
            endTime,
            exceptionCause: exception,
            locale,
          }),
        );
      }
    }
  }

  // Add festivals
  for (const festival of festivalsData as Festival[]) {
    const {
      name,
      slug,
      district,
      dates: rawDates,
      startTime,
      endTime,
    } = festival;
    for (const rawDate of rawDates) {
      const date = dayjs.tz(`${rawDate}T${startTime}`);
      if (date.isAfter(startDate) && date.isBefore(endDate)) {
        events.push(
          createEvent({
            name,
            slug,
            district,
            festival: true,
            date: new Date(`${rawDate}T${startTime}`),
            startTime,
            endTime,
            locale,
          }),
        );
      }
    }
  }

  // Sort on date
  events.sort((a: Event, b: Event) => Number(a.date) - Number(b.date));

  return events;
}
