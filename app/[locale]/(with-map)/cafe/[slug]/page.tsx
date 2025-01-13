import type { Metadata } from "next";
import { Link } from "@/app/navigation";
import ChevronRight from "@/app/icons/ChevronRight.svg?react";
import Mail from "@/app/icons/Mail.svg?react";
import ExternalLink from "@/app/icons/ExternalLink.svg?react";
import BasePage from "@/app/components/BasePage";
import DetailsSection from "@/app/components/DetailsSection";
import data from "@/data/data/cafes.json";
import { RC, Event } from "@/app/types";
import JsonLd from "@/app/components/JsonLd";
import getCafeJsonLd from "./getCafeJsonLd";
import getEvents from "@/app/actions/getEvents";
import { BASE_URL } from "@/app/constants";
import Unconfirmed from "@/app/components/Unconfirmed";
import LinksSection from "@/app/components/LinksSection";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import useMultilingual from "@/app/utils/useMultilingual";
import ScrollToTop from "@/app/components/ScrollToTop";

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "cafe" });
  const rc = data.find((rc) => rc.slug === slug);
  const name = rc?.name || t("unknown.title");
  return {
    title: t("metadata.title", { name }),
    alternates: {
      canonical: BASE_URL + "cafe/" + slug,
    },
  };
}

function getMapsLink(adres: string) {
  const fullAdres = `${adres} Amsterdam`;
  return `https://maps.google.com?q=${encodeURIComponent(fullAdres)}`;
}

export default async function CafeServer({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  unstable_setRequestLocale(locale);

  const rc = data.find((rc) => rc.slug === slug) as RC;
  if (!rc) notFound();

  const events: Event[] = await getEvents({
    slug: rc.slug,
    numMonths: 3,
    locale,
  });
  const next = events[0]?.dateString;

  return <CafeClient rc={rc} next={next} />;
}

function CafeClient({ rc, next }: { rc: RC; next: string }) {
  const locale = useLocale();
  const t = useTranslations("cafe");
  const multilingual = useMultilingual();

  const closed = multilingual(rc.closed);
  const doRepair = multilingual(rc.doRepair);
  const dontRepair = multilingual(rc.dontRepair);
  const moreInfo = multilingual(rc.moreInfo);

  return (
    <BasePage title={rc.name} enableBackHome side>
      <ScrollToTop selector="main" />
      {!rc.verified && <Unconfirmed className="mb-1.5" />}
      <div className="flex grow flex-col gap-2 overflow-y-auto px-3 pb-3">
        <DetailsSection title={t("open")}>
          {multilingual(rc.open)}
        </DetailsSection>
        {next && <DetailsSection title={t("next")}>{next}</DetailsSection>}
        {closed && (
          <DetailsSection title={t("closed")}>{closed}</DetailsSection>
        )}
        <DetailsSection title={t("address")}>
          <Link
            href={getMapsLink(rc.address)}
            className="flex items-center gap-1"
            rel="noreferrer"
            target="_blank"
            data-ph-capture-attribute-link-type="map"
          >
            <ExternalLink className="shrink-0" aria-hidden />
            {rc.address}
          </Link>
        </DetailsSection>
        {doRepair && (
          <DetailsSection title={t("doRepair")}>{doRepair}</DetailsSection>
        )}
        {dontRepair && (
          <DetailsSection title={t("dontRepair")}>{dontRepair}</DetailsSection>
        )}
        {moreInfo && (
          <DetailsSection title={t("moreInfo")}>{moreInfo}</DetailsSection>
        )}
        {rc.email && (
          <DetailsSection title={t("contact")}>
            <Link
              href={`mailto:${rc.email}`}
              className="flex items-center gap-1 break-all"
              data-ph-capture-attribute-link-type="email"
            >
              <Mail className="shrink-0" aria-hidden />
              {rc.email}
            </Link>
          </DetailsSection>
        )}
        {rc.links && (
          <LinksSection title={t("links")} links={rc.links} name={rc.name} />
        )}
        {rc.socials && (
          <LinksSection title={t("social")} links={rc.socials} name={rc.name} />
        )}
        <Link
          href="/repaircafes"
          className="mt-2 flex items-center gap-1"
          data-ph-capture-attribute-link-type="repaircafes"
        >
          <ChevronRight className="shrink-0" aria-hidden />
          {t("read-more-about-repair-cafes")}
        </Link>
      </div>
      <JsonLd jsonLd={getCafeJsonLd(rc, locale)} />
    </BasePage>
  );
}
