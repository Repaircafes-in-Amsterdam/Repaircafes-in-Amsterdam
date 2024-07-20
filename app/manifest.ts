import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Repair Cafes in Amsterdam",
    short_name: "Repair Cafes in Amsterdam",
    description:
      "Agenda en kaart van van alle Repair Cafés in Amsterdam. Zie duidelijk wanneer ze open zijn en waar ze te bezoeken zijn",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#2D2E82",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
