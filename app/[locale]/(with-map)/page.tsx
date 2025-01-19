import { setRequestLocale } from "next-intl/server";

export default async function HomeServer(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  return null;
}
