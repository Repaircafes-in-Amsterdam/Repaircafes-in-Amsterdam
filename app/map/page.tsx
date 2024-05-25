import { Metadata } from "next";
import ClientPage from "./page.client";
import getMapData from "../utils/getMapData";

export const metadata: Metadata = {
  title: "Kaart - Repair Cafes in Amsterdam",
  description: "Kaart van alle Repair Cafés in Amsterdam",
};

export default function Page() {
  const mapData = getMapData();
  return <ClientPage data={mapData} />;
}
