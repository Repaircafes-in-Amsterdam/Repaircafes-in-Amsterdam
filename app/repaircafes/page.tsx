import Header from "../components/Header";
import BasePage from "../components/BasePage";
import { Metadata } from "next";
import { BASE_URL } from "../constants";
import Details from "../components/Details";
import Summary from "../components/Summary";

export const metadata: Metadata = {
  title: "Over Repair Cafés - Repair Cafes in Amsterdam",
  description:
    "Over Repair Cafés in het algemeen en vaak voorkomende vragen (FAQ)",
  alternates: {
    canonical: BASE_URL + "repaircafes",
  },
};

export default function Page() {
  return (
    <BasePage title="Over Repair Cafés">
      <div className="prose grow px-3 pb-3">
        <Header>Wat is een Repair Café?</Header>
        <p>
          Repair Cafés zijn gratis toegankelijke bijeenkomsten die draaien om
          (samen) repareren. Op de locatie waar het Repair Café wordt gehouden,
          is gereedschap en materiaal aanwezig om alle mogelijke reparaties uit
          te voeren. Op kleding, meubels, elektrische apparaten, fietsen,
          speelgoed etc. Ook zijn deskundige vrijwilligers aanwezig, met
          reparatie-kennis en – vaardigheden op allerlei terreinen.
        </p>
        <p>
          Bezoekers nemen van thuis kapotte spullen mee. In het Repair Café gaan
          ze samen met de deskundigen aan de slag. Zo valt er altijd wel wat te
          leren. Wie niets heeft om te repareren, neemt een kop koffie of thee.
          Of gaat helpen bij een reparatie van iemand anders
        </p>
        <div className="aspect-h-9 aspect-w-16">
          <iframe
            src="https://www.youtube.com/embed/xPXX7aFAVdY"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
            allowFullScreen
            className="border-0"
          ></iframe>
        </div>
        <p>
          Wereldwijd zijn er bijna 3000 Repair Cafés. Het eerste Repair Café
          organiseerde Martine Postma op 18 oktober 2009 in Amsterdam-West. Op
          de{" "}
          <a href="https://www.repaircafe.org/">
            internationale Repair Café-website
          </a>{" "}
          lees je meer over de achtergrond en vind je alle Repair Cafés.
        </p>
        <Details>
          <Summary>Moet ik mij aanmelden?</Summary>
          <p>
            Je kunt gedurende de openingstijd van een Repair Café gewoon
            binnenlopen met je kapotte spullen, zonder afspraak. Sommige Repair
            Cafés werken met inschrijfformulieren. Als dat het geval is, zal de
            gastvrouw of -heer je die aanreiken en uitleg geven.
          </p>
          <p>
            Soms is het flink druk. We proberen de wachttijd aanvaardbaar te
            houden. Daarom kun je vaak maar één ding tegelijk laten repareren.
            Daarna kun je weer achteraan sluiten voor een eventueel volgend
            item.
          </p>
        </Details>

        <Details>
          <Summary>Kosten?</Summary>

          <p>
            De toegang tot de Repair Cafés (inclusief de hulp bij reparaties) is
            gratis, maar een vrijwillige bijdrage wordt zeer op prijs gesteld.
            Kosten maak je dus alleen voor vervangende onderdelen (als die nodig
            zijn). Het kan zijn dat een Repair Café wat vraagt voor een kopje
            koffie of glaasje fris.
          </p>
        </Details>
        <Details>
          <Summary>Reparatie achterlaten?</Summary>
          <p>
            Je kan je reparatie niet achterlaten, het idee is om samen met een
            vrijwilliger aan de slag te gaan. Schroom niet zelf de handen uit de
            mouwen te steken. Schroeven losdraaien of een zoom tornen
            bijvoorbeeld, kan vrijwel iedereen. Veel mensen kunnen online wat
            onderzoek doen. Als je wilt kun je ook de reparatie zelf uitvoeren,
            onder begeleiding van de reparateur.
          </p>
        </Details>

        <Details>
          <Summary>Komen jullie aan huis?</Summary>
          <p>
            In principe niet. Het Repair Café is geen klussendienst, maar een
            ontmoetingsplaats waar mensen gezamenlijk hun spullen kunnen
            repareren. Wel kun je, tijdens een bezoek aan een Repair Café in
            jouw buurt, contact leggen met een van de aanwezige reparateurs en
            je vraag stellen. Wie weet vindt iemand het leuk om je te helpen.
          </p>
        </Details>

        <Details>
          <Summary>Garantie?</Summary>
          <p>
            Repair Cafés geven geen garantie. Veel reparaties lukken. Maar
            helaas komt het ook wel voor dat een poging mislukt. Of een
            reparatie lijkt aanvankelijk geslaagd, maar het betreffende voorwerp
            blijkt na thuiskomst toch niet in orde te zijn.
          </p>
        </Details>

        <Details>
          <Summary>Aansprakelijkheid?</Summary>
          <p>
            Noch de organisatoren, noch de vrijwilligers van een Repair Café
            zijn aansprakelijk voor schade als gevolg van verstrekte reparatie
            adviezen of -instructies, voor schade aan de ter reparatie
            aangeboden voorwerpen, voor gevolgschade of voor andere schade die
            het gevolg is van activiteiten in het Repair Café. Je biedt je
            spullen dus op eigen risico ter reparatie aan.
          </p>
        </Details>

        <Details>
          <Summary>Word ik altijd geholpen?</Summary>
          <p>
            Bijna altijd, maar soms kan het erg druk zijn bij een Repair Café en
            kan het gebeuren dat je niet aan de beurt komt. Reparateurs hebben
            ook het recht reparatie van bepaalde spullen te weigeren,
            bijvoorbeeld omdat ze inschatten dat de reparatie te ingewikkeld
            gaat worden.
          </p>
        </Details>
        <Details>
          <Summary>Vrijwilliger worden?</Summary>
          <p>
            Kun je iets heel goed en wil je dit graag aan een ander leren? Denk
            aan de reparatie van lampen, het fiksen van een gat in een
            spijkerbroek of ben je expert op het gebied van een specifiek
            apparaat? Misschien wil je zelf leren repareren onder begeleiding
            van een ervaren reparateur? Of misschien wil je helpen met mensen
            verwelkomen met koffie, thee en lekkers en helpen als
            gastvrouw/heer?
          </p>
          <p>Neem in dat geval contact op met een specifiek Repair Cafe.</p>
        </Details>
      </div>
    </BasePage>
  );
}
