import { rrulestr } from "rrule";
import { RC } from "../types";

// either on a weekend or after 18:00
export default function hasOutOfOfficeHours(rc: RC): boolean {
  return rc.rrule.some((rrule: string, index: number) => {
    const endTime = rc.endTime[index] || rc.endTime[0];
    const [endHours] = endTime.split(":").map(Number);

    const rule = rrulestr(rrule);
    const { byweekday } = rule.origOptions;
    if (!byweekday) return false;
    const byweekdays = byweekday instanceof Array ? byweekday : [byweekday];
    return byweekdays.some(
      (weekday: any) => weekday?.weekday > 4 || endHours >= 18,
    );
  });
}
