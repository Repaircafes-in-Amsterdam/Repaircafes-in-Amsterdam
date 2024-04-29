import DistrictSelect from "./DistrictSelect";
import OfficeHoursCheckbox from "./OfficeHoursCheckbox";
import Upcoming from "./Upcoming";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main className="flex shrink grow flex-col text-blue">
      <div className="h-px grow overflow-y-auto">
        <div className="flex flex-wrap gap-x-3 gap-y-2 px-3 pt-3">
          <DistrictSelect />
          <OfficeHoursCheckbox />
        </div>
        <Upcoming />
      </div>
    </main>
  );
}
