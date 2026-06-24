"use client";
import { Link } from "@/i18n/routing";
import { EventRC } from "@/app/types";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Warning from "@/app/icons/Warning.svg?react";
import { useTranslations } from "next-intl";

export default function ListItem({ rc }: { rc: EventRC }) {
  const t = useTranslations("events");
  return (
    <Link
      href={`events/${rc.slug}`}
      className="bg-blue [@media(hover:hover)]:hover:bg-orange flex cursor-pointer items-center gap-3 px-3 py-1.5 text-white [@media(hover:hover)]:hover:text-blue-600"
    >
      <div className="flex grow flex-col">
        <em className="font-semibold not-italic">{rc.name}</em>
        {t("in")} {rc.district}
      </div>
      {!rc.verified && <Warning />}
      <ChevronRight />
    </Link>
  );
}
