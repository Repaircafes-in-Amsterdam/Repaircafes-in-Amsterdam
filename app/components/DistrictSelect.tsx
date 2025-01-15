"use client";
import { LegacyRef, ReactNode, forwardRef } from "react";
import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import useDistrict from "../useDistrict";
import ChevronDown from "@/app/icons/ChevronDown.svg?react";
import ChevronUp from "@/app/icons/ChevronUp.svg?react";
import Check from "@/app/icons/Check.svg?react";
import { useTranslations } from "next-intl";

export default function DistrictSelect() {
  const t = useTranslations("district");
  const { value, label, options, setValue } = useDistrict();
  return (
    <div className="flex flex-wrap items-center gap-x-2">
      <Label.Root className="" htmlFor="district">
        {t("label")}
      </Label.Root>
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Trigger
          className="inline-flex w-[145px] items-center justify-between gap-2 border-2 border-blue bg-white px-2 py-1 leading-none outline-none"
          aria-label={t("label")}
          id="district"
        >
          <Select.Value aria-label={label}>{label}</Select.Value>
          <Select.Icon>
            <ChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden border-2 border-blue bg-white text-blue shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
            <Select.ScrollUpButton className="flex cursor-default items-center justify-center bg-white py-1">
              <ChevronUp />
            </Select.ScrollUpButton>
            <Select.Viewport className="flex flex-col text-blue">
              {options.map(({ value, label }) => (
                <SelectItem key={value as string} value={value as string}>
                  {label}
                </SelectItem>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex cursor-default items-center justify-center bg-white py-1">
              <ChevronDown />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

const SelectItem = forwardRef(
  (
    { children, ...props }: { children: ReactNode; value: string },
    forwardedRef: LegacyRef<HTMLDivElement> | undefined,
  ) => {
    return (
      <Select.Item
        className="relative flex select-none items-center justify-between px-2 py-1 leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-250 data-[highlighted]:text-blue data-[highlighted]:outline-none"
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
