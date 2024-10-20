import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Header from "./Header";

export default function Summary({ children }: { children: string }) {
  return (
    <summary className="-mx-3 flex cursor-pointer gap-2 bg-blue px-3 py-2 text-white [&::-webkit-details-marker]:hidden [&::marker]:hidden">
      <ChevronRight
        role="presentation"
        className="shrink-0 transition-transform duration-100 ease-out group-open:rotate-90"
        aria-hidden
      />
      <Header className="m-0 text-white">{children}</Header>
    </summary>
  );
}
