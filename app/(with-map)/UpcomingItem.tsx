import Link from "next/link";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Warning from "@/app/icons/Warning.svg?react";
import { EventRC } from "../types";
import useHoverStore from "../useHoverStore";
import classes from "../utils/classes";

export default function UpcomingItem({
  startTime,
  endTime,
  rc,
}: {
  startTime: string;
  endTime: string;
  rc: EventRC;
}) {
  const { hoveredSlug, setHoveredSlug } = useHoverStore();
  const isHovered = hoveredSlug === rc.slug;
  return (
    <Link
      href={`cafe/${rc.slug}`}
      className={classes(
        "flex cursor-pointer items-center gap-3  px-3 py-1.5 [@media(hover:hover)]:hover:bg-orange [@media(hover:hover)]:hover:text-blue-600",
        isHovered ? "bg-orange text-blue-600" : "bg-blue text-white",
      )}
      onPointerOver={(event) =>
        event.pointerType !== "touch" && setHoveredSlug(rc.slug)
      }
      onPointerOut={(event) =>
        event.pointerType !== "touch" && setHoveredSlug("")
      }
    >
      <div className="flex grow flex-col">
        <em className="font-semibold not-italic">{rc.name}</em>
        {startTime} - {endTime} in {rc.district}
      </div>
      {!rc.verified && <Warning />}
      <ChevronRight />
    </Link>
  );
}
