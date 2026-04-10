import type { CafeOccurrence } from "./getCafeOccurrences";

export const OFFICE_HOURS_BUCKET_IDS = ["yes", "no", "both"] as const;

export type OfficeHoursBucket = (typeof OFFICE_HOURS_BUCKET_IDS)[number];

export default function classifyOfficeHours(
  occurrences: CafeOccurrence[],
): OfficeHoursBucket {
  const hasOfficeHours = occurrences.some(
    (occurrence) => occurrence.duringOfficeHours,
  );
  const hasOutOfOfficeHours = occurrences.some(
    (occurrence) => !occurrence.duringOfficeHours,
  );

  if (hasOfficeHours && !hasOutOfOfficeHours) {
    return "yes";
  }

  if (!hasOfficeHours && hasOutOfOfficeHours) {
    return "no";
  }

  return "both";
}
