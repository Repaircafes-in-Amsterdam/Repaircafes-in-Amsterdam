import data from "@/data/school-holidays-data.json";

const holidays = data.map((holiday: any) => {
  const endDate = new Date(holiday.endDate);
  endDate.setDate(endDate.getDate() + 1);
  return {
    ...holiday,
    startDateTime: new Date(holiday.startDate).getTime(),
    endDateTime: endDate.getTime(),
  };
});

export default function isDuringSchoolHoliday(date: Date): boolean {
  const dateTime = date.getTime();
  return holidays.some(
    (holiday) =>
      dateTime >= holiday.startDateTime && dateTime <= holiday.endDateTime,
  );
}
