import { rrulestr } from "rrule";
import { RC } from "@/app/types";
import isEvening from "./isEvening";

// either on a weekend or after 18:00
export default function hasOutOfOfficeHours(rc: RC): boolean {
  return rc.rrule.some((rrule: string, index: number) => {
    const endTime = rc.endTime[index] || rc.endTime[0];
    if (isEvening(endTime)) return true;

    const rule = rrulestr(rrule);
    const weekDay = rule.origOptions.byweekday;
    if (!weekDay) return true;
    const weekDays = weekDay instanceof Array ? weekDay : [weekDay];
    return weekDays.some((weekday: any) => weekday?.weekday > 4);
  });
}
