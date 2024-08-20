"use client";
import X from "@/app/icons/X.svg?react";
import useActive from "./useActive";
import { MapRC } from "@/app/types";
import Header from "@/app/components/Header";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Link from "next/link";
import DetailsSection from "@/app/components/DetailsSection";
import Unconfirmed from "@/app/components/Unconfirmed";
import { useTranslations } from "next-intl";

export default function MapPanel({
  active,
  onClose,
}: {
  active: MapRC;
  onClose: () => void;
}) {
  const t = useTranslations("map");
  return (
    <div className="absolute bottom-0 flex w-full flex-col gap-2 border-t-2 border-blue bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <Header className="text-lg">{active.name}</Header>
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      {!active.verified && <Unconfirmed className="-mx-3" />}
      <DetailsSection title={t("address")}>{active.address}</DetailsSection>
      <DetailsSection title={t("open")}>{active.open}</DetailsSection>
      <Link href={`/cafe/${active.slug}`} className="flex gap-1">
        <ChevronRight />
        {t("more-info")}
      </Link>
    </div>
  );
}
