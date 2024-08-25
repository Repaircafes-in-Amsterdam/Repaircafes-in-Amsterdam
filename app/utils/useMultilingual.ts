import { useLocale } from "next-intl";
import { MultilingualData } from "../types";

export default function useMultilingual() {
  const locale = useLocale();
  return (value: MultilingualData) => value[locale];
}
