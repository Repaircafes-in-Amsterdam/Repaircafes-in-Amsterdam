import { RRule, rrulestr } from "rrule";
import type { RC } from "@/app/types";
import isEvening from "../isEvening";

export type CafeOccurrence = {
  time: number;
  date: Date;
  duringOfficeHours: boolean;
};

const SAMPLE_START = new Date(Date.UTC(2025, 0, 1, 0, 0, 0));
const SAMPLE_END = new Date(Date.UTC(2026, 0, 1, 0, 0, 0));

function getRuleOccurrences(rrule: string): Date[] {
  const parsedRule = rrulestr(rrule, { dtstart: SAMPLE_START });

  if (!(parsedRule instanceof RRule)) {
    return [];
  }

  return parsedRule.between(SAMPLE_START, SAMPLE_END, true);
}

function isDateDuringOfficeHours(date: Date, endTime: string) {
  const day = date.getUTCDay();
  const duringWorkweek = day > 0 && day < 6;
  return duringWorkweek && !isEvening(endTime);
}

export function dedupeOccurrences<T extends { time: number }>(
  occurrences: T[],
): T[] {
  return Array.from(
    new Map(
      occurrences.map((occurrence) => [occurrence.time, occurrence]),
    ).values(),
  ).sort((left, right) => left.time - right.time);
}

export function getOccurrenceDates(rrules: string[]): Date[] {
  return dedupeOccurrences(
    rrules.flatMap((rrule) =>
      getRuleOccurrences(rrule).map((date) => ({ time: date.getTime(), date })),
    ),
  ).map((occurrence) => occurrence.date);
}

export default function getCafeOccurrences(cafe: RC): CafeOccurrence[] {
  return dedupeOccurrences(
    cafe.rrule.flatMap((rrule, index) => {
      const endTime = cafe.endTime[index] || cafe.endTime[0];

      return getRuleOccurrences(rrule).map((date) => ({
        time: date.getTime(),
        date,
        duringOfficeHours: isDateDuringOfficeHours(date, endTime),
      }));
    }),
  );
}
