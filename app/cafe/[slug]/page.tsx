import Link from "next/link";
import useCafeData from "./useCafeData";
import ChevronLeft from "@/app/icons/ChevronLeft.svg?react";
import Mail from "@/app/icons/Mail.svg?react";
import ExternalLink from "@/app/icons/ExternalLink.svg?react";
import Warning from "@/app/icons/Warning.svg?react";

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
    <div className="flex min-h-px shrink flex-col">
      <Link href="/" className="flex gap-3 p-3">
        <ChevronLeft />
        <h2 className="font-bold">{rc.name}</h2>
      </Link>
      {!rc.verified && (
        <div className="mb-1.5 flex items-center gap-3 bg-orange p-3 text-blue-600">
          <Warning />
          De volgende informatie is nog niet bevestigd
        </div>
      )}
      <div className="grow overflow-y-auto px-3 pb-3">
        <h3 className="font-bold">Open op</h3>
        <p>{rc.open}</p>
        <h3 className="font-bold">Eerst volgende keer</h3>
        <p>{rc.next}</p>
        {rc.closed && (
          <>
            <h3 className="font-bold">Gesloten op</h3>
            <p>{rc.closed}</p>
          </>
        )}
        <h3 className="font-bold">Adres</h3>
        <Link
          href={getMapsLink(rc.address)}
          className="flex gap-1"
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink />
          {rc.address}
        </Link>
        {rc.email && (
          <>
            <h3 className="font-bold">Contact</h3>
            <Link href={`mailto:${rc.email}`} className="flex gap-1">
              <Mail />
              {rc.email}
            </Link>
          </>
        )}

        {rc.links && (
          <>
            <h3 className="font-bold">Links</h3>
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
      </div>
    </div>
  );
}
