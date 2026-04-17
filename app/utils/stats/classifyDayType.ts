export const DAY_TYPE_BUCKET_IDS = ["workday", "weekend", "both"] as const;

export type DayTypeBucket = (typeof DAY_TYPE_BUCKET_IDS)[number];

export default function classifyDayType(dates: Date[]): DayTypeBucket {
  const dayNumbers = new Set(dates.map((date) => date.getUTCDay()));
  const hasWorkday = Array.from(dayNumbers).some((day) => day > 0 && day < 6);
  const hasWeekend = Array.from(dayNumbers).some(
    (day) => day === 0 || day === 6,
  );

  if (hasWorkday && !hasWeekend) {
    return "workday";
  }

  if (!hasWorkday && hasWeekend) {
    return "weekend";
  }

  return "both";
}
