import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import saveJSON from "./saveJSON.mjs";

const TIME_ZONE = "Europe/Amsterdam";
const TARGET_FORMAT = "YYYY-MM-DD";
const NUM_YEARS = 5;

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.tz.setDefault(TIME_ZONE);

const ramadans = [];
const hijriYear = await getCurrentHijriYear();

// get next 5 years of Ramadan data
for (let i = 0; i < NUM_YEARS; i++) {
  const year = hijriYear + i;
  const ramadan = await getRamadan(year);
  ramadans.push(ramadan);
}
saveJSON("ramadan-data.json", ramadans);

async function getCurrentHijriYear() {
  const url = "https://api.aladhan.com/v1/currentIslamicYear";
  const response = await fetch(url);
  const { data } = await response.json();
  return data;
}

function getDate(dayData) {
  const { date, format } = dayData.gregorian;
  return dayjs(date, format).format(TARGET_FORMAT);
}

async function getRamadan(hijriYear) {
  const ramadanMonth = 9;
  const url = `https://api.aladhan.com/v1/hToGCalendar/${ramadanMonth}/${hijriYear}`;

  const response = await fetch(url);
  const { data } = await response.json();
  if (!data) {
    throw new Error("Error getting Ramadan data");
  }
  const startDate = getDate(data[0]);
  const endDate = getDate(data.at(-1));
  return {
    startDate,
    endDate,
    startTime: new Date(startDate).getTime(),
    endTime: new Date(endDate).getTime(),
  };
}
