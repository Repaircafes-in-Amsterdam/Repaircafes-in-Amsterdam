import data from "@/data/data.json";
import BasePage from "../components/BasePage";
import { Metadata } from "next";
import { BASE_URL } from "../constants";
import { EventRC } from "../types";
import ListItem from "./ListItem";

export const metadata: Metadata = {
  title: "Repair Cafés - Repair Cafes in Amsterdam",
  description: "Repair Cafés in Amsterdam",
  alternates: {
    canonical: BASE_URL + "events",
  },
};

export default function Page() {
  const rcs: EventRC[] = data.map((rc) => ({
    name: rc.name,
    slug: rc.slug,
    district: rc.district,
    verified: rc.verified,
  }));
  return (
    <BasePage title="Repair Cafés">
      {rcs.map((rc) => (
        <ListItem key={rc.slug} rc={rc} />
      ))}
    </BasePage>
  );
}
