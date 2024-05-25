import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

dayjs.tz.setDefault("Europe/Amsterdam");

const formatsPerGranularity = {
  day: ["YYYY-MM-DD"],
  month: ["YYYY-MM"],
  year: ["YYYY"],
};

export default function parseDateRangePart(
  part: string,
  year: number,
): [dayjs.Dayjs, string] | null {
  for (const [granularity, formats] of Object.entries(formatsPerGranularity)) {
    for (const format of formats) {
      // Check both the part and the part with the year
      for (const finalPart of [part, `${year}-${part}`]) {
        const date = dayjs(finalPart, format, true).tz();
        if (date.isValid()) {
          return [date, granularity];
        }
      }
    }
  }
  return null;
}
