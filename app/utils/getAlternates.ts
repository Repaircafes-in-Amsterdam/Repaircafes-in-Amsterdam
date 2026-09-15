import { BASE_URL } from "@/app/constants";
import { routing } from "@/i18n/routing";

// Builds locale-aware canonical + hreflang alternates for a given path,
// mirroring the URL logic in app/sitemap.ts.
export default function getAlternates(locale: string, path: string = "") {
  const localizedUrl = (l: string) =>
    `${BASE_URL}${l === routing.defaultLocale ? "" : `${l}/`}${path}`;

  return {
    canonical: localizedUrl(locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localizedUrl(l)])),
      "x-default": `${BASE_URL}${path}`,
    },
  };
}
