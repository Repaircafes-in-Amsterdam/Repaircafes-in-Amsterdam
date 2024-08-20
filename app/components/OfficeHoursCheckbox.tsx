"use client";
import { useTranslations } from "next-intl";
import useOfficeHours from "../useOfficeHours";
import Checkbox from "./Checkbox";

export default function OfficeHoursCheckbox() {
  const { value, setValue } = useOfficeHours();
  const t = useTranslations();
  return (
    <Checkbox
      id="office-hours"
      checked={value === "true"}
      onCheckedChange={(value) => setValue(String(value))}
      label={t("outside-office-hours-only")}
    />
  );
}
