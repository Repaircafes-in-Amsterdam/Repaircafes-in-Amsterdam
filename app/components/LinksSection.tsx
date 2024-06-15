import DetailsSection from "./DetailsSection";
import { Links } from "@/app/types";
import Link from "next/link";
import ExternalLink from "@/app/icons/ExternalLink.svg?react";
import upperFirst from "@/app/utils/upperFirst";

export default function LinksSection({
  title,
  className,
  links,
  name,
}: {
  title: string;
  className?: string;
  links: Links;
  name: string;
}) {
  return (
    <DetailsSection title={title} className={className}>
      <ul className="flex flex-col gap-1">
        {Object.entries(links).map(([type, href]) => (
          <li key={type}>
            <Link
              href={href as string}
              className="mt-1 flex gap-1"
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink className="shrink-0" />
              <strong className="font-medium">
                {type === "orgPage"
                  ? "Repaircafe.org pagina"
                  : upperFirst(type)}
              </strong>
              van {name}
            </Link>
          </li>
        ))}
      </ul>
    </DetailsSection>
  );
}
