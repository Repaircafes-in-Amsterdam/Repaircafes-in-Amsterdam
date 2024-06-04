import { Suspense } from "react";
import { Metadata } from "next";
import { BASE_URL } from "../constants";
import getMapData from "../utils/getMapData";
import ClientPage from "./page.client";

export const metadata: Metadata = {
  title: "Kaart - Repair Cafes in Amsterdam",
  description: "Kaart van alle Repair Cafés in Amsterdam",
  alternates: {
    canonical: BASE_URL + "map",
  },
};

export default function Page() {
  const mapData = getMapData();
  return (
    <Suspense>
      <ClientPage data={mapData} />
    </Suspense>
  );
}
