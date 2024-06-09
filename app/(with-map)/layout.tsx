import MapServer from "../components/map/MapServer";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <MapServer />
    </>
  );
}
