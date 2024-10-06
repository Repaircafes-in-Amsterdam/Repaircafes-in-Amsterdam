import type { Metadata } from "next";
import { Link } from "@/app/navigation";
import ExternalLink from "@/app/icons/ExternalLink.svg?react";
import BasePage from "@/app/components/BasePage";
import DetailsSection from "@/app/components/DetailsSection";
import festivalsData from "@/data/data/festivals.json";
import { Festival } from "@/app/types";
import JsonLd from "@/app/components/JsonLd";
import getFestivalJsonLd from "./getFestivalJsonLd";
import { BASE_URL } from "@/app/constants";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import useMultilingual from "@/app/utils/useMultilingual";
import getDateString from "@/app/utils/getDateString";

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "festival" });
  const festival = festivalsData.find((festival) => festival.slug === slug);
  const name = festival?.name || t("unknown.title");
  return {
    title: t("metadata.title", { name }),
    alternates: {
      canonical: BASE_URL + "festival/" + slug,
    },
  };
}

function getMapsLink(adres: string) {
  const fullAdres = `${adres} Amsterdam`;
  return `https://maps.google.com?q=${encodeURIComponent(fullAdres)}`;
}

export default async function FestivalServer({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  unstable_setRequestLocale(locale);

  const festival = festivalsData.find(
    (festival) => festival.slug === slug,
  ) as Festival;
  if (!festival) notFound();

  return <FestivalClient festival={festival} />;
}

function FestivalClient({ festival }: { festival: Festival }) {
  const locale = useLocale();
  const t = useTranslations("festival");
  const multilingual = useMultilingual();

  const {
    name,
    date: rawDate,
    description: rawDescription,
    startTime,
    endTime,
    location,
    address,
    link,
  } = festival;

  const description = multilingual(rawDescription);

  const date = `${getDateString(new Date(rawDate), locale)} ${startTime} - ${endTime}`;

  return (
    <BasePage title={name} enableBackHome side>
      <div className="flex grow flex-col gap-2 overflow-y-auto px-3 pb-3">
        <DetailsSection title={t("date")}>{date}</DetailsSection>
        <DetailsSection title={t("information")}>{description}</DetailsSection>
        <Link
          href={link}
          className="flex gap-1"
          rel="noreferrer"
          target="_blank"
        >
          <ExternalLink className="shrink-0" />
          {t("moreInfo")}
        </Link>
        <DetailsSection title={t("location")}>{location}</DetailsSection>
        <DetailsSection title={t("address")}>
          <Link
            href={getMapsLink(address)}
            className="flex gap-1"
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="shrink-0" />
            {address}
          </Link>
        </DetailsSection>
      </div>
      <JsonLd jsonLd={getFestivalJsonLd(festival, locale)} />
    </BasePage>
  );
}
