import { ReactNode } from "react";
import ChevronLeft from "@/app/icons/ChevronLeft.svg?react";
import BackButton from "./BackButton";
import classes from "../utils/classes";

export default function BasePage({
  title,
  children,
  className,
  enableBackHome = false,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  enableBackHome?: boolean;
}) {
  return (
    <div
      className={classes(
        "relative flex w-full max-w-body grow flex-col",
        className,
      )}
    >
      <div className="sticky top-0 z-10 flex gap-3 bg-white p-3">
        <BackButton className="md:hidden">
          <ChevronLeft />
        </BackButton>
        {enableBackHome && (
          <BackButton backHome className="hidden md:block">
            <ChevronLeft />
          </BackButton>
        )}
        <h1 className="font-bold">{title}</h1>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
