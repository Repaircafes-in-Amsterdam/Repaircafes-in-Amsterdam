import { Link } from "@/i18n/routing";
import Mail from "@/app/icons/Mail.svg?react";
import BasePage from "@/app/components/BasePage";
import { Metadata } from "next";
import getAlternates from "@/app/utils/getAlternates";
import DetailsSection from "@/app/components/DetailsSection";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({
    locale,
    namespace: "join-as-boardmember.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates(locale, "join-as-boardmember"),
  };
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "join-as-boardmember" });
  let Content;
  try {
    Content = (await import(`./${locale}.mdx`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <BasePage title={t("title")}>
      <div className="prose px-3 pb-3">
        <Content />
      </div>
    </BasePage>
  );
}
