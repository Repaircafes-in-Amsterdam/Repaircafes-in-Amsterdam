"use client";
import useOfficeHours from "./useOfficeHours";
import Checkbox from "./components/Checkbox";

export default function OfficeHoursCheckbox() {
  const { value, setValue } = useOfficeHours();
  return (
    <Checkbox
      id="office-hours"
      checked={value === "true"}
      onCheckedChange={(value) => setValue(String(value))}
      label="Alleen buiten kantooruren"
    />
  );
}
