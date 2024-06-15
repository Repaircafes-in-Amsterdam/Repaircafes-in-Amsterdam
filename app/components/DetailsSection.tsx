import Header from "@/app/components/Header";
import { ReactNode } from "react";

export default function DetailsSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Header>{title}</Header>
      <div className="whitespace-pre-wrap">{children}</div>
    </div>
  );
}
