import DistrictSelect from "./DistrictSelect";
import OfficeHoursCheckbox from "./OfficeHoursCheckbox";
import Upcoming from "./Upcoming";
import getEvents from "./getEvents";
import { Event } from "./types";

export const dynamic = "force-dynamic";

export default async function HomeServer() {
  const events: Event[] = getEvents();
  return <HomeClient events={events} />;
}

function HomeClient({ events }: { events: Event[] }) {
  return (
    <div className="flex w-full max-w-body flex-col">
      <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 py-3">
        <DistrictSelect />
        <OfficeHoursCheckbox />
      </div>
      <Upcoming events={events} />
    </div>
  );
}
