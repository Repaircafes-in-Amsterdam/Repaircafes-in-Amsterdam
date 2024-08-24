import * as RadioGroup from "@radix-ui/react-radio-group";

import classes from "../utils/classes";

export type Option = {
  value: string;
  label: string;
};

export default function ToggleButton({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => unknown;
  options: Option[];
}) {
  return (
    <div className="flex items-center gap-x-3">
      <div>{label}</div>
      <RadioGroup.Root
        className="whitespace-nowrap border border-blue"
        value={value}
        onValueChange={onChange}
        aria-label={label}
      >
        {options.map(({ value, label }) => (
          <RadioGroup.Item
            key={value}
            value={value}
            className={classes(
              "border-2 border-blue/0 px-4 py-1",
              "-m-px", //overlap border of parent
              "data-[state=checked]:border-blue data-[state=checked]:font-bold",
            )}
          >
            {label}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}
