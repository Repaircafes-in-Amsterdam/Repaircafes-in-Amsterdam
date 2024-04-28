"use client";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import useOfficeHours from "./useOfficeHours";

export default function OfficeHoursCheckbox() {
  const { value, setValue } = useOfficeHours();
  return (
    <div className="flex items-center gap-2">
      <Checkbox.Root
        className="flex h-[20px] w-[20px] appearance-none items-center justify-center bg-white border-blue border-2 outline-none data-[state=checked]:bg-blue shrink-0"
        id="office-hours"
        checked={value === "true"}
        onCheckedChange={(value) => setValue(String(value))}
      >
        <Checkbox.Indicator className="text-white w-[18px]">
          <Check className="text-white w-[18px]" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className="leading-none" htmlFor="office-hours">
        Alleen buiten Kantooruren
      </label>
    </div>
  );
}
