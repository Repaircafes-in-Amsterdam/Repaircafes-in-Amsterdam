import data from "@/data/holidays-data.json";

const holidays = data.map((holiday: any) => {
  const endDate = new Date(holiday.endDate);
  endDate.setDate(endDate.getDate() + 2);
  return {
    ...holiday,
    startDateTime: new Date(holiday.startDate).getTime(),
    endDateTime: endDate.getTime(),
  };
});

export default function isDuringHoliday(date: Date): boolean {
  const dateTime = date.getTime();
  return holidays.some(
    (holiday) =>
      dateTime >= holiday.startDateTime && dateTime <= holiday.endDateTime,
  );
}
