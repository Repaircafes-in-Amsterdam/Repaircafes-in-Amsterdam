"use client";
import Link from "next/link";
import { EventRC } from "@/app/types";
import useLinkPostfix from "@/app/utils/useLinkPostfix";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Warning from "@/app/icons/Warning.svg?react";

export default function ListItem({ rc }: { rc: EventRC }) {
  const linkPostfix = useLinkPostfix();
  return (
    <Link
      href={`cafe/${rc.slug}/events${linkPostfix}`}
      className="flex cursor-pointer items-center gap-3 bg-blue px-3  py-1.5 text-white [@media(hover:hover)]:hover:bg-orange [@media(hover:hover)]:hover:text-blue-600"
    >
      <div className="flex grow flex-col">
        <em className="font-semibold not-italic">{rc.name}</em>
        In {rc.district}
      </div>
      {!rc.verified && <Warning />}
      <ChevronRight />
    </Link>
  );
}
