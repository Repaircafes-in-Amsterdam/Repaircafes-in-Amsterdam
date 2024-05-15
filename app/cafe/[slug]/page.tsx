import type { Metadata } from "next";
import Link from "next/link";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Mail from "@/app/icons/Mail.svg?react";
import ExternalLink from "@/app/icons/ExternalLink.svg?react";
import Warning from "@/app/icons/Warning.svg?react";
import BasePage from "@/app/components/BasePage";
import DetailsSection from "./DetailsSection";
import { rrulestr } from "rrule";
import data from "@/data/data.json";
import getDateString from "@/app/utils/getDateString";
import { RC } from "@/app/types";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const rc = data.find((rc) => rc.slug === params.slug);
  const name = rc?.name || "Onbekend Repair Café";
  return {
    title: `${name} - Repair Cafes in Amsterdam`,
  };
}

function mapLinkTypeToLabel(type: string) {
  switch (type) {
    case "orgPage":
      return "Repaircafe.org pagina";
    default:
      return type[0].toUpperCase() + type.slice(1);
  }
}

function getMapsLink(adres: string) {
  const fullAdres = `${adres} Amsterdam`;
  return `https://maps.google.com?q=${encodeURIComponent(fullAdres)}`;
}

export default function CafeServer({ params }: { params: { slug: string } }) {
  const rc = data.find((rc) => rc.slug === params.slug);
  if (!rc) return null;

  const rule = rrulestr(`${rc.rrule};COUNT=1`);
  const nextDate = rule.all()[0];
  const next = getDateString(nextDate);

  return <CafeClient rc={rc} next={next} />;
}

function CafeClient({ rc, next }: { rc: RC; next: string }) {
  if (!rc) {
    return (
      <h2 className="p-3 font-bold text-blue">
        Helaas, dit Repair Café is niet bekend bij ons.
      </h2>
    );
  }
  return (
    <BasePage title={rc.name}>
      {!rc.verified && (
        <div className="mb-1.5 flex items-center gap-3 bg-orange p-3 text-blue-600">
          <Warning />
          De volgende informatie is nog niet bevestigd
        </div>
      )}
      <div className="flex grow flex-col gap-1 overflow-y-auto px-3 pb-3">
        <DetailsSection title="Open op">{rc.open}</DetailsSection>
        <DetailsSection title="Eerst volgende keer">{next}</DetailsSection>
        {rc.closed && (
          <DetailsSection title="Gesloten op">{rc.closed}</DetailsSection>
        )}
        <DetailsSection title="Adres">
          <Link
            href={getMapsLink(rc.address)}
            className="flex gap-1"
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink />
            {rc.address}
          </Link>
        </DetailsSection>
        {rc.doRepair && (
          <DetailsSection title="Wij repareren">{rc.doRepair}</DetailsSection>
        )}
        {rc.dontRepair && (
          <DetailsSection title="Wij repareren niet">
            {rc.dontRepair}
          </DetailsSection>
        )}
        {rc.moreInfo && (
          <DetailsSection title="Meer informatie">{rc.moreInfo}</DetailsSection>
        )}
        {rc.email && (
          <DetailsSection title="Contact">
            <Link href={`mailto:${rc.email}`} className="flex gap-1">
              <Mail />
              {rc.email}
            </Link>
          </DetailsSection>
        )}
        {rc.links && (
          <DetailsSection title="Links">
            <ul>
              {Object.entries(rc.links).map(([type, href]) => (
                <li key={type}>
                  <Link
                    href={href as string}
                    className="flex gap-1"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLink />
                    {mapLinkTypeToLabel(type)}
                  </Link>
                </li>
              ))}
            </ul>
          </DetailsSection>
        )}
        <Link href="/repaircafes" className="flex gap-1">
          <ChevronRight />
          Lees meer over Repair Cafés
        </Link>
      </div>
    </BasePage>
  );
}
