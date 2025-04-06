import Warning from "@/app/icons/Warning.svg?react";
import classes from "@/app/utils/classes";
import { useTranslations } from "next-intl";

export default function Unconfirmed({ className }: { className?: string }) {
  const t = useTranslations();
  return (
    <div
      className={classes(
        "bg-orange flex items-center gap-3 p-3 font-medium text-white",
        className,
      )}
    >
      <Warning className="shrink-0" aria-hidden />
      {t("unconfirmed")}
    </div>
  );
}
