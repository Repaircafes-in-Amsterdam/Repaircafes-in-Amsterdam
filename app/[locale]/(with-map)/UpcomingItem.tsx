import { Link } from "@/app/navigation";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Warning from "@/app/icons/Warning.svg?react";
import Calendar1 from "@/app/icons/Calendar1.svg?react";
import { Event } from "@/app/types";
import useHoverStore from "@/app/useHoverStore";
import classes from "@/app/utils/classes";
import useLinkPostfix from "@/app/utils/useLinkPostfix";
import { useTranslations } from "next-intl";

export default function UpcomingItem({ event }: { event: Event }) {
  const { slug, name, startTime, endTime, district, verified, festival } =
    event;
  const linkPostfix = useLinkPostfix();
  const isHovered = useHoverStore((state) => state.hoveredMarker === slug);
  const setHoveredRow = useHoverStore((state) => state.setHoveredRow);
  const t = useTranslations("agenda");
  const rootT = useTranslations();
  const linkBase = festival ? "/festival" : "/cafe";
  return (
    <Link
      href={`${linkBase}/${slug}${linkPostfix}`}
      className={classes(
        "flex cursor-pointer items-center gap-3  px-3 py-1.5 focus-visible:bg-orange focus-visible:text-blue-600 focus-visible:outline-none [@media(hover:hover)]:hover:bg-orange [@media(hover:hover)]:hover:text-blue-600",
        isHovered ? "bg-orange text-blue-600" : "bg-blue text-white",
      )}
      onFocus={() => setHoveredRow(slug)}
      onBlur={() => setHoveredRow("")}
      onPointerOver={(event) =>
        event.pointerType !== "touch" && setHoveredRow(slug)
      }
      onPointerOut={(event) =>
        event.pointerType !== "touch" && setHoveredRow("")
      }
    >
      <div className="flex grow flex-col">
        <em className="font-semibold not-italic">{name}</em>
        {startTime} - {endTime} {t("in")} {district}
      </div>
      {festival && <Calendar1 title={t("festival")} />}
      {!verified && <Warning title={rootT("unconfirmed")} />}
      <ChevronRight aria-hidden />
    </Link>
  );
}
