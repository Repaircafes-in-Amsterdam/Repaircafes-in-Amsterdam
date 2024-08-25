import { Holiday } from "@/app/types";

export default function findHoliday(
  date: Date,
  holidays: Holiday[],
): Holiday | undefined {
  const dateTime = date.getTime();
  return holidays.find(
    (holiday) => dateTime >= holiday.startTime && dateTime < holiday.endTime,
  );
}
