import { stringify } from "csv-stringify/sync";
import { RC } from "@/app/types";
import { LOCALES } from "@/app/constants";

type FieldInfo =
  | { kind: "scalar" | "coordinate" | "array" }
  | { kind: "multilingual" }
  | { kind: "object"; keys: string[] };

// classify a field purely by its runtime shape, so new RC fields need no code changes here
function classifyValue(field: string, value: unknown): FieldInfo {
  if (Array.isArray(value)) {
    return { kind: field === "coordinate" ? "coordinate" : "array" };
  }
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>);
    const isMultilingual =
      keys.length > 0 &&
      keys.every((key) => (LOCALES as readonly string[]).includes(key));
    return isMultilingual
      ? { kind: "multilingual" }
      : { kind: "object", keys: [...keys].sort() };
  }
  return { kind: "scalar" };
}

// scan every cafe to determine, per field, its shape and (for object fields) the union of keys seen
function collectFields(cafes: RC[]) {
  const fieldOrder: string[] = [];
  const fields = new Map<string, FieldInfo>();

  for (const cafe of cafes) {
    for (const [field, value] of Object.entries(cafe)) {
      if (value === undefined) continue;

      if (!fields.has(field)) fieldOrder.push(field);

      const info = classifyValue(field, value);
      const existing = fields.get(field);

      if (existing?.kind === "object" && info.kind === "object") {
        // merge the keys of two object fields, so we can derive a superset of columns for CSV export
        fields.set(field, {
          kind: "object",
          keys: [...new Set([...existing.keys, ...info.keys])].sort(),
        });
      } else if (!existing) {
        fields.set(field, info);
      }
    }
  }

  return { fieldOrder, fields };
}

export function cafesToCsv(cafes: RC[], options?: { lang?: string | null }) {
  // only use the requested language if it's one we actually support
  const lang =
    options?.lang && (LOCALES as readonly string[]).includes(options.lang)
      ? options.lang
      : undefined;

  const { fieldOrder, fields } = collectFields(cafes);

  const columns = fieldOrder.flatMap((field) => {
    const info = fields.get(field)!;
    if (info.kind === "multilingual") {
      // if a specific language was requested, only include that column; otherwise include all locales with the field name suffixed by the locale code
      return lang ? [field] : LOCALES.map((locale) => `${field}_${locale}`);
    }
    if (info.kind === "object") {
      return info.keys.map((key) => `${field}_${key}`);
    }
    return [field];
  });

  const rows = cafes.map((cafe) => {
    const row: Record<string, string> = {};
    const cafeRecord = cafe as unknown as Record<string, unknown>;

    for (const field of fieldOrder) {
      const info = fields.get(field)!;
      const value = cafeRecord[field];

      if (info.kind === "coordinate") {
        row[field] = Array.isArray(value) ? value.join(",") : "";
      } else if (info.kind === "array") {
        row[field] = Array.isArray(value) ? value.join("\n") : "";
      } else if (info.kind === "multilingual") {
        const dict = (value as Record<string, string>) ?? {};
        if (lang) {
          row[field] = dict[lang] ?? "";
        } else {
          for (const locale of LOCALES) {
            row[`${field}_${locale}`] = dict[locale] ?? "";
          }
        }
      } else if (info.kind === "object") {
        const dict = (value as Record<string, string>) ?? {};
        for (const key of info.keys) {
          row[`${field}_${key}`] = dict[key] ?? "";
        }
      } else {
        row[field] = value === undefined || value === null ? "" : String(value);
      }
    }

    return row;
  });

  return stringify(rows, { header: true, columns });
}
