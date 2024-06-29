import { RC, Event } from "../types";
import holidaysData from "@/data/holidays-data.json";
import schoolHolidaysData from "@/data/school-holidays-data.json";
import findHoliday from "./findHoliday";
import isDateInRange from "./isDateInRange";

export default function isClosed(event: Event, rc: RC) {
  const closed = rc.closed.toLowerCase();

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

  return "";
}
