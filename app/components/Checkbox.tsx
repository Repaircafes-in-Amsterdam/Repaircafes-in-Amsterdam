"use client";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import Check from "@/app/icons/Check.svg?react";
import classes from "@/app/utils/classes";

type Props = RadixCheckbox.CheckboxProps & {
  label: string;
  className?: string;
  id: string;
};

export default function Checkbox({ label, className, id, ...props }: Props) {
  return (
    <div className="flex items-center gap-2">
      <RadixCheckbox.Root
        className={classes(
          "border-blue data-[state=checked]:bg-blue flex h-[20px] w-[20px] shrink-0 appearance-none items-center justify-center border-2 bg-white",
          className,
        )}
        id={id}
        aria-label={label}
        {...props}
      >
        <RadixCheckbox.Indicator className="text-white">
          <Check className="w-[18px] text-white" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label className="leading-none select-none" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
