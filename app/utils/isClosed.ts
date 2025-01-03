import { RC, Event } from "@/app/types";
import holidaysData from "@/data/data/holidays-data.json";
import schoolHolidaysData from "@/data/data/school-holidays-data.json";
import ramadanData from "@/data/data/ramadan-data.json";
import findHoliday from "./findHoliday";
import isDateInRange from "./isDateInRange";

const hardcodedClosedRanges = ["12-31"];

// TODO Translate isClosed reasons?
export default function isClosed(event: Event, rc: RC) {
  const closed = rc.closed.nl.toLowerCase();

  for (const closedRange of hardcodedClosedRanges) {
    if (isDateInRange(event.date, closedRange))
      return "gesloten op: " + closedRange;
  }

  for (const closedRange of rc.closedRanges) {
    if (isDateInRange(event.date, closedRange))
      return "gesloten op: " + closedRange;
  }

  const holiday = findHoliday(event.date, holidaysData);
  if (holiday) return "tijdens vakantie: " + holiday.name;

  if (closed.includes("schoolvakantie")) {
    const schoolHoliday = findHoliday(event.date, schoolHolidaysData);
    if (schoolHoliday) return "tijdens schoolvakantie: " + schoolHoliday.name;
  }

  for (const schoolHoliday of schoolHolidaysData) {
    if (
      closed.includes(schoolHoliday.name.toLowerCase()) &&
      findHoliday(event.date, [schoolHoliday])
    ) {
      return "tijdens schoolvakantie: " + schoolHoliday.name;
    }
  }

  if (closed.includes("ramadan")) {
    if (findHoliday(event.date, ramadanData)) {
      return "tijdens Ramadan";
    }
  }

  return "";
}
