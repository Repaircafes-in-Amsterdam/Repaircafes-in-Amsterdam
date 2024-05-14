import DistrictSelect from "./DistrictSelect";
import OfficeHoursCheckbox from "./OfficeHoursCheckbox";
import Upcoming from "./Upcoming";
import getEvents from "./getEvents";
import { Event, EventGroup } from "./types";
import groupBy from "lodash/groupBy";

export const dynamic = "force-dynamic";

export default async function HomeServer() {
  const events: Event[] = getEvents();
  return <HomeClient events={events} />;
}

function isDuringOfficeHours(endHours: number, occurance: Date) {
  // Might as well be 19?
  const duringDaytime = endHours < 18;
  const day = occurance.getDay();
  const duringWorkweek = day > 0 && day < 6;
  return duringDaytime && duringWorkweek;
}

function HomeClient({ events }: { events: Event[] }) {
  // TODO Filter on just office hours
  // TODO Filter on district
  // if (district !== "any" && district !== rc.district) continue;

  const grouped = groupBy(events, (event: Event) => event.dateString);
  // console.log("grouped: ", grouped);
  const groupedEvents = Object.entries(grouped).map(([dateString, events]) => ({
    dateString,
    events,
  }));

  return (
    <div className="flex w-full max-w-body flex-col">
      <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 pt-3">
        <DistrictSelect />
        <OfficeHoursCheckbox />
      </div>
      <Upcoming groupedEvents={groupedEvents} />
    </div>
  );
}
