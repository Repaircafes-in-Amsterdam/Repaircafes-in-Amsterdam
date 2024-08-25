import BasePage from "@/app/components/BasePage";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("not-found");

  return (
    <BasePage title={t("title")}>
      <div className="prose px-3 pb-3">{t("body")}</div>
    </BasePage>
  );
}
