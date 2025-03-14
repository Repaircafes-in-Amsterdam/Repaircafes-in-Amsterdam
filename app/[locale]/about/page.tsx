import { Link } from "@/i18n/routing";
import Mail from "@/app/icons/Mail.svg?react";
import data from "@/data/data/cafes.json";
import BasePage from "@/app/components/BasePage";
import { Metadata } from "next";
import { BASE_URL } from "@/app/constants";
import DetailsSection from "@/app/components/DetailsSection";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "about.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: BASE_URL + "about",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const numRepairCafes = data.length;
  let Content;
  try {
    Content = (await import(`./${locale}.mdx`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <BasePage title={t("title")}>
      <div className="prose px-3 pb-3">
        <Content numRepairCafes={numRepairCafes} />
      </div>
      <DetailsSection title={t("contact")} className="px-3 pb-3">
        <Link
          href="mailto:info@repaircafe.amsterdam"
          className="flex items-center gap-1 break-all"
        >
          <Mail aria-hidden className="shrink-0" />
          {t("email")}
        </Link>
      </DetailsSection>
    </BasePage>
  );
}
