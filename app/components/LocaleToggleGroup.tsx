import { useLocale, useTranslations } from "next-intl";
import ToggleGroup from "./ToggleGroup";
import { routing, usePathname, useRouter } from "@/i18n/routing";

export default function LocaleToggleGroup() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();

  return (
    <ToggleGroup
      label={t("language")}
      options={routing.locales.map((locale) => ({
        value: locale,
        label: locale.toUpperCase(),
        ariaLabel: t(`locale.${locale}`),
      }))}
      value={locale}
      id="locale"
      onChange={(value) => {
        router.replace(pathname, { locale: value });
      }}
    />
  );
}
