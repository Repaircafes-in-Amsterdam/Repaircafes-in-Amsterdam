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

// Construct a date object for the occurrence date with the time from the RC data, in the correct timezone
function getOccurrenceDateTime(occurrence: Date, time: string) {
  console.log("occurrence: ", occurrence.toString());
  const year = occurrence.getUTCFullYear();
  const month = String(occurrence.getUTCMonth() + 1).padStart(2, "0");
  const day = String(occurrence.getUTCDate()).padStart(2, "0");

  const dateTime = dayjs.tz(`${year}-${month}-${day}T${time}`, TIME_ZONE);
  console.log("dateTime: ", dateTime.format());
  return dateTime;
}

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
  const startDate = dayjs().tz(TIME_ZONE).add(monthsOffset, "month");
  const endDate = startDate.add(numMonths, "month");
  const rangeStart = startDate.startOf("day");
  const rangeEnd = endDate.endOf("day");

  console.log("startDate: ", startDate.format());

  const rcs = slug ? cafesData.filter((rc) => rc.slug === slug) : cafesData;

  for (const rc of rcs as RC[]) {
    if (!rc.rrule) continue;
    rc.rrule.forEach((rrule: string, index: number) => {
      const startTime = rc.startTime[index] || rc.startTime[0];
      const endTime = rc.endTime[index] || rc.endTime[0];
      const fullRRule = `${rrule};BYHOUR=0;BYMINUTE=0;BYSECOND=0`;

      const rule = rrulestr(fullRRule, {
        // Start the rule a day earlier to ensure we include events that started before the range but end within the range
        dtstart: rangeStart.subtract(1, "day").toDate(),
        tzid: TIME_ZONE,
      });
      const occurrences = rule.between(
        rangeStart.toDate(),
        rangeEnd.toDate(),
        true,
      );
      for (const occurrence of occurrences) {
        const occurrenceStartDate = getOccurrenceDateTime(
          occurrence,
          startTime,
        );
        const occurrenceEndDate = getOccurrenceDateTime(occurrence, endTime);

        // Filter against the event's real Amsterdam end time so DST transitions are handled correctly.
        if (
          !occurrenceEndDate.isAfter(startDate) ||
          !occurrenceStartDate.isBefore(endDate)
        ) {
          continue;
        }

        const { name, slug, district, verified } = rc;
        const event: Event = createEvent({
          name,
          slug,
          district,
          verified,
          date: occurrenceStartDate.toDate(),
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
