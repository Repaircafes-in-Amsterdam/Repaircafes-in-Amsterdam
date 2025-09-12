"use client";
import { useTranslations } from "next-intl";
import useOutsideOfficeHours from "../useOutsideOfficeHours";
import Checkbox from "./Checkbox";

export default function OfficeHoursCheckbox() {
  const value = useOutsideOfficeHours((state) => state.value);
  const setValue = useOutsideOfficeHours((state) => state.setValue);

  const t = useTranslations();
  return (
    <Checkbox
      id="office-hours"
      checked={value}
      onCheckedChange={setValue}
      label={t("outside-office-hours-only")}
    />
  );
}
