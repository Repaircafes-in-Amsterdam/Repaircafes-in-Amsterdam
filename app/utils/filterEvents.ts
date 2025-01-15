import { Event } from "@/app/types";
import { defaultValue as defaultDistrict } from "../useDistrict";

export default function filterEvents(
  events: Event[],
  district: string,
  outsideOfficeHours: boolean,
) {
  return events
    .filter(
      (event) => district === defaultDistrict || district === event.district,
    )
    .filter(
      (event) =>
        !outsideOfficeHours ||
        (outsideOfficeHours && !isDuringOfficeHours(event)),
    );
}

function isDuringOfficeHours(event: Event) {
  const endTime = event.endTime;
  const [endHours] = endTime.split(":").map(Number);
  // Might as well be 19?
  const duringDaytime = endHours < 18;
  const day = event.date.getDay();
  const duringWorkweek = day > 0 && day < 6;
  return duringDaytime && duringWorkweek;
}
