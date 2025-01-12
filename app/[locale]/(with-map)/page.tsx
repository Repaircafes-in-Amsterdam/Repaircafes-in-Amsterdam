import { unstable_setRequestLocale } from "next-intl/server";

export default async function HomeServer({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  return null;
}
