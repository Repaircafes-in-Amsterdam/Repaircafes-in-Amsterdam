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
import { TIME_ZONE } from "../constants";

// const LOCALE = "NL-nl";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(TIME_ZONE);

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
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const endTime = rc.endTime[index] || rc.endTime[0];
      const [endHours, endMinutes] = endTime.split(":").map(Number);
      const endHoursUTC = endHours - 1; // timezone offset
      // rrule using end time so we include already started events
      const fullRRule = `${rrule};BYHOUR=${endHoursUTC};BYMINUTE=${endMinutes};BYSECOND=0`;

      const rule = rrulestr(fullRRule, {
        tzid: TIME_ZONE,
      });
      const occurrences = rule.between(startDate.toDate(), endDate.toDate());
      for (const occurrence of occurrences) {
        // reset occurrence time to start time
        occurrence.setHours(startHours, startMinutes);
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
            date: exceptionStartDate.toDate(),
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
  if (!slug) {
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
        const festivalStartDate = dayjs.tz(`${rawDate}T${startTime}`);
        // using end time so we include already started festivals
        const festivalEndDate = dayjs.tz(`${rawDate}T${endTime}`);
        if (
          festivalEndDate.isAfter(startDate) &&
          festivalEndDate.isBefore(endDate)
        ) {
          events.push(
            createEvent({
              name,
              slug,
              district,
              festival: true,
              date: festivalStartDate.toDate(),
              startTime,
              endTime,
              locale,
            }),
          );
        }
      }
    }
  }

  // Sort on date
  events.sort((a: Event, b: Event) => Number(a.date) - Number(b.date));

  return events;
}
