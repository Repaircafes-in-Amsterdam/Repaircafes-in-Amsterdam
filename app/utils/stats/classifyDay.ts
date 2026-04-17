export const DAY_BUCKET_IDS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "multiple",
] as const;

export type DayBucket = (typeof DAY_BUCKET_IDS)[number];

const DATE_TO_DAY_BUCKET: Record<number, Exclude<DayBucket, "multiple">> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export default function classifyDay(dates: Date[]): DayBucket {
  const dayNumbers = new Set(dates.map((date) => date.getUTCDay()));

  if (dayNumbers.size !== 1) {
    return "multiple";
  }

  return DATE_TO_DAY_BUCKET[Array.from(dayNumbers)[0]];
}
