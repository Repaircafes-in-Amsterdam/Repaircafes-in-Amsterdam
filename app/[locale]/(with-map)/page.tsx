import { setRequestLocale } from "next-intl/server";

export default async function HomeServer({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return null;
}
