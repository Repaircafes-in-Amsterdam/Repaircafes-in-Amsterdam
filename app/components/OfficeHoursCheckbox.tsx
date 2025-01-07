"use client";
import { useTranslations } from "next-intl";
import useOutsideOfficeHours from "../useOutsideOfficeHours";
import Checkbox from "./Checkbox";

export default function OfficeHoursCheckbox() {
  const { value, setValue } = useOutsideOfficeHours();
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
