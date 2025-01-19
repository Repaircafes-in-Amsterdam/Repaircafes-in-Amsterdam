"use client";
import X from "@/app/icons/X.svg?react";
import useActive from "./useActive";
import { MapRC } from "@/app/types";
import Header from "@/app/components/Header";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import { Link } from "@/i18n/routing";
import DetailsSection from "@/app/components/DetailsSection";
import Unconfirmed from "@/app/components/Unconfirmed";
import { useTranslations } from "next-intl";
import useMultilingual from "@/app/utils/useMultilingual";

export default function MapPanel({
  active,
  onClose,
}: {
  active: MapRC;
  onClose: () => void;
}) {
  const multilingual = useMultilingual();
  const t = useTranslations("map");
  return (
    <div className="absolute bottom-0 flex w-full flex-col gap-2 border-t-2 border-blue bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <Header className="text-lg">{active.name}</Header>
        <button onClick={onClose} aria-label={t("close")}>
          <X title={t("close")} />
        </button>
      </div>
      {!active.verified && <Unconfirmed className="-mx-3" />}
      <DetailsSection title={t("address")}>{active.address}</DetailsSection>
      <DetailsSection title={t("open")}>
        {multilingual(active.open)}
      </DetailsSection>
      <Link href={`/cafe/${active.slug}`} className="flex gap-1">
        <ChevronRight aria-hidden />
        {t("more-info")}
      </Link>
    </div>
  );
}
