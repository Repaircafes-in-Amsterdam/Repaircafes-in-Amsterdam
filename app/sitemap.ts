import type { MetadataRoute } from "next";
import data from "@/data/data.json";
import { BASE_URL } from "./constants";

const cafes: MetadataRoute.Sitemap = data.map((rc) => ({
  url: BASE_URL + `cafe/${rc.slug}/`,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.9,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  console.log("sitemap arguments: ", arguments);
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...cafes,
    {
      url: BASE_URL + "repaircafes/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: BASE_URL + "about/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: BASE_URL + "map/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
