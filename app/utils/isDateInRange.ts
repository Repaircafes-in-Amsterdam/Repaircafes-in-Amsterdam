import dayjs, { UnitType } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import parseDateRangePart from "./parseDateRangePart";

dayjs.extend(isBetween);

export default function isDateInRange(
  date: string | Date,
  range: string,
): boolean {
  const currentDate = dayjs(date);
  const currentYear = currentDate.year();

  const [start, end] = range.split(":");

  // TODO Throw eror if endGranularity !== startGranularity
  const [startDate, granularity] = parseDateRangePart(start, currentYear) || [];
  const [endDate] = end ? parseDateRangePart(end, currentYear) || [] : [];
  if (!startDate) {
    throw Error("Invalid start range: " + start);
  }

  if (startDate && endDate) {
    // Check if the range crosses the year boundary
    if (startDate.isAfter(endDate)) {
      const prevStartDate = startDate.year(startDate.year() - 1);
      const nextEndDate = endDate.year(endDate.year() + 1);
      return (
        currentDate.isBetween(
          prevStartDate,
          endDate,
          granularity as UnitType,
          "[]",
        ) ||
        currentDate.isBetween(
          startDate,
          nextEndDate,
          granularity as UnitType,
          "[]",
        )
      );
    } else {
      return currentDate.isBetween(
        startDate,
        endDate,
        granularity as UnitType,
        "[]",
      );
    }
  } else if (startDate) {
    return currentDate.isSame(startDate, granularity as UnitType);
  }

  return false;
}
