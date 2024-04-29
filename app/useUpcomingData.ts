import { rrulestr } from "rrule";
import data from "@/data/data.json";
import { EventGroup, RC, Event } from "./types";
import useOfficeHours from "./useOfficeHours";
import useDistrict from "./useDistrict";
import getDateString from "./utils/getDateString";

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

function isDuringOfficeHours(endHours: number, occurance: Date) {
  // Might as well be 19?
  const duringDaytime = endHours < 18;
  const day = occurance.getDay();
  const duringWorkweek = day > 0 && day < 6;
  return duringDaytime && duringWorkweek;
}

export default function useUpcomingData() {
  const { value: justOfficeHoursRaw } = useOfficeHours();
  const justOfficeHours = justOfficeHoursRaw === "true";
  const { value: district } = useDistrict();

  // Get all events organized untill next month
  const events: Event[] = [];
  for (const rc of data as RC[]) {
    rc;
    if (!rc.rrule) continue;
    // Filter on district
    if (district !== "any" && district !== rc.district) continue;

    const [endHours] = rc.endTime.split(":").map(Number);
    const [hours, minutes] = rc.startTime.split(":").map(Number);
    const fullRRule = `${rc.rrule};BYHOUR=${hours};BYMINUTE=${minutes};BYSECOND=0`;

    const rule = rrulestr(fullRRule, {
      // tzid: TIME_ZONE,
    });
    const occurances = rule.between(new Date(), getNextMonthDate());
    // occurances.tzid(TIME_ZONE);
    for (const occurance of occurances) {
      // Filter on just office hours
      if (justOfficeHours && isDuringOfficeHours(endHours, occurance)) continue;
      const event: Event = {
        date: occurance,
        dateString: getDateString(occurance),
        rc,
      };
      events.push(event);
    }
  }

  // Sort on date
  events.sort((a: Event, b: Event) => Number(a.date) - Number(b.date));

  // Group by date
  const groupedEvents: EventGroup[] = [];
  for (const event of events) {
    let group = groupedEvents.find(
      (item) => item.dateString === event.dateString,
    );
    if (!group) {
      group = {
        dateString: event.dateString,
        events: [],
      };
      groupedEvents.push(group);
    }
    group.events.push(event);
  }
  return groupedEvents;
}
