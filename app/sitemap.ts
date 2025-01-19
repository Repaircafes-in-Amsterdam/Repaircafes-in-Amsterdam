import type { MetadataRoute } from "next";
import data from "@/data/data/cafes.json";
import { BASE_URL } from "./constants";
import { routing } from "@/i18n/routing";

const cafes: MetadataRoute.Sitemap = data.map((rc) => ({
  url: `cafe/${rc.slug}`,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.9,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return (
    [
      {
        url: "",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      ...cafes,
      {
        url: "repaircafes",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: "about",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: "map",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      },
    ] as MetadataRoute.Sitemap
  ).map((entry) => ({
    ...entry,
    // Add base url to all urls
    url: BASE_URL + entry.url,
    // Add language alternates
    alternates: {
      languages: {
        ...Object.fromEntries(
          routing.locales.map((locale) => [
            locale,
            `${BASE_URL}${locale === routing.defaultLocale ? "" : `${locale}/`}${entry.url}`,
          ]),
        ),
        "x-default": `${BASE_URL}${entry.url}`,
      },
    },
  }));
}
