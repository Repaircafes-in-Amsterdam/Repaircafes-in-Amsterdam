import { RRule, rrulestr } from "rrule";
import type { RC } from "@/app/types";

const BUCKET_IDS = ["weekly", "biweekly", "monthly", "other"] as const;

export type FrequencyBucket = (typeof BUCKET_IDS)[number];

type BUCKET = {
  id: FrequencyBucket;
  maxGapDays: number;
};

const BUCKETS: BUCKET[] = [
  { id: "other", maxGapDays: 6 },
  { id: "weekly", maxGapDays: 10.5 },
  { id: "biweekly", maxGapDays: 20.5 },
  { id: "monthly", maxGapDays: 40 },
  { id: "other", maxGapDays: Infinity },
];

export type FrequencyBucketCount = {
  id: FrequencyBucket;
  value: number;
};

const SAMPLE_START = new Date(Date.UTC(2025, 0, 1, 0, 0, 0));
const SAMPLE_END = new Date(Date.UTC(2026, 0, 1, 0, 0, 0));
// const WEEKLY_MAX_AVERAGE_GAP_DAYS = 10.5;
// const BIWEEKLY_MAX_AVERAGE_GAP_DAYS = 20.5;
// const MONTHLY_MAX_AVERAGE_GAP_DAYS = 40;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function getRuleOccurrences(rrule: string): Date[] {
  const parsedRule = rrulestr(rrule, { dtstart: SAMPLE_START });

  if (!(parsedRule instanceof RRule)) {
    return [];
  }

  return parsedRule.between(SAMPLE_START, SAMPLE_END, true);
}

function dedupeOccurrences(occurrences: Date[]): Date[] {
  return Array.from(
    new Map(
      occurrences.map((occurrence) => [occurrence.getTime(), occurrence]),
    ).values(),
  ).sort((left, right) => left.getTime() - right.getTime());
}

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

function classifyFrequencyOccurrences(occurrences: Date[]): FrequencyBucket {
  const averageGapDays = getAverageGapDays(occurrences);

  if (averageGapDays === null) {
    return "other";
  }

  for (const bucket of BUCKETS) {
    if (averageGapDays <= bucket.maxGapDays) {
      return bucket.id;
    }
  }

  return "other";
}

export function classifyRRuleFrequency(rrules: string[]): FrequencyBucket {
  const occurrences = dedupeOccurrences(
    rrules.flatMap((rrule) => getRuleOccurrences(rrule)),
  );

  return classifyFrequencyOccurrences(occurrences);
}

export default function getCafeFrequencyStats(
  cafes: RC[],
): FrequencyBucketCount[] {
  const counts = new Map<FrequencyBucket, number>(
    BUCKET_IDS.map((bucket) => [bucket, 0]),
  );

  for (const cafe of cafes) {
    const bucket = classifyRRuleFrequency(cafe.rrule);
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }

  return BUCKET_IDS.map((id) => ({
    id,
    value: counts.get(id) ?? 0,
  }));
}
