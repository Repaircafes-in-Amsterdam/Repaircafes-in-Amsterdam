import Link from "next/link";
import ChevronLeft from "@/app/icons/ChevronLeft.svg?react";
import Mail from "@/app/icons/Mail.svg?react";
import data from "@/data/data.json";

export default function Page() {
  const numRepairCafes = data.length;
  console.log("numRepairCafes: ", numRepairCafes);
  return (
    <main className="flex shrink grow flex-col text-blue">
      <Link href="/" className="flex gap-3 p-3">
        <ChevronLeft />
        <h2 className="font-bold">Over ons</h2>
      </Link>

      <div className="flex h-px grow flex-col gap-3 overflow-y-auto px-3">
        <p>
          Deze website is een initiatief van vrijwilligers bij Repair Cafés in
          Amsterdam. Het doel is Repair Cafés toegankelijker te maken door ze
          makkelijker vindbaar te maken met hun openingstijden.
        </p>
        <p>
          Tot dusver staan er {numRepairCafes} Repair Cafés op deze website.
        </p>
        <p>
          De informatie op deze website is Amsterdam specifiek, voor meer
          informatie over Repair Cafés in het algemeen zie{" "}
          <a
            href="https://repaircafe.org"
            target="_blank"
            className="underline"
          >
            repaircafe.org
          </a>
          .
        </p>

        <p>
          Wil je een Repair Café toevoegen of is er informatie incorrect of
          onvolledig, dan stellen we een e-mail zeer op prijs.
        </p>
        <div>
          <h3 className="font-bold">Contact</h3>
          <Link href="mailto:info@repaircafe.amsterdam" className="flex gap-1">
            <Mail />
            info@repaircafe.amsterdam
          </Link>
        </div>
      </div>
    </main>
  );
}
