"use client";
import X from "@/app/icons/X.svg?react";
import useActive from "./useActive";
import { MapRC } from "../types";
import Header from "../components/Header";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Link from "next/link";
import DetailsSection from "../cafe/[slug]/DetailsSection";
import Warning from "@/app/icons/Warning.svg?react";

export default function MapPanel({
  active,
  onClose,
}: {
  active: MapRC;
  onClose: () => void;
}) {
  return (
    <div className="absolute bottom-0 flex w-full flex-col gap-2 border-t-2 border-blue bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <Header className="text-lg">{active.name}</Header>
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      {!active.verified && (
        <div className="-mx-3 flex items-center gap-3 bg-orange p-3 text-blue-600">
          <Warning />
          De volgende informatie is nog niet bevestigd
        </div>
      )}
      <DetailsSection title="Adres">{active.address}</DetailsSection>
      <DetailsSection title="Open op">{active.open}</DetailsSection>
      <Link href={`/cafe/${active.slug}`} className="flex gap-1">
        <ChevronRight />
        Meer info
      </Link>
    </div>
  );
}
