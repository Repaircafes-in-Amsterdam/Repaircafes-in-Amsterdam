import type { Metadata } from "next";
import Link from "next/link";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Mail from "@/app/icons/Mail.svg?react";
import ExternalLink from "@/app/icons/ExternalLink.svg?react";
import BasePage from "@/app/components/BasePage";
import DetailsSection from "@/app/components/DetailsSection";
import data from "@/data/data.json";
import { RC, Event } from "@/app/types";
import JsonLd from "@/app/components/JsonLd";
import getCafeJsonLd from "./getCafeJsonLd";
import getEvents from "@/app/actions/getEvents";
import { BASE_URL } from "@/app/constants";
import Unconfirmed from "@/app/components/Unconfirmed";
import LinksSection from "@/app/components/LinksSection";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const rc = data.find((rc) => rc.slug === params.slug);
  const name = rc?.name || "Onbekend Repair Café";
  return {
    title: `${name} - Repair Cafes in Amsterdam`,
    alternates: {
      canonical: BASE_URL + "cafe/" + params.slug,
    },
  };
}

function getMapsLink(adres: string) {
  const fullAdres = `${adres} Amsterdam`;
  return `https://maps.google.com?q=${encodeURIComponent(fullAdres)}`;
}

export default async function CafeServer({
  params,
}: {
  params: { slug: string };
}) {
  const rc = data.find((rc) => rc.slug === params.slug) as RC;
  if (!rc) {
    return (
      <BasePage title="Onbekend Repair Café">
        <div className="p-3">
          Helaas, dit Repair Café is niet bekend bij ons.
        </div>
      </BasePage>
    );
  }

  const events: Event[] = await getEvents({ slug: rc.slug, numMonths: 3 });
  const next = events[0]?.dateString;

  return <CafeClient rc={rc} next={next} />;
}

function CafeClient({ rc, next }: { rc: RC; next: string }) {
  return (
    <BasePage title={rc.name} enableBackHome side>
      {!rc.verified && <Unconfirmed className="mb-1.5" />}
      <div className="flex grow flex-col gap-2 overflow-y-auto px-3 pb-3">
        <DetailsSection title="Geopend op">{rc.open}</DetailsSection>
        {next && (
          <DetailsSection title="Eerst volgende keer">{next}</DetailsSection>
        )}
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
            <ExternalLink className="shrink-0" />
            {rc.address}
          </Link>
        </DetailsSection>
        {rc.doRepair && (
          <DetailsSection title="Wij repareren">{rc.doRepair}</DetailsSection>
        )}
        {rc.dontRepair && (
          <DetailsSection title="Wij repareren geen">
            {rc.dontRepair}
          </DetailsSection>
        )}
        {rc.moreInfo && (
          <DetailsSection title="Meer informatie">{rc.moreInfo}</DetailsSection>
        )}
        {rc.email && (
          <DetailsSection title="Contact">
            <Link href={`mailto:${rc.email}`} className="flex gap-1">
              <Mail className="shrink-0" />
              {rc.email}
            </Link>
          </DetailsSection>
        )}
        {rc.links && (
          <LinksSection title="Links" links={rc.links} name={rc.name} />
        )}
        {rc.socials && (
          <LinksSection title="Sociaal" links={rc.socials} name={rc.name} />
        )}
        <Link href="/repaircafes" className="mt-2 flex gap-1">
          <ChevronRight className="shrink-0" />
          Lees meer over Repair Cafés
        </Link>
      </div>
      <JsonLd jsonLd={getCafeJsonLd(rc)} />
    </BasePage>
  );
}
