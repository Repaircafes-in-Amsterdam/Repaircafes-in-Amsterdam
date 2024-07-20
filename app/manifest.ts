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
        src: "/favicon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/favicon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: "/icon.svg",
        sizes: "257x257",
        type: "image/svg+xml",
      },
    ],
  };
}
