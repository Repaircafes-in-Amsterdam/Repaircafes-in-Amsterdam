import DetailsSection from "./DetailsSection";
import { Links } from "@/app/types";
import { Link } from "@/i18n/routing";
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
  // The otherLinks links are stored as arrays, but the other links are stored as strings, so to simplify rendering we normalize all links to arrays.
  const normalizedLinks = Object.fromEntries(
    Object.entries(links).map(([key, value]) => [
      key,
      Array.isArray(value) ? value : [value],
    ]),
  );
  const t = useTranslations();
  return (
    <DetailsSection title={title} className={className}>
      <ul className="flex flex-col gap-1">
        {Object.entries(normalizedLinks).map(([type, hrefs]) =>
          hrefs.map((href) => (
            <li key={type}>
              <Link
                href={href as string}
                className="mt-1 flex items-center gap-1"
                rel="noreferrer"
                target="_blank"
                data-ph-capture-attribute-link-type={type}
              >
                <ExternalLink className="shrink-0" aria-hidden />
                <div>
                  <strong className="font-medium">
                    {type === "orgPage"
                      ? t("repaircafe-page")
                      : type === "otherLinks"
                        ? href
                        : upperFirst(type)}
                  </strong>
                  {type !== "otherLinks" && ` ${t("of")} ${name}`}
                </div>
              </Link>
            </li>
          )),
        )}
      </ul>
    </DetailsSection>
  );
}
