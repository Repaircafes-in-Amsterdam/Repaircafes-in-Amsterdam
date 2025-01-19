import Header from "@/app/components/Header";
import { ReactNode } from "react";
import Info from "@/app/icons/Info.svg?react";
import { Link } from "@/i18n/routing";

export default function DetailsSection({
  title,
  children,
  className,
  infoLink,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  infoLink?: string;
}) {
  return (
    <div className={className}>
      <Header className="flex items-center gap-1">
        {title}
        {infoLink && (
          <Link href={infoLink} target="_blank" rel="noopener noreferrer">
            <Info className="size-4 !stroke-[1.5]" />
          </Link>
        )}
      </Header>
      <div className="whitespace-pre-wrap">{children}</div>
    </div>
  );
}
