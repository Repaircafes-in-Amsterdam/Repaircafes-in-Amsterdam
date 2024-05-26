"use client";
import useShowNames from "./useShowNames";
import Checkbox from "@/app/components/Checkbox";

export default function ShowNamesCheckbox() {
  const { value, setValue } = useShowNames();
  return (
    <Checkbox
      id="show-names"
      checked={value === "true"}
      onCheckedChange={(value) => setValue(String(value))}
      label="Toon namen"
    />
  );
}
