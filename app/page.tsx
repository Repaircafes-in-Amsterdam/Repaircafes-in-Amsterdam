import DistrictSelect from "./DistrictSelect";
import OfficeHoursCheckbox from "./OfficeHoursCheckbox";
import Upcoming from "./Upcoming";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main className="py-2 flex flex-col max-h-screen text-blue">
      <h1 className="text-xl font-bold px-4 mb-4">
        Aankomende Repair Cafés in Amsterdam
      </h1>
      <div className="grow overflow-y-auto">
        <div className="px-4 mb-4 flex flex-wrap gap-x-4 gap-y-2">
          <DistrictSelect />
          <OfficeHoursCheckbox />
        </div>
        <Upcoming />
      </div>
    </main>
  );
}
