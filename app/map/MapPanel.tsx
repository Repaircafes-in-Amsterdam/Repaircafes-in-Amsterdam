"use client";
import data from "@/data/data.json";
import X from "@/app/icons/X.svg?react";
import useActive from "./useActive";
import { RC } from "../types";
import Header from "../components/Header";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Link from "next/link";
import DetailsSection from "../cafe/[slug]/DetailsSection";

export default function MapPanel() {
  const { value, setValue } = useActive();
  const active: RC | undefined = data.find((rc) => rc.slug === value);
  if (!active) return null;
  return (
    <div className="absolute bottom-0 w-full border-t-2 border-blue bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <Header className="text-lg">{active.name}</Header>
        <button onClick={() => setValue("")}>
          <X />
        </button>
      </div>
      <DetailsSection title="Adres">{active.address}</DetailsSection>
      <DetailsSection title="Open op">{active.open}</DetailsSection>
      <Link href={`/cafe/${active.slug}`} className="flex gap-1">
        <ChevronRight />
        Meer info
      </Link>
    </div>
  );
}
