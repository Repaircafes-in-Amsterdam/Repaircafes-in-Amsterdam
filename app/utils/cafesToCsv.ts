import { stringify } from "csv-stringify/sync";
import { RC } from "@/app/types";
import { LOCALES } from "@/app/constants";

const FIXED_COLUMNS = [
  "name",
  "slug",
  "address",
  "district",
  "email",
  "verified",
  "coordinate",
];
const MULTILINGUAL_FIELDS = [
  "open",
  "closed",
  "doRepair",
  "dontRepair",
  "moreInfo",
] as const;
const ARRAY_FIELDS = [
  "rrule",
  "startTime",
  "endTime",
  "closedRanges",
  "exceptions",
] as const;

function getDynamicColumns(cafes: RC[], field: "links" | "socials") {
  const keys = new Set<string>();
  for (const cafe of cafes) {
    for (const key of Object.keys(cafe[field] ?? {})) {
      keys.add(key);
    }
  }
  return [...keys].sort().map((key) => `${field}_${key}`);
}

export function cafesToCsv(cafes: RC[], options?: { lang?: string | null }) {
  // only use the requested language if it's one we actually support
  const lang =
    options?.lang && (LOCALES as readonly string[]).includes(options.lang)
      ? options.lang
      : undefined;

  const multilingualColumns = lang
    ? MULTILINGUAL_FIELDS.map((field) => field)
    : MULTILINGUAL_FIELDS.flatMap((field) =>
        LOCALES.map((locale) => `${field}_${locale}`),
      );

  const linksColumns = getDynamicColumns(cafes, "links");
  const socialsColumns = getDynamicColumns(cafes, "socials");

  const columns = [
    ...FIXED_COLUMNS,
    ...multilingualColumns,
    ...ARRAY_FIELDS,
    ...linksColumns,
    ...socialsColumns,
  ];

  const rows = cafes.map((cafe) => {
    const row: Record<string, string> = {
      name: cafe.name,
      slug: cafe.slug,
      address: cafe.address,
      district: cafe.district,
      email: cafe.email,
      verified: String(cafe.verified),
      coordinate: cafe.coordinate.join(","),
    };

    for (const field of MULTILINGUAL_FIELDS) {
      if (lang) {
        row[field] = cafe[field][lang] ?? "";
      } else {
        for (const locale of LOCALES) {
          row[`${field}_${locale}`] = cafe[field][locale] ?? "";
        }
      }
    }

    for (const field of ARRAY_FIELDS) {
      row[field] = cafe[field].join("\n");
    }

    for (const column of linksColumns) {
      const key = column.slice("links_".length);
      row[column] = cafe.links?.[key] ?? "";
    }

    for (const column of socialsColumns) {
      const key = column.slice("socials_".length);
      row[column] = cafe.socials?.[key] ?? "";
    }

    return row;
  });

  return stringify(rows, { header: true, columns });
}
