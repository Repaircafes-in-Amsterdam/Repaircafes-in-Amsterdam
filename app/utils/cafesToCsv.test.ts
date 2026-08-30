import { describe, expect, it } from "vitest";
import { parse } from "csv-parse/sync";
import { cafesToCsv } from "./cafesToCsv";
import createTestRC from "./createTestRC";

function parseCsv(csv: string): Record<string, string>[] {
  return parse(csv, { columns: true });
}

describe("cafesToCsv", () => {
  it("splits multilingual fields per locale by default", () => {
    const cafes = [
      createTestRC({
        open: { nl: "Elke dinsdag", en: "Every Tuesday" },
      }),
    ];

    const [header] = parseCsv(cafesToCsv(cafes));

    expect(header).toHaveProperty("open_nl", "Elke dinsdag");
    expect(header).toHaveProperty("open_en", "Every Tuesday");
    expect(header).not.toHaveProperty("open");
  });

  it("collapses multilingual fields to a single locale when lang is valid", () => {
    const cafes = [
      createTestRC({
        open: { nl: "Elke dinsdag", en: "Every Tuesday" },
      }),
    ];

    const [row] = parseCsv(cafesToCsv(cafes, { lang: "en" }));

    expect(row).toHaveProperty("open", "Every Tuesday");
    expect(row).not.toHaveProperty("open_nl");
    expect(row).not.toHaveProperty("open_en");
  });

  it("falls back to empty string when the requested locale is missing", () => {
    const cafes = [createTestRC({ open: { nl: "Elke dinsdag" } })];

    const [row] = parseCsv(cafesToCsv(cafes, { lang: "en" }));

    expect(row.open).toBe("");
  });

  it("ignores an invalid lang and falls back to per-locale columns", () => {
    const cafes = [
      createTestRC({ open: { nl: "Elke dinsdag", en: "Every Tuesday" } }),
    ];

    const [row] = parseCsv(cafesToCsv(cafes, { lang: "xx" }));

    expect(row).toHaveProperty("open_nl", "Elke dinsdag");
    expect(row).toHaveProperty("open_en", "Every Tuesday");
  });

  it("combines coordinates into a single comma-separated column", () => {
    const cafes = [createTestRC({ coordinate: [52.371616, 4.889102] })];

    const [row] = parseCsv(cafesToCsv(cafes));

    expect(row.coordinate).toBe("52.371616,4.889102");
  });

  it("renders an empty coordinate as an empty string", () => {
    const cafes = [createTestRC({ coordinate: [] })];

    const [row] = parseCsv(cafesToCsv(cafes));

    expect(row.coordinate).toBe("");
  });

  it("joins multiple array values with a newline in a single cell", () => {
    const cafes = [
      createTestRC({
        rrule: ["FREQ=WEEKLY;BYDAY=TU", "FREQ=WEEKLY;BYDAY=TH"],
      }),
    ];

    const [row] = parseCsv(cafesToCsv(cafes));

    expect(row.rrule).toBe("FREQ=WEEKLY;BYDAY=TU\nFREQ=WEEKLY;BYDAY=TH");
  });

  it("renders single and empty array fields correctly", () => {
    const cafes = [createTestRC({ startTime: ["13:00"], exceptions: [] })];

    const [row] = parseCsv(cafesToCsv(cafes));

    expect(row.startTime).toBe("13:00");
    expect(row.exceptions).toBe("");
  });

  it("creates one column per distinct links/socials key across the dataset", () => {
    const cafes = [
      createTestRC({ slug: "a", links: { website: "a" } }),
      createTestRC({
        slug: "b",
        links: { orgPage: "b" },
        socials: { facebook: "c" },
      }),
    ];

    const [rowA, rowB] = parseCsv(cafesToCsv(cafes));

    expect(rowA).toMatchObject({
      links_website: "a",
      links_orgPage: "",
      socials_facebook: "",
    });
    expect(rowB).toMatchObject({
      links_website: "",
      links_orgPage: "b",
      socials_facebook: "c",
    });
  });

  it("omits links/socials columns entirely when no cafe has them", () => {
    const cafes = [createTestRC({})];

    const [row] = parseCsv(cafesToCsv(cafes));

    expect(Object.keys(row).some((key) => key.startsWith("links_"))).toBe(
      false,
    );
    expect(Object.keys(row).some((key) => key.startsWith("socials_"))).toBe(
      false,
    );
  });

  it("renders verified as literal true/false strings", () => {
    const cafes = [
      createTestRC({ slug: "a", verified: true }),
      createTestRC({ slug: "b", verified: false }),
    ];

    const [rowA, rowB] = parseCsv(cafesToCsv(cafes));

    expect(rowA.verified).toBe("true");
    expect(rowB.verified).toBe("false");
  });

  it("orders columns by each field's first appearance in the source data", () => {
    const cafes = [createTestRC({ links: { website: "a" } })];

    const header = cafesToCsv(cafes).split("\n")[0];

    // matches the key order returned by createTestRC: name, slug, startTime, endTime, rrule, open, ...
    expect(header.indexOf("startTime")).toBeLessThan(header.indexOf("open_nl"));
    expect(header.indexOf("open_en")).toBeLessThan(
      header.indexOf("closedRanges"),
    );
    expect(header.indexOf("moreInfo_en")).toBeLessThan(
      header.indexOf("coordinate"),
    );
    expect(header.indexOf("verified")).toBeLessThan(
      header.indexOf("links_website"),
    );
  });

  it("derives columns for fields not hardcoded, based purely on their runtime shape", () => {
    const cafe = {
      ...createTestRC({}),
      rating: 4.5,
      photos: ["a.jpg", "b.jpg"],
      contact: { phone: "123", fax: "456" },
    } as unknown as ReturnType<typeof createTestRC>;

    const [row] = parseCsv(cafesToCsv([cafe]));

    expect(row.rating).toBe("4.5");
    expect(row.photos).toBe("a.jpg\nb.jpg");
    expect(row.contact_phone).toBe("123");
    expect(row.contact_fax).toBe("456");
  });
});
