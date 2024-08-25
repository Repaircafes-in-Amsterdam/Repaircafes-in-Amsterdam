import MapServer from "@/app/components/map/MapServer";
import { unstable_setRequestLocale } from "next-intl/server";

export default function layout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale);
  return (
    <>
      {children}
      <MapServer />
    </>
  );
}
