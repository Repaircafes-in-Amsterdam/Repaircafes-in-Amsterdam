import { useLocale } from "next-intl";
import { MultilingualData } from "../types";

export default function Multilingual({
  children,
}: {
  children: MultilingualData;
}) {
  const locale = useLocale();
  return children[locale];
}
