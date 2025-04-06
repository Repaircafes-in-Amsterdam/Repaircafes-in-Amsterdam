import { ReactNode, Suspense } from "react";
import ChevronLeft from "@/app/icons/ChevronLeft.svg?react";
import X from "@/app/icons/X.svg?react";
import BackButton from "./BackButton";
import classes from "@/app/utils/classes";
import { useTranslations } from "next-intl";

export default function BasePage({
  title,
  children,
  className,
  enableBackHome = false,
  showHeader = true,
  side = false,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  enableBackHome?: boolean;
  showHeader?: boolean;
  side?: boolean;
}) {
  const t = useTranslations();
  return (
    <div
      className={classes(
        "max-w-body relative flex w-full grow flex-col",
        side
          ? "border-blue body:max-w-side body:shrink-0 body:border-r-2 min-h-px overflow-y-auto focus-visible:-outline-offset-2"
          : "h-max",
        className,
      )}
    >
      {showHeader ? (
        <div className="sticky top-0 z-10 flex gap-3 bg-white p-3 xl:flex-row-reverse">
          <Suspense>
            <BackButton className="body:hidden">
              <ChevronLeft title={t("go-back")} />
            </BackButton>
          </Suspense>
          {enableBackHome && (
            <BackButton backHome className="body:block hidden">
              <ChevronLeft title={t("go-back")} className="xl:hidden" />
              <X title={t("close")} className="hidden xl:block" />
            </BackButton>
          )}
          <h1 className="grow font-bold">{title}</h1>
        </div>
      ) : (
        <h1 className="sr-only">{title}</h1>
      )}
      <div className="grow">{children}</div>
    </div>
  );
}
