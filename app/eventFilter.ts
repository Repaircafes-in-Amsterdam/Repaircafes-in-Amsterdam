import { RC, Event } from "./types";
import isClosed from "./utils/isClosed/isClosed";
import holidaysData from "@/data/holidays-data.json";
import schoolHolidaysData from "@/data/school-holidays-data.json";
import isDuring from "./utils/findHoliday";
import findHoliday from "./utils/findHoliday";

const summerHolidaysData = schoolHolidaysData.filter(
  (holiday) => holiday.name === "Zomervakantie",
);

export default function eventFilter(event: Event, rc: RC) {
  const closed = rc.closed.toLowerCase();

  if (isClosed(event.date, rc.closedRanges)) return false;

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