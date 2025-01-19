"use client";
import { Ref, ReactNode, forwardRef } from "react";
import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import ChevronDown from "@/app/icons/ChevronDown.svg?react";
import Check from "@/app/icons/Check.svg?react";
import { useLocale, useTranslations } from "next-intl";
import classes from "../utils/classes";
import { routing, usePathname, useRouter } from "@/i18n/routing";

export default function LocaleSelect({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  return (
    <div className={classes("-mx-2 -my-1", className)}>
      <Label.Root className="sr-only text-white" htmlFor="locale">
        {t("language")}
      </Label.Root>
      <Select.Root
        value={locale}
        onValueChange={(value) => {
          router.replace(pathname, { locale: value });
        }}
      >
        <Select.Trigger
          className="inline-flex items-center justify-between gap-1 px-2 py-1 leading-none text-white outline-none"
          aria-label={t("language")}
          id="locale"
        >
          <Select.Value aria-label={t(`locale.${locale}`)}>
            {locale.toUpperCase()}
          </Select.Value>
          <Select.Icon>
            <ChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="border-2 border-blue bg-white text-blue shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
            <Select.Viewport className="flex flex-col">
              {routing.locales.map((locale) => (
                <SelectItem key={locale} value={locale}>
                  {locale.toUpperCase()}
                </SelectItem>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

const SelectItem = forwardRef(
  (
    { children, ...props }: { children: ReactNode; value: string },
    forwardedRef: Ref<HTMLDivElement> | undefined,
  ) => {
    return (
      <Select.Item
        className="relative flex select-none items-center justify-between gap-2 px-2 py-1 leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-250 data-[highlighted]:text-blue data-[highlighted]:outline-none"
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText className="grow">{children}</Select.ItemText>
        <div className="h-6">
          <Select.ItemIndicator>
            <Check className="w-6" />
          </Select.ItemIndicator>
        </div>
      </Select.Item>
    );
  },
);
SelectItem.displayName = "SelectItem";
