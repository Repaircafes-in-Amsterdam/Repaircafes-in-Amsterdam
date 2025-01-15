import * as RadioGroup from "@radix-ui/react-radio-group";

import classes from "../utils/classes";
import { Label } from "@radix-ui/react-label";

export type Option = {
  value: string;
  label: string;
  ariaLabel?: string;
};

export default function ToggleButton({
  label,
  value,
  options,
  onChange,
  id,
}: {
  label: string;
  value: string;
  onChange: (value: string) => unknown;
  options: Option[];
  id: string;
}) {
  return (
    <div className="flex items-center gap-x-3">
      <Label htmlFor={id}>{label}</Label>
      <RadioGroup.Root
        className="whitespace-nowrap border-2 border-blue"
        value={value}
        onValueChange={onChange}
        id={id}
      >
        {options.map(({ value, label, ariaLabel }) => (
          <RadioGroup.Item
            key={value}
            value={value}
            aria-label={ariaLabel}
            className={classes(
              "border-2 border-blue/0 px-4 py-1",
              "-m-0.5", //overlap border of parent
              "data-[state=checked]:border-blue data-[state=checked]:bg-blue-250 data-[state=checked]:font-bold",
            )}
          >
            {label}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
