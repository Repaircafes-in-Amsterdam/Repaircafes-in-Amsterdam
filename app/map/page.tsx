"use client";
import { Suspense, useMemo } from "react";
import BackButton from "../components/BackButton";
import data from "@/data/data.json";
import ChevronLeft from "@/app/icons/ChevronLeft.svg?react";
import dynamic from "next/dynamic";
import MapPanel from "./MapPanel";

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
      <div className="relative h-full w-full">
        <Map data={data} />
        <Suspense>
          <MapPanel />
        </Suspense>
      </div>
    </div>
  );
}
