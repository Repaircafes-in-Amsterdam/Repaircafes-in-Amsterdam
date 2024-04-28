import DistrictSelect from "./DistrictSelect";
import OfficeHoursCheckbox from "./OfficeHoursCheckbox";
import Upcoming from "./Upcoming";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main className="flex flex-col text-blue grow shrink">
      <div className="grow overflow-y-auto h-px">
        <div className="px-3 pt-3 flex flex-wrap gap-x-3 gap-y-2">
          <DistrictSelect />
          <OfficeHoursCheckbox />
        </div>
        <Upcoming />
      </div>
    </main>
  );
}
