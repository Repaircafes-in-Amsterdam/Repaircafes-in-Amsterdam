import { ReactNode } from "react";
import ChevronLeft from "@/app/icons/ChevronLeft.svg?react";
import Link from "next/link";

export default function BasePage({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="max-w-body relative flex w-full grow flex-col">
      <Link href="/" className="sticky top-0 flex gap-3 bg-white p-3">
        <ChevronLeft />
        <h2 className="font-bold">{title}</h2>
      </Link>
      <div className="grow">{children}</div>
    </div>
  );
}
