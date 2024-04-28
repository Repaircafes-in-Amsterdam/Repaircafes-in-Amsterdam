"use client";
import { ReactNode, forwardRef } from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import useDistrict, { options } from "./useDistrict";

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
          className="inline-flex items-center justify-center px-2 leading-none h-[35px] gap-2 bg-white border-2 border-blue outline-none"
          aria-label="Stadsdeel"
          id="district"
        >
          <Select.Value />
          <Select.Icon className="">
            <ChevronDown />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden bg-white border-2 border-blue shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
            <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white cursor-default">
              <ChevronUp />
            </Select.ScrollUpButton>
            <Select.Viewport className="p-[5px] flex flex-col text-blue">
              {options.map(({ value, label }) => (
                <SelectItem key={value as string} value={value as string}>
                  {label}
                </SelectItem>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white cursor-default">
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
    forwardedRef
  ) => {
    return (
      <Select.Item
        className="px-2 py-1.5 leading-none flex items-center h-[25px] relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-250 data-[highlighted]:text-blue justify-between pr-[25px]"
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute right-0">
          <Check />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);
SelectItem.displayName = "SelectItem";
