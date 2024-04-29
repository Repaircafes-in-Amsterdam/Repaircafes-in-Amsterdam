import Link from "next/link";
import { ChevronLeft, SquareArrowOutUpRight, Mail } from "lucide-react";
import useCafeData from "./useCafeData";

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
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAdres
  )}`;
}

export default function Page({ params }: { params: { slug: string } }) {
  const rc = useCafeData(params.slug);
  if (!rc) {
    return (
      <h2 className="font-bold text-blue p-3">
        Helaas, dit Repair Café is niet bekend bij ons.
      </h2>
    );
  }
  return (
    <main className="flex flex-col text-blue grow shrink">
      <Link href="/" className="p-3 flex gap-3">
        <ChevronLeft />
        <h2 className="font-bold">{rc.name}</h2>
      </Link>
      <div className="grow overflow-y-auto h-px px-3">
        <h3 className="font-bold">Open</h3>
        <p>{rc.open}</p>
        <h3 className="font-bold">Eerst volgende keer</h3>
        <p>{rc.next}</p>
        <h3 className="font-bold">Adres</h3>
        <Link
          href={getMapsLink(rc.address)}
          className="flex gap-1"
          rel="noopener noreferrer"
          target="_blank"
        >
          <SquareArrowOutUpRight />
          {rc.address}
        </Link>
        <p>{}</p>
        <h3 className="font-bold">Contact</h3>
        <Link href={`mailto:${rc.email}`} className="flex gap-1">
          <Mail />
          {rc.email}
        </Link>
        {rc.links && (
          <>
            <h3 className="font-bold">Links</h3>
            <ul>
              {Object.entries(rc.links).map(([type, href]) => (
                <li key={type}>
                  <Link href={href} className="flex gap-1">
                    <SquareArrowOutUpRight />
                    {mapLinkTypeToLabel(type)}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
