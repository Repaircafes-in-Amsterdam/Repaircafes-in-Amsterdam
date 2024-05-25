import { Metadata } from "next";
import ClientPage from "./page.client";
import getMapData from "../utils/getMapData";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Kaart - Repair Cafes in Amsterdam",
  description: "Kaart van alle Repair Cafés in Amsterdam",
};

export default function Page() {
  const mapData = getMapData();
  return (
    <Suspense>
      <ClientPage data={mapData} />
    </Suspense>
  );
}
