import type { RC } from "@/app/types";
import classifyDay, { type DayBucket } from "./classifyDay";
import classifyDayType, { type DayTypeBucket } from "./classifyDayType";
import { classifyFrequency, type FrequencyBucket } from "./classifyFrequency";
import classifyOfficeHours, {
  type OfficeHoursBucket,
} from "./classifyOfficeHours";
import getCafeOccurrences from "./getCafeOccurrences";

export type CafeStats = {
  frequency: FrequencyBucket;
  day: DayBucket;
  dayType: DayTypeBucket;
  officeHours: OfficeHoursBucket;
  district: string;
};

export default function getCafeStats(cafe: RC): CafeStats | null {
  const occurrences = getCafeOccurrences(cafe);

  if (occurrences.length === 0) {
    return null;
  }

  const dates = occurrences.map((occurrence) => occurrence.date);

  return {
    frequency: classifyFrequency(dates),
    day: classifyDay(dates),
    dayType: classifyDayType(dates),
    officeHours: classifyOfficeHours(occurrences),
    district: cafe.district,
  };
}

export function getCafesStats(cafes: RC[]): CafeStats[] {
  return cafes
    .map((cafe) => getCafeStats(cafe))
    .filter((stats): stats is CafeStats => stats !== null);
}
