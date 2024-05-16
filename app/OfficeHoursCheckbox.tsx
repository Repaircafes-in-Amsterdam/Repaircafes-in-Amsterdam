"use client";
import * as Checkbox from "@radix-ui/react-checkbox";
import Check from "@/app/icons/Check.svg?react";
import useOfficeHours from "./useOfficeHours";

export default function OfficeHoursCheckbox() {
  const { value, setValue } = useOfficeHours();
  return (
    <div className="flex items-center gap-2">
      <Checkbox.Root
        className="flex h-[20px] w-[20px] shrink-0 appearance-none items-center justify-center border-2 border-blue bg-white outline-none data-[state=checked]:bg-blue"
        id="office-hours"
        checked={value === "true"}
        onCheckedChange={(value) => setValue(String(value))}
        aria-label="Alleen buiten kantooruren"
      >
        <Checkbox.Indicator className="text-white">
          <Check className="w-[18px] text-white" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className="leading-none" htmlFor="office-hours">
        Alleen buiten kantooruren
      </label>
    </div>
  );
}
