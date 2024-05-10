import Header from "@/app/components/Header";
import { ReactNode } from "react";

export default function DetailsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Header>{title}</Header>
      <div className="whitespace-pre-wrap">{children}</div>
    </div>
  );
}
