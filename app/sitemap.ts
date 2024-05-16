import type { MetadataRoute } from "next";
import data from "@/data/data.json";

const baseURL = "https://repaircafe.amsterdam/";

const cafes: MetadataRoute.Sitemap = data.map((rc) => ({
  url: baseURL + "cafe/" + rc.slug,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.9,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  console.log("sitemap arguments: ", arguments);
  return [
    {
      url: baseURL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...cafes,
    {
      url: baseURL + "repaircafes",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: baseURL + "about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: baseURL + "map",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
