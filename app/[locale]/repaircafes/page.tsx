import { Metadata } from "next";
import BasePage from "@/app/components/BasePage";
import { BASE_URL } from "@/app/constants";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({
    locale,
    namespace: "repaircafes.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: BASE_URL + "repaircafes",
    },
  };
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "repaircafes" });

  let Content;
  try {
    Content = (await import(`./${locale}.mdx`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <BasePage title={t("title")}>
      <div className="prose grow px-3 pb-3">
        <Content />
      </div>
    </BasePage>
  );
}
