import data from "@/data/data.json";
import { MapRC, RC } from "../types";
import { Metadata } from "next";
import ClientPage from "./page.client";

export const metadata: Metadata = {
  title: "Kaart - Repair Cafes in Amsterdam",
  description: "Kaart van alle Repair Cafés in Amsterdam",
};

export default function Page() {
  const mapData: MapRC[] = data.map((rc: RC) => ({
    slug: rc.slug,
    coordinate: rc.coordinate,
    name: rc.name,
    open: rc.open,
    address: rc.address,
  }));
  return <ClientPage data={mapData} />;
}
