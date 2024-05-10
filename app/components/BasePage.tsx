import { ReactNode } from "react";
import ChevronLeft from "@/app/icons/ChevronLeft.svg?react";
import BackButton from "./BackButton";

export default function BasePage({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="max-w-body relative flex w-full grow flex-col">
      <div className="sticky top-0 z-10 flex gap-3 bg-white p-3">
        <BackButton>
          <ChevronLeft />
        </BackButton>
        <h2 className="font-bold">{title}</h2>
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
