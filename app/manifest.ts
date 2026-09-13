import { MetadataRoute } from "next";
import { colors } from "@/colors.mjs";

// TODO Translate manifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Repair Cafes in Amsterdam",
    short_name: "Repair Cafes in Amsterdam",
    description:
      "Agenda en kaart van van alle Repair Cafés in Amsterdam. Zie duidelijk wanneer ze open zijn en waar ze te bezoeken zijn",
    start_url: "/",
    display: "standalone",
    background_color: colors.white,
    theme_color: colors.blue.DEFAULT,
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
