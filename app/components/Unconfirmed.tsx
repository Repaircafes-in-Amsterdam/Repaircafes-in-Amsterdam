import Warning from "@/app/icons/Warning.svg?react";
import classes from "../classes";

export default function Unconfirmed({ className }: { className?: string }) {
  return (
    <div
      className={classes(
        "flex items-center gap-3 bg-orange p-3 font-medium text-white",
        className,
      )}
    >
      <Warning className="shrink-0" />
      De volgende informatie is nog niet bevestigd
    </div>
  );
}
