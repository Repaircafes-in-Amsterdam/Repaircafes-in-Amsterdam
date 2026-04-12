import { getOccurrenceDates } from "./getCafeOccurrences";

export const FREQUENCY_BUCKET_IDS = [
  "weekly",
  "biweekly",
  "monthly",
  "other",
] as const;

export type FrequencyBucket = (typeof FREQUENCY_BUCKET_IDS)[number];

type FrequencyThreshold = {
  id: FrequencyBucket;
  maxGapDays: number;
};

const FREQUENCY_BUCKETS: FrequencyThreshold[] = [
  { id: "other", maxGapDays: 6 },
  { id: "weekly", maxGapDays: 10.5 },
  { id: "biweekly", maxGapDays: 20.5 },
  { id: "monthly", maxGapDays: 40 },
  { id: "other", maxGapDays: Infinity },
];

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function getAverageGapDays(occurrences: Date[]): number | null {
  if (occurrences.length < 2) {
    return null;
  }

  let totalGapDays = 0;

  for (let index = 1; index < occurrences.length; index += 1) {
    totalGapDays +=
      (occurrences[index].getTime() - occurrences[index - 1].getTime()) /
      MILLISECONDS_PER_DAY;
  }

  return totalGapDays / (occurrences.length - 1);
}

export function classifyFrequency(dates: Date[]): FrequencyBucket {
  const averageGapDays = getAverageGapDays(dates);

  if (averageGapDays === null) {
    return "other";
  }

  for (const bucket of FREQUENCY_BUCKETS) {
    if (averageGapDays <= bucket.maxGapDays) {
      return bucket.id;
    }
  }

  return "other";
}

export default function classifyRRuleFrequency(
  rrules: string[],
): FrequencyBucket {
  return classifyFrequency(getOccurrenceDates(rrules));
}
