import { rrulestr } from "rrule";
import data from "@/data/data.json";
import getDateString from "@/app/utils/getDateString";

export default function useCafeData(slug: string) {
  const rcRaw = data.find((rc) => rc.slug === slug);
  if (!rcRaw) return null;
  const rc = {
    ...rcRaw,
    verified: (rcRaw.verified as unknown) === "TRUE",
  };

  const rule = rrulestr(`${rc.rrule};COUNT=1`);
  const nextDate = rule.all()[0];
  return { ...rc, next: getDateString(nextDate) };
}
