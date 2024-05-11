import { useMemo } from "react";
import BackButton from "../components/BackButton";
import Map from "./Map";
import ChevronLeft from "@/app/icons/ChevronLeft.svg?react";
import dynamic from "next/dynamic";

export default function Page() {
  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        // loading: () => <p>Loading</p>,
        ssr: false,
      }),
    [],
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex gap-3 bg-white p-3">
        <BackButton>
          <ChevronLeft />
        </BackButton>
        <h2 className="font-bold">Kaart</h2>
      </div>
      <div className="h-full w-full">
        <Map />
      </div>
    </div>
  );
}
