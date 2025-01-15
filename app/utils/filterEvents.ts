import districtFilter from "./districtFilter";
import isEvening from "./isEvening";
import { Event } from "@/app/types";

export default function filterEvents(
  events: Event[],
  district: string,
  outsideOfficeHours: boolean,
) {
  return events
    .filter(districtFilter(district))
    .filter(officeHoursFilter(outsideOfficeHours));
}

// when outsideOfficeHours is true filter on events that are outside office hours
function officeHoursFilter(outsideOfficeHours: boolean) {
  return (event: Event) =>
    !outsideOfficeHours || (outsideOfficeHours && !isDuringOfficeHours(event));
}

function isDuringOfficeHours(event: Event) {
  const duringDaytime = !isEvening(event.endTime);
  const day = event.date.getDay();
  const duringWorkweek = day > 0 && day < 6;
  return duringDaytime && duringWorkweek;
}
