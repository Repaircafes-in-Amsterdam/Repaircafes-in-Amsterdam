import { RC, Event } from "../types";
import holidaysData from "@/data/holidays-data.json";
import schoolHolidaysData from "@/data/school-holidays-data.json";
import isDuring from "./findHoliday";
import findHoliday from "./findHoliday";
import isDateInRange from "./isDateInRange";

const summerHolidaysData = schoolHolidaysData.filter(
  (holiday) => holiday.name === "Zomervakantie",
);

export default function eventFilter(event: Event, rc: RC) {
  const closed = rc.closed.toLowerCase();

  if (rc.closedRanges.some((range) => isDateInRange(event.date, range)))
    return false;

  if (isDuring(event.date, holidaysData)) return false;

  if (
    closed.includes("schoolvakantie") &&
    findHoliday(event.date, schoolHolidaysData)
  )
    return false;

  if (
    closed.includes("zomervakantie") &&
    findHoliday(event.date, summerHolidaysData)
  )
    return false;

  return true;
}
