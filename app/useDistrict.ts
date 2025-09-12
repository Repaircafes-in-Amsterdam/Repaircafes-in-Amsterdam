import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const defaultValue = "any";

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

const useStore = create(
  combine({ value: defaultValue }, (set) => ({
    setValue: (value: string) => set(() => ({ value })),
  })),
);

export default function useDistrict() {
  const value = useStore((state) => state.value);
  const setValue = useStore((state) => state.setValue);
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
