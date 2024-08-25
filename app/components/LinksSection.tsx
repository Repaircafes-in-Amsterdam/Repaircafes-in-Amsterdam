import DetailsSection from "./DetailsSection";
import { Links } from "@/app/types";
import { Link } from "@/app/navigation";
import ExternalLink from "@/app/icons/ExternalLink.svg?react";
import upperFirst from "@/app/utils/upperFirst";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  return (
    <DetailsSection title={title} className={className}>
      <ul className="flex flex-col gap-1">
        {Object.entries(links).map(([type, href]) => (
          <li key={type}>
            <Link
              href={href as string}
              className="mt-1 flex items-center gap-1"
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink className="shrink-0" />
              <div>
                <strong className="font-medium">
                  {type === "orgPage" ? t("repaircafe-page") : upperFirst(type)}
                </strong>
                {` ${t("of")} ${name}`}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </DetailsSection>
  );
}
