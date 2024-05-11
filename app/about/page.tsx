import Link from "next/link";
import ChevronLeft from "@/app/icons/ChevronLeft.svg?react";
import Mail from "@/app/icons/Mail.svg?react";
import data from "@/data/data.json";
import BasePage from "../components/BasePage";

export default function Page() {
  const numRepairCafes = data.length;
  return (
    <BasePage title="Over ons">
      <div className="prose px-3 pb-3">
        <p>
          Deze website is een initiatief van vrijwilligers bij Repair Cafés in
          Amsterdam. Het doel is Repair Cafés toegankelijker te maken door ze
          makkelijker vindbaar te maken met hun openingstijden.
        </p>
        <p>
          Tot dusver staan er {numRepairCafes} Repair Cafés op deze website maar
          we zijn bezig om de informatie van meer bevestigd te krijgen.
        </p>
        <p>
          De aankomende lijst / agenda houdt op dit moment nog geen rekening met
          wanneer Repair Cafés gesloten zijn (zoals met feestdagen).
        </p>
        <p>
          De website is open source,{" "}
          <a
            href="https://github.com/Repaircafes-in-Amsterdam/Repaircafes-in-Amsterdam"
            target="_blank"
          >
            zie de source code op Github
          </a>
          .
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
      </div>
      <div className="px-3 pb-3">
        <h3 className="font-bold">Contact</h3>
        <Link href="mailto:info@repaircafe.amsterdam" className="flex gap-1">
          <Mail />
          info@repaircafe.amsterdam
        </Link>
      </div>
    </BasePage>
  );
}
