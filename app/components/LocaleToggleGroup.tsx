import { useLocale, useTranslations } from "next-intl";
import ToggleGroup from "./ToggleGroup";
import { LOCALES } from "../constants";
import { usePathname, useRouter } from "../navigation";

export default function LocaleToggleGroup() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();

  return (
    <ToggleGroup
      label={t("language")}
      options={LOCALES.map((locale) => ({
        value: locale,
        label: locale.toUpperCase(),
        ariaLabel: t(`locale.${locale}`),
      }))}
      value={locale}
      onChange={(value) => {
        router.replace(pathname, { locale: value });
      }}
    />
  );
}
