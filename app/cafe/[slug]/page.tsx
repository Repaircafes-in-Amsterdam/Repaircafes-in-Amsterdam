import Link from "next/link";
import useCafeData from "./useCafeData";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Mail from "@/app/icons/Mail.svg?react";
import ExternalLink from "@/app/icons/ExternalLink.svg?react";
import Warning from "@/app/icons/Warning.svg?react";
import Header from "@/app/components/Header";
import BasePage from "@/app/components/BasePage";

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

export default function Page({ params }: { params: { slug: string } }) {
  const rc = useCafeData(params.slug);
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
      <div className="grow overflow-y-auto px-3 pb-3">
        <Header>Open op</Header>
        <p>{rc.open}</p>
        <Header>Eerst volgende keer</Header>
        <p>{rc.next}</p>
        {rc.closed && (
          <>
            <Header>Gesloten op</Header>
            <p>{rc.closed}</p>
          </>
        )}
        <Header>Adres</Header>
        <Link
          href={getMapsLink(rc.address)}
          className="flex gap-1"
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink />
          {rc.address}
        </Link>
        {rc.doRepair && (
          <>
            <Header>Wij repareren</Header>
            {rc.doRepair}
          </>
        )}
        {rc.dontRepair && (
          <>
            <Header>Wij repareren niet</Header>
            {rc.dontRepair}
          </>
        )}
        {rc.moreInfo && (
          <>
            <Header>Meer informatie</Header>
            <div className="whitespace-pre-wrap">{rc.moreInfo}</div>
          </>
        )}
        {rc.email && (
          <>
            <Header>Contact</Header>
            <Link href={`mailto:${rc.email}`} className="flex gap-1">
              <Mail />
              {rc.email}
            </Link>
          </>
        )}
        {rc.links && (
          <>
            <Header>Links</Header>
            <ul>
              {Object.entries(rc.links).map(([type, href]) => (
                <li key={type}>
                  <Link
                    href={href}
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
          </>
        )}
        <Link href="/repaircafes" className="flex gap-1">
          <ChevronRight />
          Lees meer over Repair Cafés
        </Link>
      </div>
    </BasePage>
  );
}
