"use client";
import { LegacyRef, ReactNode, forwardRef } from "react";
import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import useDistrict, { options } from "./useDistrict";
import ChevronDown from "@/app/icons/ChevronDown.svg?react";
import ChevronUp from "@/app/icons/ChevronUp.svg?react";
import Check from "@/app/icons/Check.svg?react";

export default function DistrictSelect() {
  const { value, setValue } = useDistrict();
  return (
    <div className="flex flex-wrap items-center gap-x-2">
      <Label.Root className="" htmlFor="district">
        Stadsdeel
      </Label.Root>
      {/*  defaultValue="any"  */}
      <Select.Root value={value} onValueChange={setValue}>
        <Select.Trigger
          className="inline-flex h-[35px] items-center justify-center gap-2 border-2 border-blue bg-white px-2 leading-none outline-none"
          aria-label="Stadsdeel"
          id="district"
        >
          <Select.Value />
          <Select.Icon className="">
            <ChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden border-2 border-blue bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
            <Select.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white">
              <ChevronUp />
            </Select.ScrollUpButton>
            <Select.Viewport className="flex flex-col p-[5px] text-blue">
              {options.map(({ value, label }) => (
                <SelectItem key={value as string} value={value as string}>
                  {label}
                </SelectItem>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white">
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
        className="relative flex h-[25px] select-none items-center justify-between px-2 py-1.5 pr-[25px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-250 data-[highlighted]:text-blue data-[highlighted]:outline-none"
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute right-0">
          <Check className="w-[18px]" />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);
SelectItem.displayName = "SelectItem";
