import BasePage from "@/app/components/BasePage";
import { Metadata } from "next";
import Image from "next/image";
import getAlternates from "@/app/utils/getAlternates";
import { getTranslations, setRequestLocale } from "next-intl/server";

const FILES: Record<string, string> = {
  nl: "/cheatsheet/reparatie-cheatsheet-nl.pdf",
  en: "/cheatsheet/repair-cheatsheet-en.pdf",
};

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "cheatsheet.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: getAlternates(locale, "cheatsheet"),
  };
}

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "cheatsheet" });
  const file = FILES[locale] ?? FILES.nl;
  const previewLocale = FILES[locale] ? locale : "nl";

  return (
    <BasePage title={t("title")}>
      <div className="flex flex-col gap-4 px-3 pb-3">
        <p>{t("description")}</p>
        <a
          href={file}
          download
          className="bg-blue [@media(hover:hover)]:hover:bg-orange self-start px-4 py-2 font-medium text-white [@media(hover:hover)]:hover:text-blue-600"
          data-ph-capture-attribute-cheatsheet-locale={locale}
        >
          {t("download")}
        </a>
        <a
          href={file}
          className="grid grid-cols-2 gap-3"
          aria-label={t("open")}
        >
          {[1, 2].map((page) => (
            <Image
              key={page}
              src={`/cheatsheet/preview-${previewLocale}-${page}.png`}
              alt={t(`preview-${page}`)}
              width={640}
              height={906}
              priority
              // Page 2 is line art; the palette PNG is smaller than Next's AVIF/WebP re-encode
              unoptimized={page === 2}
              className="border-blue-250 h-auto w-full border"
            />
          ))}
        </a>
      </div>
    </BasePage>
  );
}
