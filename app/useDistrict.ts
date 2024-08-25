import { useTranslations } from "next-intl";
import getParamHook from "./getParamHook";
import { useMemo } from "react";

const defaultValue = "any";

const values = [
  defaultValue,
  "Centrum",
  "Nieuw-West",
  "Noord",
  "Oost",
  "West",
  "Zuid",
  "Zuidoost",
  "Diemen",
];

const useHook = getParamHook("district", defaultValue);

export default function useDistrict() {
  const { value, setValue } = useHook();

  const t = useTranslations("districts");

  const options = useMemo(
    () =>
      values.map((value) => ({
        value,
        label: t(value),
      })),
    [t],
  );

  return {
    value,
    label: t(value),
    options,
    setValue,
  };
}
