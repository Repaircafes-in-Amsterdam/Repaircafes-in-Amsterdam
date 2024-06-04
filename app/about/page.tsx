import Link from "next/link";
import Mail from "@/app/icons/Mail.svg?react";
import data from "@/data/data.json";
import BasePage from "../components/BasePage";
import { Metadata } from "next";
import { BASE_URL } from "../constants";
import DetailsSection from "../cafe/[slug]/DetailsSection";

export const metadata: Metadata = {
  title: "Over ons - Repair Cafes in Amsterdam",
  description: "Over Repair Cafés in Amsterdam",
  alternates: {
    canonical: BASE_URL + "about",
  },
};

export default function Page() {
  const numRepairCafes = data.length;
  return (
    <BasePage title="Over ons">
      <div className="prose px-3 pb-3">
        <p>
          Deze agenda is een initiatief van vrijwilligers bij Repair Cafés in
          Amsterdam. Het doel is Repair Cafés toegankelijker te maken door ze
          makkelijker vindbaar te maken met hun openingstijden.
        </p>
        <p>
          Tot dusver staan er {numRepairCafes} Repair Cafés op maar we zijn
          bezig om de informatie van meer bevestigd te krijgen.
        </p>
        <p>
          De website is open source,{" "}
          <a
            href="https://github.com/Repaircafes-in-Amsterdam/Repaircafes-in-Amsterdam"
            target="_blank"
          >
            zie de bron code op Github
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
          onvolledig, dan stellen we een e-mail zeer op prijs. Toevoegen het
          liefst via{" "}
          <a href="https://forms.gle/AQJHMQ7xQsFJ77b47" target="_blank">
            deze vragenlijst
          </a>
          .
        </p>
        <p>We zijn nog op zoek naar hulp bij:</p>
        <ul>
          <li>
            SEO/Marketing. Iemand die andere websites kan benaderen om een link
            naar deze website te plaatsen. De website is geoptimaliseerd voor
            vindbaarheid, maar heeft backlinks nodig om vindbaar te worden in
            zoekmachines.
          </li>

          <li>
            Community management. Iemand die communiceert met alle Repair Cafés
            zodat de agenda zo correct en volledig mogelijk is en dat blijft. Op
            dit moment zijn er nog een handjevol Repair Cafés met wie we nog
            helemaal geen contact hebben kunnen krijgen.
          </li>

          <li>
            Visual / UI / UX Design. Iemand die kan meedenken over de structuur,
            navigatie, hoe dingen moeten werken en hoe het eruit moet zien. We
            hebben een Figma bestand vol ontwerpen die we graag met je delen.
          </li>

          <li>
            Techniek. Voornamelijk front-end development. Iemand die eventueel
            mee kan ontwikkelen en als backup kan fungeren. Iemand met kennis
            van bijvoorbeeld React, Next en Tailwind. Zie de{" "}
            <a href="https://github.com/Repaircafes-in-Amsterdam/Repaircafes-in-Amsterdam">
              code op Github
            </a>{" "}
            voor meer info.
          </li>
        </ul>
      </div>
      <DetailsSection title="Contact" className="px-3 pb-3">
        <Link href="mailto:info@repaircafe.amsterdam" className="flex gap-1">
          <Mail />
          info@repaircafe.amsterdam
        </Link>
      </DetailsSection>
    </BasePage>
  );
}
