import { Suspense, useMemo } from "react";
import data from "@/data/data.json";
import dynamic from "next/dynamic";
import MapPanel from "./MapPanel";

export default function Page() {
  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        ssr: false,
      }),
    [],
  );

  return (
    <div className="relative flex h-full w-full flex-col">
      <Map data={data} />
      <Suspense>
        <MapPanel />
      </Suspense>
    </div>
  );
}
